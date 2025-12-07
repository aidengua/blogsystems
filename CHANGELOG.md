# Changelog

## [v1.6.0] - 2025-12-07
### Added
- **Mobile Menu Redesign**:
  - Implemented "Dynamic Island" style top-down expanding menu.
  - Optimized animations with smooth spring physics (`stiffness: 80`, `damping: 15`).
  - Redesigned menu layout with categorized sections and flex-grid buttons.
- **Visual Refinements**:
  - **Profile Card 2.0**: Replaced 3D flip with a sophisticated "Breathe & Fade" opacity transition. Added decorative GIF signature.
  - **Line Card Polish**: Enhanced visuals by removing green background, enlarging Line logo, and adding a blurred watermark effect.
  - **Tag Bar**: Implemented horizontally scrollable tag list for mobile devices.

## [v1.5.1] - 2025-12-06
### Added
- **Article Banner Redesign**: Implemented a new premium banner design with glassmorphic badges, large typography, and interactive metadata tooltips.
- **Footer Redesign**: Overhauled the footer with a compact layout, avatar integration, and status indicators.
- **Loading Optimization**: Implemented smart caching to skip loading screens when switching between Tag pages.


All notable changes to this project will be documented in this file.

## [v1.5.0] - 2025-12-04
### Added
- **Mac-style Widgets**:
  - Integrated Clock, Battery, Weather, and Photo widgets into the "Audio Design Home" card on the homepage.
  - **Clock**: Analog clock with precise styling and liquid glass effect.
  - **Battery**: Real-time battery status with unified glassmorphism style.
  - **Weather**: Real-time Taipei weather data with dark glass aesthetic.
  - **Photo**: "Golden Selection" photo slideshow with "More Recommend" button.
- **Visitor Statistics**:
  - Added real-time visitor tracking using Firebase Firestore.
  - Implemented a 3D flip card on the About page showing weekly visitor stats.

### Changed
- **Essay Page Redesign**:
  - Unified banner height and design with the Equipment page.
  - Redesigned essay cards with bold text, dashed separators, and pill-shaped date badges.
  - Updated banner image to a dynamic GIF with blur effect.
- **Homepage Layout**:
  - Centered widgets in the "Audio Design Home" card.
  - Optimized widget sizes and spacing for better visual balance.
  - Unified blur background effects across all widgets (`bg-black/20 backdrop-blur-xl`).

## [v1.4.0] - 2025-12-04
### Added
- **Comment System**:
  - Implemented a comprehensive comment system for both Blog Posts and Essays.
  - **Public**: Visitors can leave comments (Name + Content).
  - **Admin**: Added "留言管理" (Comments) tab in Dashboard for managing and deleting comments.
  - **Essays**: Added expandable comment section to each essay card.
  - **Notifications**: Integrated toast notifications for comment actions (submission, deletion).
- **Sidebar Enhancements**:
  - **Line Social Card**: Added 3D flip effect with QR code on the back.
  - **Profile Card**: Redesigned with a "Status Pill", 3D tilt avatar animation, and glassmorphic GitHub button.
  - **Activity Chart**: Optimized visuals with glassmorphic tooltip and theme-consistent colors.

### Changed
- **Global UI Upgrade**:
  - Implemented a **Semantic Color System** (`bg-surface`, `text-main`, etc.) for consistent Light/Dark mode theming.
  - Refactored **Navbar** to use semantic colors and unified dropdown styles.
  - Updated **Homepage Text** from "Theme-AnZhiYu" to "音響設計之家".
- **Visual Refinements**:
  - Updated global avatar and author name to "呂宥德".
  - Refined Line card animation to follow mouse movement.
  - Removed image badge from Profile Card.

## [v1.3.0] - 2025-12-03

### Added
- **Essay Page**: Added a new public page (`/essay`) for "Short Thoughts" (短文心事), featuring a dark-themed hero section and a masonry-style grid for displaying essays.
- **Admin Essay Management**:
  - Added a Tab Switcher to toggle between "Posts" and "Essays".
  - Implemented an Essay Table to view, edit, and delete essays.
  - Reused the "Quick Publish" modal for editing essays.
- **Admin Quick Publish**: Added a "Quick Publish Essay" feature to the Admin Dashboard.
  - Accessible via a new "新增短文" (New Essay) button in the dashboard header.
  - Opens a modal for quick text entry and publishing.
- **Navigation**: Added a "短文" (Essay) link to the main navigation bar.
- **Firestore Rules**: Updated security rules to allow public read access and authenticated write access for the `essays` collection.
- **Deployment**: Successfully deployed to Firebase Hosting.

### Changed
- **Hero Section**:
  - Refined the image grid animation to use a vertical scrolling marquee instead of a tilted layout.
  - Implemented random scrolling speeds (15s, 20s, 25s) for the three columns to create visual depth.
  - Fixed animation glitches to ensure seamless looping.
  - Optimized performance with `will-change-transform`.
- **Recommendation Cards**: Improved hover animations with smoother scaling and cubic-bezier transitions.
- **Admin Dashboard UI**: Refactored the dashboard header to include the "New Essay" button alongside the "New Post" button.

### Fixed
- Fixed an issue where the image grid animation would stutter or jump at the loop point.
- Fixed sticky positioning issues in the Sidebar by adjusting `MainLayout` overflow properties.
