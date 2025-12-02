import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const Dashboard = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const postsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(postsData);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deleteDoc(doc(db, 'posts', id));
                setPosts(posts.filter(post => post.id !== id));
            } catch (error) {
                console.error("Error deleting post:", error);
            }
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/admin/login');
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex gap-4">
                    <Link
                        to="/admin/posts/new"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        New Post
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">{post.title}</p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${post.status === 'published' ? 'text-green-900' : 'text-orange-900'}`}>
                                        <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${post.status === 'published' ? 'bg-green-200' : 'bg-orange-200'}`}></span>
                                        <span className="relative">{post.status}</span>
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                        {post.createdAt?.toDate().toLocaleDateString()}
                                    </p>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <Link
                                        to={`/admin/posts/${post.id}`}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
