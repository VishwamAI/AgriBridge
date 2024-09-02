# Growers Gate

Growers Gate is a comprehensive web application platform designed to connect farmers directly with consumers, facilitating the sale of vegetables and other agricultural products with home delivery options. Our mission is to streamline the farm-to-table process, ensuring fresh produce delivery while supporting local growers.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Two-Factor Authentication (2FA)](#two-factor-authentication-2fa)
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
- Axios for API requests
- JWT-decode for token handling

**Backend**:
- Node.js
- Express.js
- MongoDB for data storage
- JWT for authentication
- Bcrypt for password hashing
- Speakeasy and QRCode for 2FA implementation
- Express-validator for input validation
- Express-rate-limit for API rate limiting

**Development Tools**:
- Git for version control
- NPM for package management
- Dotenv for environment variable management
- Jest and Supertest for testing
- ESLint and Prettier for code formatting

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
   MONGODB_URI=mongodb://localhost:27017/growers_gate_test
   JWT_SECRET=your_strong_jwt_secret_here
   PORT=8080
   NODE_ENV=production
   API_BASE_URL=https://api.growers-gate.com
   OTP_SECRET=your_strong_otp_secret_here
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
   - Update delivery statuses with OTP verification
   - Access performance metrics
   - View and manage payment details
7. **Admin Operations**:
   - Manage all users, products, and orders
   - View comprehensive analytics
   - Handle support requests

## API Endpoints

- `POST /register`: User registration
- `POST /login`: User login
- `POST /verify-2fa`: Two-factor authentication verification
- `POST /logout`: User logout
- `POST /forgot-password`: Initiate password reset
- `POST /reset-password`: Complete password reset
- `GET /dashboard`: Fetch dashboard data (protected route)
- `POST /generate-rider-otp`: Generate OTP for rider authentication
- `POST /products`: Create a new product (for farmers)
- `GET /products`: Fetch all products
- `PUT /products/:id`: Update a product
- `DELETE /products/:id`: Delete a product
- `GET /orders`: Fetch orders based on user role
- `GET /api/farmer/analytics/sales`: Fetch farmer sales analytics
- `GET /api/farmer/analytics/products`: Fetch farmer product analytics
- `GET /api/farmer/analytics/customers`: Fetch farmer customer analytics
- `GET /rider/payments`: Fetch rider payment details
- `GET /knowledge-base`: Fetch knowledge base articles for riders
- `POST /refresh-token`: Refresh JWT token

For detailed API documentation and request/response formats, refer to the backend code in `src/growers-gate-backend/api.js`.

## Two-Factor Authentication (2FA)

Growers Gate implements app-based two-factor authentication for enhanced security:

1. **Setup**: Users can enable 2FA in their profile settings.
2. **Process**:
   - A QR code and secret key are generated for the user.
   - User scans the QR code with an authenticator app (e.g., Google Authenticator).
   - User enters the 6-digit code from the app to verify and enable 2FA.
3. **Login**: After enabling 2FA, users need to enter a code from their authenticator app during login.
4. **Security**: 2FA adds an extra layer of protection against unauthorized access.

For implementation details, see the `ProfileManagement.js` component and the `/verify-2fa` API endpoint.

## Additional Security Measures

Growers Gate implements several security measures to enhance the overall security of the application:

1. **Secure Headers**: The application uses the Helmet middleware to set various HTTP headers for improved security.
2. **Rate Limiting**: Enhanced rate limiting is implemented to prevent abuse and protect against brute-force attacks.
3. **Input Validation**: Improved input validation is used throughout the application, especially during user registration and login processes.
4. **Password Security**: The system checks for common passwords and leaked passwords during registration.
5. **Account Locking**: Multiple failed login attempts result in temporary account locking.

### Testing Security Features

To test these security features:

1. **Helmet Headers**: Use a tool like [securityheaders.com](https://securityheaders.com) to check the HTTP headers of your deployed application.
2. **Rate Limiting**:
   - Make multiple rapid requests to an endpoint (e.g., login) and observe the 429 (Too Many Requests) response after exceeding the limit.
   - Wait for the time window to reset and verify that requests are allowed again.
3. **Input Validation**:
   - Attempt to register with invalid inputs (e.g., weak password, invalid email) and verify that appropriate error messages are returned.
   - Try to inject malicious scripts in input fields and ensure they are properly sanitized.
4. **Password Security**:
   - Attempt to register with a common password (e.g., "password123") and verify that it's rejected.
   - Use a known leaked password and ensure the system prevents its use.
5. **Account Locking**:
   - Attempt multiple incorrect logins for a user and verify that the account gets locked after a certain number of attempts.
   - Verify that a locked account cannot be accessed even with correct credentials until the lock period expires.

For detailed implementation of these security measures, refer to the backend code in `src/growers-gate-backend/api.js`.

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
│   │   │   ├── utils/
│   │   │   │   └── tokenUtils.js
│   │   │   ├── App.js
│   │   │   └── index.js
│   │   ├── package.json
│   │   └── .env
│   └── growers-gate-backend/
│       ├── api.js
│       ├── .env
│       └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml
├── lighthouserc.json
└── README.md
```

## CI/CD Workflow

Our CI/CD pipeline ensures code quality and streamlines the deployment process:

- **Linting**: Automated code style and quality checks using ESLint.
- **Testing**: Jest for unit and integration tests.
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

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any queries or suggestions, please contact:
- **Project Lead**: Kasinadh Sarma
- **Email**: kasinadhsarma@gmail.com
- **GitHub**: [VishwamAI](https://github.com/VishwamAI)
