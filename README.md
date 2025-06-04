# SupKnowledge Art Collection Interface

A modern, responsive interface for exploring the Metropolitan Museum of Art's collection. This project provides researchers, academics, and art enthusiasts with an intuitive way to search and browse the MET Museum's extensive art collection.

## Features

- **Quick Search**: Search the entire collection from any page
- **Advanced Search**: Filter by department, date range, medium, geographic location, and more
- **Highlighted Artworks**: Discover featured pieces on the homepage
- **Detailed Object View**: Explore comprehensive information about each artwork
- **Responsive Design**: Optimized for all devices from mobile to desktop

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/thomas1908/2WEBD.git
cd 2WEBD
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/          # React context for state management
├── pages/            # Page components
├── App.js            # Main application component
├── index.js          # Entry point
└── ...
```

## Technologies Used

- React
- React Router
- Tailwind CSS
- Lucide React (for icons)
- Metropolitan Museum of Art Collection API

## API

This project uses the Metropolitan Museum of Art Collection API:
- API Documentation: https://metmuseum.github.io/
