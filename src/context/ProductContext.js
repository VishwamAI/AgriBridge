import React, { createContext, useReducer, useContext } from 'react';
import productService from '../services/productService';

// Initial state
const initialState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null,
};

// Action types
const FETCH_PRODUCTS_START = 'FETCH_PRODUCTS_START';
const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';
const SELECT_PRODUCT = 'SELECT_PRODUCT';
const CLEAR_SELECTED_PRODUCT = 'CLEAR_SELECTED_PRODUCT';

// Reducer function
const productReducer = (state, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_START:
      return { ...state, loading: true, error: null };
    case FETCH_PRODUCTS_SUCCESS:
      return { ...state, loading: false, products: action.payload, error: null };
    case FETCH_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case SELECT_PRODUCT:
      return { ...state, selectedProduct: action.payload };
    case CLEAR_SELECTED_PRODUCT:
      return { ...state, selectedProduct: null };
    default:
      return state;
  }
};

// Create context
const ProductContext = createContext();

// Provider component
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Actions
  const fetchProducts = async () => {
    dispatch({ type: FETCH_PRODUCTS_START });
    try {
      const products = await productService.getAllProducts();
      dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: products });
    } catch (error) {
      dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error.message });
    }
  };

  const selectProduct = (product) => {
    dispatch({ type: SELECT_PRODUCT, payload: product });
  };

  const clearSelectedProduct = () => {
    dispatch({ type: CLEAR_SELECTED_PRODUCT });
  };

  return (
    <ProductContext.Provider
      value={{
        ...state,
        fetchProducts,
        selectProduct,
        clearSelectedProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook for using the ProductContext
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;
