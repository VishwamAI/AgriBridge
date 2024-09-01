# Growers Gate

Growers Gate is a web application platform designed to connect farmers directly with consumers, allowing them to sell vegetables and other products with home delivery options. It aims to streamline the farm-to-table process, ensuring fresh produce delivery while supporting local growers.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Project Overview

Growers Gate empowers farmers by offering them a platform to list their products, set prices, and manage transactions. Consumers can browse through a wide range of fresh vegetables and have them delivered directly to their homes. The platform includes a user-friendly interface, ensuring both farmers and consumers have an easy time managing their interactions.

## Features

- **Dashboard**: An overview for users to see their products, sales, and earnings.
- **Products Management**: Farmers can add, edit, or remove products from their listings.
- **Cart**: Consumers can add products to their cart for purchase.
- **Transactions**: Keep track of orders, payment history, and more.
- **Delivery Management**: An interface for tracking and managing delivery schedules and orders.
- **Login and Registration**: Easy signup and login for both farmers and consumers.
- **User Roles**: Separate interfaces for farmers and consumers with tailored functionalities.
- **Responsive Design**: Mobile-friendly for ease of use on both desktop and mobile devices.

## Technology Stack

**Frontend**:
- React.js
- CSS Modules
- Chart.js for data visualization
- React Router for navigation

**Backend**:
- Node.js
- Express.js
- MongoDB for data storage
- JWT for authentication
- Bcrypt for password hashing
- Speakeasy for 2FA

**Other Tools**:
- Git (Version control)
- NPM (Package manager)
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
   git clone https://github.com/yourusername/growers-gate.git
   cd growers-gate
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

- **Registration**: Users can sign up as either farmers or consumers.
- **Login**: Existing users can log in to access their dashboard.
- **Dashboard**:
  - Farmers can manage their products, view sales, and handle orders.
  - Consumers can browse products, add items to cart, and place orders.
- **Products**: Farmers can add, edit, or remove products from their listings.
- **Cart**: Consumers can review their cart and proceed to checkout.
- **Transactions**: Users can view their order history and transaction details.

## API Endpoints

- `POST /register`: User registration
- `POST /login`: User login
- `POST /verify-2fa`: Two-factor authentication verification
- `GET /dashboard`: Fetch dashboard data (protected route)

For detailed API documentation, refer to the backend code or set up Swagger documentation.

## File Structure

```
growers-gate/
├── src/
│   ├── growers-gate-frontend/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── App.js
│   │   │   ├── index.js
│   │   │   └── ...
│   │   └── package.json
│   └── growers-gate-backend/
│       ├── api.js
│       ├── .env
│       └── package.json
└── README.md
```

- `src/growers-gate-frontend/`: React frontend application
- `src/growers-gate-backend/`: Node.js/Express backend application
- `src/growers-gate-frontend/src/components/`: React components (Dashboard, LoginSignup, etc.)
- `src/growers-gate-backend/api.js`: Main backend file with API routes and MongoDB connection

## CI/CD Workflow

Our CI/CD pipeline has been significantly improved to ensure code quality and streamline the deployment process:

- **Linting**: Automated code style and quality checks for both frontend and backend.
- **Caching**: Implemented caching for node modules and pip packages to speed up builds.
- **Parallel Execution**: Frontend and backend tests run concurrently for faster feedback.
- **Code Coverage**: Integrated with Codecov for detailed code coverage reporting.
- **Performance Testing**: Lighthouse CI runs performance audits on every build.
- **Deployment**: Automated deployment to Netlify (frontend) and Heroku (backend) on successful builds.
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
