import React from 'react';

// Mac-style Window Blockquote Component
const Blockquote = ({ children, ...props }) => {
    // Attempt to extract a title from the first bold text
    const childrenArray = React.Children.toArray(children);
    let title = null;
    let content = childrenArray;

    // Check if first child is a paragraph containing a strong tag
    if (childrenArray.length > 0 && childrenArray[0].type === 'p') {
        const pChildren = React.Children.toArray(childrenArray[0].props.children);
        if (pChildren.length > 0 && pChildren[0].type === 'strong') {
            // Found a title!
            title = pChildren[0].props.children;

            // Remove the title from the first paragraph
            const remainingPChildren = pChildren.slice(1);
            // If paragraph is now empty (or just whitespace), remove it? 
            // Or construct a new paragraph with remaining content
            if (remainingPChildren.length === 0) {
                content = childrenArray.slice(1);
            } else {
                // Clone the paragraph with new children
                const newP = React.cloneElement(childrenArray[0], {}, ...remainingPChildren);
                content = [newP, ...childrenArray.slice(1)];
            }
        }
    }

    return (
        <div className="my-4 rounded-xl border-2 border-[#709CEF] bg-gray-900/5 dark:bg-black/20 overflow-hidden shadow-sm">
            {/* Window Header */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#709CEF]/10 border-b border-[#709CEF]/20">
                <span className="font-bold text-sm text-[#709CEF] tracking-wide">
                    {title || 'Note'}
                </span>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80 shadow-sm"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80 shadow-sm"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80 shadow-sm"></div>
                </div>
            </div>

            {/* Window Content */}
            <div className="p-3 text-gray-700 dark:text-gray-300 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
                {content}
            </div>
        </div>
    );
};

export default Blockquote;
