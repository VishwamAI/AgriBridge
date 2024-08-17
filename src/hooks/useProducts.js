import { useContext } from 'react';
import ProductContext from '../context/ProductContext';

const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }

  const { products, loading, error, selectedProduct, fetchProducts, selectProduct, clearSelectedProduct } = context;

  return {
    products,
    loading,
    error,
    selectedProduct,
    fetchProducts,
    selectProduct,
    clearSelectedProduct
  };
};

export default useProducts;
