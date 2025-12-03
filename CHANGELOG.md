# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2025-12-03
### Added
- **Category Functionality**:
  - Added category selection in Post Editor ("作品紀錄", "比賽紀錄", "製作教程", "課堂筆記").
  - Implemented category filtering on the Homepage with smooth animations.
  - Updated Hero Dashboard category cards to trigger filtering.
- **Sidebar Social Card**: Replaced WeChat card with Line card, featuring Line's brand colors and icon.

### Changed
- **Global Theme**:
  - Unified blue color theme to `#709CEF` across the entire site.
  - Updated Notification Bar hover colors and centered text.
- **Dashboard**:
  - Refined Trend Line Chart to display posts sequentially (Post 1, Post 2...) instead of dates.
  - Set Y-axis maximum view count to 1000.
  - Connected Notification Bar to display the latest essay dynamically.

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
