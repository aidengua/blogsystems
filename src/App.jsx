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
import Categories from './pages/public/Categories';
import Changelog from './pages/public/Changelog';

import Equipment from './pages/public/Equipment';
import Essay from './pages/public/Essay';
import Album from './pages/public/Album';
import Music from './pages/public/Music';
import PrivateRoute from './components/PrivateRoute';
import PageWrapper from './components/PageWrapper';
import ScrollToTop from './components/ScrollToTop';

import { LoadingProvider } from './context/LoadingContext';
import LoadingScreen from './components/LoadingScreen';
import { NotificationProvider } from './context/NotificationContext';
import NotificationToast from './components/NotificationToast';
import ContextMenu from './components/ContextMenu';

import PremiumGridBackground from './components/PremiumGridBackground';
import FaviconManager from './components/FaviconManager';
import SmoothScroll from './components/SmoothScroll';
import GLSLBackground from './components/GLSLBackground';
import { MusicProvider } from './context/MusicContext';
import MusicPlayerCapsule from './components/MusicPlayerCapsule';
import { SettingsProvider } from './context/SettingsContext';

function App() {
  const location = useLocation();

  return (
    <LoadingProvider>
      <SettingsProvider>
        <SmoothScroll />
        <GLSLBackground />
        <MusicProvider>
          <FaviconManager />
          <PremiumGridBackground />
          <LoadingScreen />

          {/* Hide Music Player Capsule on Music Page */}
          <AnimatePresence>
            {location.pathname !== '/music' && <MusicPlayerCapsule />}
          </AnimatePresence>

          <NotificationProvider>
            <ContextMenu />
            <NotificationToast />
            <ScrollToTop />
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
              <Route path="/categories" element={
                <PageWrapper>
                  <Categories />
                </PageWrapper>
              } />
              <Route path="/tags" element={
                <PageWrapper>
                  <Tags />
                </PageWrapper>
              } />
              <Route path="/tags/:tag" element={
                <PageWrapper>
                  <Tags />
                </PageWrapper>
              } />
              <Route path="/changelog" element={
                <PageWrapper>
                  <Changelog />
                </PageWrapper>
              } />
              <Route path="/equipment" element={
                <PageWrapper>
                  <Equipment />
                </PageWrapper>
              } />
              <Route path="/essay" element={
                <PageWrapper>
                  <Essay />
                </PageWrapper>
              } />
              <Route path="/album" element={
                <PageWrapper>
                  <Album />
                </PageWrapper>
              } />
              <Route path="/music" element={
                <PageWrapper>
                  <Music />
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

          </NotificationProvider>
        </MusicProvider>
      </SettingsProvider>
    </LoadingProvider>
  );
}

export default App;
