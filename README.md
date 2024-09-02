# Growers Gate

Growers Gate is a comprehensive web application platform designed to connect farmers directly with consumers, facilitating the sale of vegetables and other agricultural products with home delivery options. Our mission is to streamline the farm-to-table process, ensuring fresh produce delivery while supporting local growers.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [File Structure](#file-structure)
- [CI/CD Workflow](#cicd-workflow)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Project Overview

Growers Gate empowers farmers by offering them a platform to list their products, set prices, and manage transactions. Consumers can browse through a wide range of fresh vegetables and have them delivered directly to their homes. The platform includes a user-friendly interface, ensuring both farmers and consumers have an easy time managing their interactions.

## Features

- **User Authentication**: Secure login and registration system with role-based access control.
- **Two-Factor Authentication (2FA)**: Enhanced security using app-based 2FA.
- **Dashboards**:
  - **Farmer Dashboard**: Manage products, view sales, handle orders, access analytics, and request support.
  - **User Dashboard**: Browse products, manage cart, place orders, and view order history.
  - **Admin Dashboard**: Manage all users, products, orders, and view comprehensive analytics.
  - **Rider Dashboard**:
    - Manage deliveries and update order statuses with OTP verification
    - View and manage payment details
    - Access performance metrics and analytics
    - Handle support requests
- **Product Management**: Farmers can add, edit, or remove products from their listings.
- **Order Management**: Comprehensive system for tracking and managing orders across all user types.
- **Cart and Checkout**: Seamless shopping experience for consumers.
- **Support System**: In-built support request functionality for all users.
- **Analytics and Insights**: Detailed analytics for farmers, riders, and admins.
- **Payment Management**: Secure payment processing and tracking for all transactions.
- **Responsive Design**: Mobile-friendly interface for all user types.

## Technology Stack

**Frontend**:
- React.js (v18.3.1)
- Tailwind CSS for styling
- Chart.js and react-chartjs-2 for data visualization
- React Router for navigation
- React Hook Form for form management
- Yup for form validation

**Backend**:
- Node.js
- Express.js
- MongoDB for data storage
- JWT for authentication
- Bcrypt for password hashing
- Speakeasy and QRCode for 2FA implementation

**Development Tools**:
- Git for version control
- NPM for package management
- Dotenv for environment variable management

## Installation and Setup

### Prerequisites

Ensure you have the following installed:
- Node.js (v14.x or higher)
- npm (comes with Node.js)
- MongoDB (v4.x or higher)
- Git

### Steps to Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/VishwamAI/Growers-Gate.git
   cd Growers-Gate
   ```

2. **Install dependencies**:
   ```bash
   # Install frontend dependencies
   cd src/growers-gate-frontend
   npm install

   # Install backend dependencies
   cd ../growers-gate-backend
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the `src/growers-gate-backend` directory with the following:
   ```
   MONGODB_URI=mongodb://localhost:27017/growers_gate
   JWT_SECRET=your_jwt_secret_here
   PORT=3001
   ```

4. **Start MongoDB**:
   Ensure your MongoDB server is running.

5. **Start the backend server**:
   ```bash
   cd src/growers-gate-backend
   npm start
   ```

6. **Start the frontend development server**:
   Open a new terminal window:
   ```bash
   cd src/growers-gate-frontend
   npm start
   ```

7. **Access the Application**:
   Open your browser and go to `http://localhost:3000`

## Usage

1. **Registration**: Sign up as a farmer, consumer, or rider.
2. **Login**: Access your role-specific dashboard.
3. **Two-Factor Authentication**: Set up 2FA in your profile settings for enhanced security.
4. **Farmer Operations**:
   - Manage products (add, edit, remove)
   - View and manage orders
   - Access sales analytics
   - Request support
5. **Consumer Operations**:
   - Browse products
   - Add items to cart
   - Place orders
   - View order history
6. **Rider Operations**:
   - View assigned deliveries
   - Update delivery statuses
   - Access performance metrics
7. **Admin Operations**:
   - Manage all users, products, and orders
   - View comprehensive analytics
   - Handle support requests

## API Endpoints

- `POST /api/register`: User registration
- `POST /api/login`: User login
- `POST /api/verify-2fa`: Two-factor authentication verification
- `GET /api/dashboard`: Fetch dashboard data (protected route)
- `GET /api/farmer/analytics/sales`: Fetch farmer sales analytics
- `GET /api/farmer/analytics/products`: Fetch farmer product analytics
- `GET /api/farmer/analytics/customers`: Fetch farmer customer analytics
- `GET /rider/payments`: Fetch rider payment details

For detailed API documentation, refer to the backend code in `src/growers-gate-backend/api.js`.

## File Structure

```
Growers-Gate/
├── src/
│   ├── growers-gate-frontend/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── FarmerDashboard.js
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── RiderDashboard.js
│   │   │   │   ├── ProfileManagement.js
│   │   │   │   └── ...
│   │   │   ├── App.js
│   │   │   └── index.js
│   │   └── package.json
│   └── growers-gate-backend/
│       ├── api.js
│       ├── .env
│       └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml
└── README.md
```

## CI/CD Workflow

Our CI/CD pipeline ensures code quality and streamlines the deployment process:

- **Linting**: Automated code style and quality checks.
- **Caching**: Implemented for node modules to speed up builds.
- **Parallel Execution**: Frontend and backend tests run concurrently.
- **Code Coverage**: Integrated with Codecov for detailed reporting.
- **Performance Testing**: Lighthouse CI for performance audits.
- **Deployment**: Automated deployment to Netlify (frontend).
- **Notifications**: Slack notifications for deployment status updates.

For more details, see the `.github/workflows/ci.yml` file in the repository.

## Contributing

Contributions to Growers Gate are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any queries or suggestions, please contact:
- **Project Lead**: Kasinadh Sarma
- **Email**: kasinadhsarma@gmail.com
