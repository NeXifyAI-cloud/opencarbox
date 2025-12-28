# Carvatoo - Full Stack E-Commerce Platform

This is a modern, full-stack E-Commerce platform built with React, FastAPI, and MongoDB. It features a complete online shop for auto parts, a workshop booking system, and a vehicle dealership module.

## Architecture

### Frontend
- **Framework**: React 18 (CRA/Vite compatible)
- **Styling**: Tailwind CSS + Shadcn/UI (Headless UI patterns)
- **State Management**: React Context (Auth, Cart)
- **Routing**: React Router v6 with Lazy Loading
- **API Client**: Axios with Interceptors

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database**: MongoDB (Motor Async Driver)
- **Validation**: Pydantic v2
- **Authentication**: JWT (Access Tokens)

## Key Features

1.  **E-Commerce Core**
    -   Product Catalog with Filters & Search
    -   Shopping Cart with Session Persistence
    -   Multi-step Checkout Process
    -   User Dashboard (Order History, Profile)

2.  **Workshop Module (/werkstatt)**
    -   Service Listing
    -   Appointment Booking System
    -   Special Offers (DPF Cleaning)

3.  **Dealership Module (/fahrzeuge)**
    -   Vehicle Listings (New/Used)
    -   Filtering by Brand, Price, Fuel

4.  **Admin Portal (/admin)**
    -   Dashboard with Analytics
    -   Product Management (CRUD)
    -   Order Management (Status Workflow)
    -   Appointment Management
    -   Vehicle Inventory Management

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB Instance

### Installation

1.  **Backend**
    ```bash
    cd backend
    pip install -r requirements.txt
    python seed.py # Initialize DB with demo data
    supervisord # Or run uvicorn server:app --reload
    ```

2.  **Frontend**
    ```bash
    cd frontend
    yarn install
    yarn start
    ```

## Project Structure

```
/app
├── backend/
│   ├── routes/         # API Endpoints (Auth, Products, Orders...)
│   ├── models.py       # Pydantic Schemas
│   ├── database.py     # MongoDB Connection
│   └── server.py       # App Entry Point
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI Components
    │   ├── pages/      # Route Components
    │   ├── context/    # Global State
    │   └── services/   # API Layer
    └── public/
```

## Deployment

The application is container-ready. Ensure environment variables (`MONGO_URL`, `JWT_SECRET`) are set in production.

## License

© 2025 OpenCarBox GmbH
