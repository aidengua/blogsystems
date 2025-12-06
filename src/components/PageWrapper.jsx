const PageWrapper = ({ children }) => {
    return (
        <div className="w-full animate-slide-up">
            {children}
        </div>
    );
};

export default PageWrapper;
