import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';

// Lazy load pages
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const PostEditor = lazy(() => import('./pages/admin/PostEditor'));
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const PostDetail = lazy(() => import('./pages/public/PostDetail'));
const Archives = lazy(() => import('./pages/public/Archives'));
const Tags = lazy(() => import('./pages/public/Tags'));
const Categories = lazy(() => import('./pages/public/Categories'));
const Changelog = lazy(() => import('./pages/public/Changelog'));
const Equipment = lazy(() => import('./pages/public/Equipment'));
const Essay = lazy(() => import('./pages/public/Essay'));
const Album = lazy(() => import('./pages/public/Album'));
const Music = lazy(() => import('./pages/public/Music'));

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
import { MusicProvider } from './context/MusicContext';
import MusicPlayerCapsule from './components/MusicPlayerCapsule';
import { SettingsProvider } from './context/SettingsContext';
import CustomCursor from './components/CustomCursor';
import LogoLoader from './components/LogoLoader';

function App() {
  const location = useLocation();

  return (
    <LoadingProvider>
      <SettingsProvider>
        <CustomCursor />
        <SmoothScroll />
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
            <Suspense fallback={
              <div className="fixed inset-0 flex items-center justify-center bg-transparent z-40 pointer-events-none">
                <LogoLoader animate={false} size="w-12 h-12" />
              </div>
            }>
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
            </Suspense>

          </NotificationProvider>
        </MusicProvider>
      </SettingsProvider >
    </LoadingProvider >
  );
}

export default App;
