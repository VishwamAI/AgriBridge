# Growers Gate

Growers Gate is a web and mobile application platform designed to connect farmers directly with consumers, allowing them to sell vegetables and other products with home delivery options. It aims to streamline the farm-to-table process, ensuring fresh produce delivery while supporting local growers.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Project Overview

Growers Gate empowers farmers by offering them a platform to list their products, set prices, and manage transactions. Consumers can browse through a wide range of fresh vegetables and have them delivered directly to their homes. The platform includes a user-friendly interface, ensuring both farmers and consumers have an easy time managing their interactions.

## Features

- **Dashboard**: An overview for farmers to see their products, sales, and earnings.
- **Products Management**: Farmers can add, edit, or remove products from their listings.
- **Cart**: Consumers can add products to their cart for purchase.
- **Transactions**: Keep track of orders, payment history, and more.
- **Delivery Management**: An interface for tracking and managing delivery schedules and orders.
- **Login and Registration**: Easy signup and login for both farmers and consumers, including social login options (Google, Microsoft, Apple).
- **User Roles**: Separate interfaces for farmers and consumers with tailored functionalities.
- **Responsive Design**: Mobile-friendly for ease of use on both desktop and mobile devices.

## Technology Stack

**Frontend**:
- React.js (JavaScript Library for building user interfaces)
- CSS/SCSS (Styling)
- Parcel (Bundler)

**Backend**:
- Node.js (Runtime environment)
- Express.js (Web framework for Node.js)
- MongoDB (NoSQL database for storing product, user, and transaction data)

**Other Tools**:
- Git (Version control)
- NPM/Yarn (Package managers)
- OAuth (Social login integration for Google, Microsoft, Apple)

## Installation and Setup

### Prerequisites

Make sure you have the following installed:
- Node.js (v14.x or higher)
- npm or yarn (package managers)
- MongoDB (Database)
- Git

### Steps to Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd growers-gate
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create a `.env` file**:
   Create a `.env` file in the root of your project with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/growersgate
   PORT=5000
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the server**:
   ```bash
   npm run server
   ```

5. **Run the frontend**:
   Open another terminal tab or window, and start the React development server:
   ```bash
   npm start
   ```

6. **Visit the Application**:
   Go to `http://localhost:3000` to see the app running.

## Usage

- **Farmers** can log in, add their products, and manage transactions and deliveries.
- **Consumers** can browse available products, add them to their cart, and check out for home delivery.

## File Structure

```
growers-gate/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.js
│   ├── index.js
│   ├── ...
├── server/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── server.js
├── .env
├── package.json
└── README.md
```

- **`src/components`**: Reusable UI components (buttons, forms, etc.).
- **`src/pages`**: Different pages such as Dashboard, Products, Cart, and Transactions.
- **`src/services`**: API services for communicating with the backend.
- **`server/`**: Backend server code handling API requests and database operations.

## Contributing

If you would like to contribute to Growers Gate, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request.

All contributions, suggestions, and improvements are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any queries, feel free to reach out to us:
- **Project Lead**: Kasinadh Sarma
- Email: kasinadh@example.com

