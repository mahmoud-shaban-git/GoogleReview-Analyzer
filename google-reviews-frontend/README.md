# Google Reviews Analysis Dashboard

A modern React application to analyze Google Reviews using AI.

## Features
- **Review Analysis**: Keyword extraction, sentiment summary, and category breakdown.
- **Trend Analysis**: Interactive charts showing rating and review volume over time.
- **Fake Review Detection**: Highlights suspicious reviews with probability scores.
- **Modern UI**: Clean, responsive design using Tailwind CSS and Recharts.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## Backend Connection
The app expects a backend running at `http://localhost:8080`.
A proxy is configured in `vite.config.js` to forward `/api` requests to the backend.

## Tech Stack
- React + Vite
- Tailwind CSS
- Recharts (Visualization)
- Lucide React (Icons)
