import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { processPayment, getPaymentMethods } from '../api';

function PaymentIntegration() {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const methods = await getPaymentMethods();
      setPaymentMethods(methods.data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch payment methods. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const paymentData = {
        method: paymentMethod,
        cardNumber: cardNumber,
        expiryDate: expiryDate,
        cvv: cvv,
      };

      const response = await processPayment(paymentData);

      setIsLoading(false);
      onClose();
      toast({
        title: 'Payment Successful',
        description: 'Your payment has been processed successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Payment Failed',
        description: error.message || 'An error occurred while processing your payment.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxWidth="600px" margin="auto" mt={8}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Payment Integration
        </Heading>
        <Text fontSize="lg" textAlign="center">
          Choose your payment method and complete your purchase
        </Text>
        <Button colorScheme="green" onClick={onOpen}>
          Make Payment
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Payment Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handlePaymentSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Payment Method</FormLabel>
                    <Select
                      placeholder="Select payment method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      {paymentMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  {paymentMethod === 'credit' || paymentMethod === 'debit' ? (
                    <>
                      <FormControl isRequired>
                        <FormLabel>Card Number</FormLabel>
                        <Input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="1234 5678 9012 3456"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Expiry Date</FormLabel>
                        <Input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          placeholder="MM/YY"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>CVV</FormLabel>
                        <Input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="123"
                        />
                      </FormControl>
                    </>
                  ) : null}
                  {paymentMethod === 'paypal' ? (
                    <Text>You will be redirected to PayPal to complete your payment.</Text>
                  ) : null}
                </VStack>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                colorScheme="green"
                onClick={handlePaymentSubmit}
                isLoading={isLoading}
                loadingText="Processing"
              >
                Pay Now
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}

export default PaymentIntegration;
