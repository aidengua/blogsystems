import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { collection, query, orderBy, limit, getDocs, where, startAfter } from 'firebase/firestore';
import { db } from '../firebase';
import ReactDOM from 'react-dom';
import ControlCenterMobile from './ControlCenterMobile';
import ControlCenterDesktop from './ControlCenterDesktop';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return isMobile;
};

const ControlCenterModal = ({ isOpen, onClose, origin }) => {
    const [activeTab, setActiveTab] = useState('interactive');
    const [comments, setComments] = useState([]);
    const [tags, setTags] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [loadingTags, setLoadingTags] = useState(true);
    const [page, setPage] = useState(1);
    const [lastDocs, setLastDocs] = useState([]);

    const isMobile = useIsMobile();

    // Fetch Tags
    const fetchTags = async () => {
        setLoadingTags(true);
        try {
            const postsQuery = query(
                collection(db, 'posts'),
                where('status', '==', 'published')
            );
            const postsSnap = await getDocs(postsQuery);
            const tagCounts = {};
            postsSnap.docs.forEach(doc => {
                const postTags = doc.data().tags || [];
                postTags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            });
            const sortedTags = Object.entries(tagCounts)
                .sort(([, a], [, b]) => b - a);
            setTags(sortedTags);
        } catch (error) {
            console.error("Error fetching tags:", error);
        } finally {
            setLoadingTags(false);
        }
    };

    // Fetch Comments with Pagination
    const fetchComments = async (targetPage) => {
        setLoadingComments(true);
        try {
            let commentsQuery;

            if (targetPage === 1) {
                commentsQuery = query(
                    collection(db, 'comments'),
                    orderBy('createdAt', 'desc'),
                    limit(isMobile ? 4 : 6)
                );
            } else {
                const lastDoc = lastDocs[targetPage - 2];
                if (!lastDoc) {
                    setLoadingComments(false);
                    return;
                }
                commentsQuery = query(
                    collection(db, 'comments'),
                    orderBy('createdAt', 'desc'),
                    startAfter(lastDoc),
                    limit(isMobile ? 4 : 6)
                );
            }

            const commentsSnap = await getDocs(commentsQuery);

            if (targetPage > 1 && commentsSnap.empty) {
                setLoadingComments(false);
                return;
            }

            const commentsData = commentsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));
            setComments(commentsData);
            setPage(targetPage);

            if (commentsSnap.docs.length > 0) {
                const newLastDoc = commentsSnap.docs[commentsSnap.docs.length - 1];
                setLastDocs(prev => {
                    const newDocs = [...prev];
                    newDocs[targetPage - 1] = newLastDoc;
                    return newDocs;
                });
            }

        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        setPage(1);
        setLastDocs([]);
        fetchComments(1);
        fetchTags();
    }, [isOpen]);

    const handleNextPage = () => {
        const limitCount = isMobile ? 4 : 6;
        if (comments.length === limitCount) {
            fetchComments(page + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            fetchComments(page - 1);
        }
    };

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Lock Body Scroll (Robust iOS Fix)
    useEffect(() => {
        if (isOpen) {
            // Save current scroll position
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            // document.body.style.touchAction = 'none'; // Not needed with fixed position
        } else {
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            // document.body.style.touchAction = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
        return () => {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            // document.body.style.touchAction = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        };
    }, [isOpen]);

    // Common Backdrop
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.3 } }
    };

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Shared Backdrop */}
                    <motion.div
                        key="backdrop"
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] touch-none"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />

                    {/* Conditional Content */}
                    {isMobile ? (
                        <ControlCenterMobile
                            key="mobile"
                            isOpen={isOpen}
                            onClose={onClose}
                            origin={origin}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            comments={comments}
                            tags={tags}
                            loadingComments={loadingComments}
                            handlePrevPage={handlePrevPage}
                            handleNextPage={handleNextPage}
                            page={page}
                        />
                    ) : (
                        <ControlCenterDesktop
                            key="desktop"
                            isOpen={isOpen}
                            onClose={onClose}
                            comments={comments}
                            tags={tags}
                            loadingComments={loadingComments}
                            loadingTags={loadingTags}
                            page={page}
                            handlePrevPage={handlePrevPage}
                            handleNextPage={handleNextPage}
                        />
                    )}
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ControlCenterModal;
