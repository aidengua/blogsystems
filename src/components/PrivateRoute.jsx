import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const PrivateRoute = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return user ? children : <Navigate to="/admin/login" />;
};

export default PrivateRoute;
