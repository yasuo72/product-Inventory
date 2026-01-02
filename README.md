# Product Management – Frontend Assignment

A small React-based product management dashboard built as part of the Grey Scientific Labs frontend assignment.

## Tech Stack

- React 18 (via CDN, no build step)
- Plain HTML + CSS + JavaScript
- No backend or API – all data is stored in memory in the browser

## Features

- **Product list display**
  - List view (table) and Card view (grid)
  - Toggle between views using the toolbar

- **Search with debounce**
  - Real-time search by product name
  - 500 ms debounce to avoid excessive filtering while typing

- **Category filter**
  - Dropdown to filter products by category
  - Works together with search and pagination

- **Add & Edit product**
  - Form fields:
    - Name (required)
    - Price (number, required)
    - Category (required)
    - Stock (number, optional)
    - Description (optional)
  - Basic validation with inline error messages
  - Add and edit operations update an in-memory product list (no backend)

- **Pagination**
  - 6 products per page
  - Previous / page numbers / Next controls
  - Pagination applied after search and category filters

- **Dashboard-style enhancements**
  - Stats bar showing:
    - Total products
    - Total stock units
    - Low stock count (≤ 5 units)
    - Estimated inventory value (₹)
  - Color-coded stock badges:
    - In stock
    - Low stock
    - Out of stock

- **Responsive UI**
  - Two-column layout on desktop (list + form)
  - Stacks into a single column on smaller screens
  - Grid cards wrap nicely on mobile

## How to Run Locally

1. Open [index.html](cci:7://file:///c:/Users/Rohit/Downloads/Telegram%20Desktop/product-list-assignment/index.html:0:0-0:0) in any modern browser, or
2. Serve the folder via a simple static server (e.g. `python -m http.server`) and visit `http://localhost:8000`.

## Notes

- All state lives in React components ([App](cci:1://file:///c:/Users/Rohit/Downloads/Telegram%20Desktop/product-list-assignment/react-app.js:25:0-257:1), [Toolbar](cci:1://file:///c:/Users/Rohit/Downloads/Telegram%20Desktop/product-list-assignment/react-app.js:296:0-359:1), [StatsBar](cci:1://file:///c:/Users/Rohit/Downloads/Telegram%20Desktop/product-list-assignment/react-app.js:259:0-294:1), [ProductTable](cci:1://file:///c:/Users/Rohit/Downloads/Telegram%20Desktop/product-list-assignment/react-app.js:371:0-417:1), [ProductGrid](cci:1://file:///c:/Users/Rohit/Downloads/Telegram%20Desktop/product-list-assignment/react-app.js:419:0-453:1), [Pagination](cci:1://file:///c:/Users/Rohit/Downloads/Telegram%20Desktop/product-list-assignment/react-app.js:455:0-491:1), [ProductForm](cci:1://file:///c:/Users/Rohit/Downloads/Telegram%20Desktop/product-list-assignment/react-app.js:493:0-574:1)).
- This project focuses on clear, easy-to-read code and simple UX rather than heavy styling frameworks.