import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import PostEditor from './pages/admin/PostEditor';
import Home from './pages/public/Home';
import About from './pages/public/About';
import PostDetail from './pages/public/PostDetail';
import Archives from './pages/public/Archives';
import Tags from './pages/public/Tags';
import Changelog from './pages/public/Changelog';
import PrivateRoute from './components/PrivateRoute';
import PageWrapper from './components/PageWrapper';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          } />
          <Route path="/about" element={
            <PageWrapper>
              <About />
            </PageWrapper>
          } />
          <Route path="/posts/:slug" element={
            <PageWrapper>
              <PostDetail />
            </PageWrapper>
          } />
          <Route path="/archives" element={
            <PageWrapper>
              <Archives />
            </PageWrapper>
          } />
          <Route path="/tags" element={
            <PageWrapper>
              <Tags />
            </PageWrapper>
          } />
          <Route path="/changelog" element={
            <PageWrapper>
              <Changelog />
            </PageWrapper>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          } />
          <Route path="/admin" element={
            <PrivateRoute>
              <PageWrapper>
                <Dashboard />
              </PageWrapper>
            </PrivateRoute>
          } />
          <Route path="/admin/posts/new" element={
            <PrivateRoute>
              <PageWrapper>
                <PostEditor />
              </PageWrapper>
            </PrivateRoute>
          } />
          <Route path="/admin/posts/:id" element={
            <PrivateRoute>
              <PageWrapper>
                <PostEditor />
              </PageWrapper>
            </PrivateRoute>
          } />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
