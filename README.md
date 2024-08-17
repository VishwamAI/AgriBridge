# Growers' Gate

Growers' Gate is a platform connecting farmers directly with consumers, built using React and bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Project Overview

Growers' Gate aims to revolutionize the agricultural supply chain by:
- Providing farmers with a direct channel to sell their produce
- Offering consumers access to fresh, locally-sourced products
- Reducing food waste and transportation costs
- Supporting local farming communities

## Getting Started

To get started with the Growers' Gate project, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/VishwamAI/Growers-Gate
   cd Growers-Gate
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add necessary environment variables (e.g., API keys, database URLs)

4. Run the development server:
   ```
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser

Note: Make sure you have Node.js (version 14 or later) and npm installed on your system before starting.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Deployment

To deploy the Growers' Gate frontend on Netlify, follow these steps:

1. Create a Netlify account at [https://www.netlify.com/](https://www.netlify.com/)
2. Connect your GitHub account to Netlify
3. Choose the Growers' Gate repository for deployment
4. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
5. Click "Deploy site"

Netlify will automatically build and deploy your site whenever you push changes to the main branch of your GitHub repository.

## Usage

Once you've accessed the Growers' Gate platform, you can:

1. Browse available products on the home page
2. Use the search function to find specific items
3. Add products to your cart
4. View your order history
5. For farmers: list new products for sale

Navigate through the app using the menu at the bottom of the screen:
- Home: View featured products and daily highlights
- Browse: Search and filter all available products
- Orders: Check your order history and status
- Sell: For farmers to list new products (requires farmer account)
- Community: Connect with local farmers and consumers

## Learn More

You can learn more about Create React App in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Contributing

We welcome contributions to the Growers' Gate project. Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Project Structure

The Growers' Gate project is organized as follows:

```
growers-gate/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── ProductPage.js
│   │   └── LoginPage.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── productService.js
│   ├── utils/
│   │   ├── formatDate.js
│   │   └── calculatePrice.js
│   ├── context/
│   │   ├── AppContext.js
│   │   └── AuthContext.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useProducts.js
│   ├── styles/
│   │   ├── App.css
│   │   └── Theme.css
│   └── App.js
├── package.json
├── README.md
└── tailwind.config.js
```

This structure organizes the application into logical components, separating concerns and promoting maintainability.
