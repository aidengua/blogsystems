import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import PostEditor from './pages/admin/PostEditor';
import Home from './pages/public/Home';
import About from './pages/public/About';
import PostDetail from './pages/public/PostDetail';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/post/:slug" element={<PostDetail />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/admin/posts/new" element={
          <PrivateRoute>
            <PostEditor />
          </PrivateRoute>
        } />
        <Route path="/admin/posts/:id" element={
          <PrivateRoute>
            <PostEditor />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
