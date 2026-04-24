# SafeBite - Food Quality Inspection System

A comprehensive web application for managing food quality inspections, manufacturers, products, complaints, and compliance records.

## Features

- **Dashboard**: Overview of key statistics and metrics
- **Manufacturers**: Manage food manufacturers with contact information
- **Products**: Track food products with categories and approval status
- **Inspections**: Schedule and record food quality inspections
- **Complaints**: Handle consumer complaints and track resolution
- **Compliance**: Monitor compliance with food safety standards

## Tech Stack

### Backend

- Node.js with Express.js
- MySQL database
- RESTful API endpoints

### Frontend

- React.js with modern hooks
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

### Database Setup

1. Create a MySQL database named `SafeBite`
2. Run the SQL script in `database/SafeBite.sql` to create tables and insert sample data
3. Update the database credentials in `backend/config/db.js` if needed

### Frontend Build

1. Navigate to the backend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the frontend:

   ```bash
   npm run build
   ```

   This creates the `frontend/build` folder that the backend serves.

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd ../backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

   The backend API will run on <http://localhost:3000>

### Run Frontend in Development

1. Open another terminal and navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Start the React app:

   ```bash
   npm start
   ```

   Open <http://localhost:3001> in your browser.

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login (username only for demo)

### Dashboard

- `GET /api/dashboard` - Get statistics

### Manufacturers

- `GET /api/manufacturers` - Get all manufacturers
- `POST /api/manufacturers` - Create manufacturer
- `PUT /api/manufacturers/:id` - Update manufacturer
- `DELETE /api/manufacturers/:id` - Delete manufacturer

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Inspections

- `GET /api/inspections` - Get all inspections
- `GET /api/inspections/schedules` - Get pending inspection schedules
- `POST /api/inspections` - Create inspection
- `PUT /api/inspections/:id` - Update inspection
- `DELETE /api/inspections/:id` - Delete inspection

### Complaints

- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/consumers` - Get consumers for dropdown
- `POST /api/complaints` - Create complaint
- `PUT /api/complaints/:id` - Update complaint
- `DELETE /api/complaints/:id` - Delete complaint

### Compliance

- `GET /api/compliance` - Get all compliance records
- `GET /api/compliance/standards` - Get compliance standards
- `GET /api/compliance/batches` - Get product batches
- `POST /api/compliance` - Create compliance record
- `PUT /api/compliance/:id` - Update compliance record
- `DELETE /api/compliance/:id` - Delete compliance record

## Usage

1. Build the frontend and start the backend server
2. Open <http://localhost:3000> in your browser
3. Login with any username (no password required for demo)
4. Navigate through different sections using the sidebar
5. Add, edit, and delete records as needed

## Database Schema

The application uses a comprehensive MySQL database with the following main entities:

- Food Manufacturers
- Food Categories
- Food Products
- Food Batches
- Inspection Agencies
- Food Inspectors
- Inspection Schedules
- Inspections
- Sample Collections
- Laboratories
- Lab Tests
- Compliance Standards
- Compliance Records
- Consumers
- Complaints
- Enforcement Actions
- System Users

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes.
