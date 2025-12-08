import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const CommentForm = ({ postId, postTitle, onCommentAdded }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const [previewEmoji, setPreviewEmoji] = useState(null);
    const [previewPos, setPreviewPos] = useState({ top: 0, left: 0 });
    const editorRef = useRef(null);
    const pickerRef = useRef(null);
    const buttonRef = useRef(null);

    // Close emoji picker on click outside or ESC
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showEmoji &&
                pickerRef.current &&
                !pickerRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)) {
                setShowEmoji(false);
            }
        };

        const handleEscKey = (event) => {
            if (showEmoji && event.key === 'Escape') {
                setShowEmoji(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [showEmoji]);

    // WeChat emojis (Official URLs - Top 50)
    const wechatEmojis = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        url: `https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${i}.gif`
    }));

    // Helper to Convert HTML to Markdown (simple version for this use case)
    const parseContent = () => {
        if (!editorRef.current) return '';

        // Clone node to process
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = editorRef.current.innerHTML;

        // Clean up common browser-inserted block elements to newlines
        // Replace <div><br></div> with newline (Chrome)
        const blockDivs = tempDiv.querySelectorAll('div');
        blockDivs.forEach(div => {
            // If div only contains br, replace with newline
            // If div contains text, it is likely a line wrap
            if (div.querySelector('br')) {
                div.replaceWith('\n');
            } else {
                div.replaceWith('\n' + div.innerHTML);
            }
        });

        // Replace <br> with newline
        const brs = tempDiv.querySelectorAll('br');
        brs.forEach(br => br.replaceWith('\n'));

        // Parse Images to Markdown
        const images = tempDiv.getElementsByTagName('img');
        while (images.length > 0) {
            const img = images[0];
            const url = img.src;
            // Only convert our emojis
            if (url.includes('res.wx.qq.com')) {
                const markdown = `![wechat_emoji](${url}) `;
                img.replaceWith(markdown);
            } else {
                // For now, remove other images or keep alt
                img.replaceWith(img.alt || '');
            }
        }

        let text = tempDiv.textContent || tempDiv.innerText || "";
        return text.trim();
    };

    const handleInput = () => {
        const markdown = parseContent();
        setContent(markdown);
    };

    const insertEmoji = (url) => {
        const editor = editorRef.current;
        if (!editor) return;

        editor.focus();

        // Create the image element
        const img = document.createElement('img');
        img.src = url;
        img.alt = "wechat_emoji";
        img.contentEditable = false; // Prevent editing the image itself
        // Removed pointer-events-none to technically allow selection if needed, but select-none keeps it clean
        img.className = "inline-block w-6 h-6 align-text-bottom mx-1 select-none align-middle";

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);

            // Validate range is inside our editor
            if (editor.contains(range.commonAncestorContainer)) {
                range.deleteContents();
                range.insertNode(img);
                // Move cursor after image
                range.setStartAfter(img);
                range.setEndAfter(img);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                editor.appendChild(img);
            }
        } else {
            editor.appendChild(img);
        }

        // Trigger input update
        handleInput();
        setShowEmoji(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace') {
            const selection = window.getSelection();
            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);

            // Handle if cursor is placed after an image (common in simple contentEditable)
            if (range.collapsed) {
                // If cursor is at start of a text node, check previous sibling
                if (range.startContainer.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
                    const prevSibling = range.startContainer.previousSibling;
                    if (prevSibling && prevSibling.nodeName === 'IMG' && prevSibling.alt === 'wechat_emoji') {
                        e.preventDefault();
                        prevSibling.remove();
                        handleInput();
                        return;
                    }
                }
                // If cursor is in the element itself (not text node), check child at offset
                else if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
                    const nodeBefore = range.startContainer.childNodes[range.startOffset - 1];
                    if (nodeBefore && nodeBefore.nodeName === 'IMG' && nodeBefore.alt === 'wechat_emoji') {
                        e.preventDefault();
                        nodeBefore.remove();
                        handleInput();
                        return;
                    }
                }
            }
        }
    };

    const handleEmojiHover = (e, url) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPreviewEmoji(url);
        setPreviewPos({
            top: rect.top - 80,
            left: rect.left + rect.width / 2
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalContent = parseContent();

        if (!finalContent) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await addDoc(collection(db, 'comments'), {
                postId,
                postTitle,
                author: name.trim() || '訪客',
                email: email.trim() || null,
                website: website.trim() || null,
                content: finalContent,
                createdAt: serverTimestamp(),
                isVisible: true
            });

            setName('');
            setEmail('');
            setWebsite('');
            setContent('');
            // Clear editor manually
            if (editorRef.current) {
                editorRef.current.innerHTML = '';
            }
            if (onCommentAdded) onCommentAdded();
        } catch (err) {
            console.error("Error adding comment:", err);
            setError("留言發布失敗，請稍後再試。");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-white/10 relative">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <i className="far fa-comment-dots text-white"></i>
                評論
            </h3>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {/* Main Comment Area */}
                <div className="relative">
                    {!content && (
                        <div className="absolute top-3 left-4 text-gray-400 pointer-events-none select-none">Just Go Go</div>
                    )}
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleInput}
                        onKeyDown={handleKeyDown}
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700/50 focus:ring-2 focus:ring-[#709CEF] focus:border-transparent outline-none transition-all dark:text-white text-base min-h-[120px] max-h-[300px] overflow-y-auto font-sans whitespace-pre-wrap"
                        suppressContentEditableWarning={true}
                    />

                    <div className="absolute bottom-3 left-3 flex gap-2 text-gray-400">
                        <button
                            ref={buttonRef}
                            type="button"
                            onClick={() => setShowEmoji(!showEmoji)}
                            className={`transition-colors ${showEmoji ? 'text-[#709CEF]' : 'hover:text-white'}`}
                            title="Insert Emoji"
                        >
                            <i className="far fa-smile"></i>
                        </button>
                    </div>

                    {/* Emoji Picker Popover */}
                    {showEmoji && (
                        <div
                            ref={pickerRef}
                            className="absolute top-full left-0 mt-2 z-50 w-full md:w-80 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-xl p-3 grid grid-cols-8 gap-2 max-h-48 overflow-y-auto custom-scrollbar"
                        >
                            {wechatEmojis.map((emoji) => (
                                <button
                                    key={emoji.id}
                                    type="button"
                                    onClick={() => insertEmoji(emoji.url)}
                                    onMouseEnter={(e) => handleEmojiHover(e, emoji.url)}
                                    onMouseLeave={() => setPreviewEmoji(null)}
                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center relative group"
                                >
                                    <img
                                        src={emoji.url}
                                        alt={`emoji-${emoji.id}`}
                                        className="w-6 h-6 object-contain pointer-events-none"
                                        loading="lazy"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Emoji Preview Tooltip (Fixed Position - Portaled to Body) */}
                    {createPortal(
                        <AnimatePresence>
                            {previewEmoji && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className="fixed z-[9999] pointer-events-none transform -translate-x-1/2"
                                    style={{ top: previewPos.top, left: previewPos.left }}
                                >
                                    <div className="bg-[#1a1a1a] border border-white/10 p-3 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex items-center justify-center min-w-[80px] min-h-[80px]">
                                        <img src={previewEmoji} alt="preview" className="w-12 h-12 object-contain filter drop-shadow-lg" />
                                        {/* Arrow pointing down */}
                                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rotate-45 w-4 h-4 bg-[#1a1a1a] border-r border-b border-white/10"></div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>,
                        document.body
                    )}
                </div>

                {/* Input Row */}
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="暱稱"
                            className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-[#252525] border-none focus:ring-2 focus:ring-[#709CEF] outline-none transition-all dark:text-white placeholder-gray-500 text-sm"
                        />
                    </div>

                    <div className="flex-1">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="郵箱"
                            className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-[#252525] border-none focus:ring-2 focus:ring-[#709CEF] outline-none transition-all dark:text-white placeholder-gray-500 text-sm"
                        />
                    </div>

                    <div className="flex-1">
                        <input
                            type="url"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="網址 (http://)"
                            className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-[#252525] border-none focus:ring-2 focus:ring-[#709CEF] outline-none transition-all dark:text-white placeholder-gray-500 text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !content.trim()}
                        className="px-6 py-2 bg-gray-300 dark:bg-[#3a3a3a] hover:bg-[#709CEF] text-gray-600 dark:text-gray-300 hover:text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm"
                    >
                        {isSubmitting ? '...' : '提交'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default CommentForm;
