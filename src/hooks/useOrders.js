import { useContext, useState, useCallback } from 'react';
import OrderContext from '../context/OrderContext';
import orderService from '../services/orderService';

const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { orders, dispatch } = useContext(OrderContext);

  const fetchUserOrders = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const userOrders = await orderService.getUserOrders(userId);
      dispatch({ type: 'SET_ORDERS', payload: userOrders });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const newOrder = await orderService.createOrder(orderData);
      dispatch({ type: 'ADD_ORDER', payload: newOrder });
      return newOrder;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, status);
      dispatch({ type: 'UPDATE_ORDER', payload: updatedOrder });
      return updatedOrder;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const getOrderDetails = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const orderDetails = await orderService.getOrderDetails(orderId);
      return orderDetails;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    loading,
    error,
    fetchUserOrders,
    createOrder,
    updateOrderStatus,
    getOrderDetails,
  };
};

export default useOrders;
