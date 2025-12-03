const Footer = () => {
    return (
        <footer className="bg-surface/80 backdrop-blur-sm border-t border-base py-8 mt-12">
            <div className="container mx-auto px-4 text-center">
                <p className="text-muted mb-2">
                    © {new Date().getFullYear()} My Blog. All rights reserved.
                </p>
                <p className="text-sm text-gray-500">
                    Powered by <span className="font-semibold text-primary">React</span> & <span className="font-semibold text-primary">Firebase</span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
