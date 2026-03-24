# Blueprint - Lotto Number Generator

## Overview
A modern, interactive web application to generate lotto numbers (6 out of 45). The app features a vibrant UI, smooth animations, and is built using modern web standards like Web Components and Baseline CSS.

## Features
- **Number Generation**: Generate 6 random numbers between 1 and 45.
- **Vibrant UI**: Color-coded balls based on number ranges.
- **History**: Store and view previously generated numbers (up to 10 entries).
- **Partnership Inquiry**: Send inquiries via Formspree integration.
- **Responsive Design**: Works perfectly on mobile and desktop using Container Queries.
- **Modern Animations**: Smooth appearance of balls with depth and shadows using Web Components.

## Design & Styles
- **Typography**: Clean, expressive font (Inter or system sans-serif).
- **Colors**: Vibrant palette for the balls, subtle noise background for the app.
- **Effects**: Multi-layered drop shadows for depth, glassmorphism for containers.
- **Interactivity**: Glow effects on buttons, interactive hover states.

## Implementation Details
- **Web Component**: `LottoBall` handles its own styling and logic for different sizes and colors.
- **Modern CSS**: Uses `@layer`, `@container`, and `backdrop-filter`.
- **Form Integration**: Formspree is used for handling the partnership form submission.
- **Performance**: Efficient DOM updates and CSS animations.

## Current Progress
- [x] Initial design and plan approved.
- [x] Refactor `index.html`.
- [x] Update `style.css`.
- [x] Implement `main.js`.
- [x] Add Partnership Inquiry Form (Formspree).
