import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createRoot } from 'react-dom/client';
import LoginForm from './LoginForm';

// Mock the i18next hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}));

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: () => jest.fn(),
}));

// Custom render function using createRoot
const customRender = (ui, options) => {
  const container = document.createElement('div');
  const root = createRoot(container);
  root.render(ui);
  return {
    container,
    ...render(container, options),
    unmount: () => root.unmount(),
  };
};

describe('LoginForm', () => {
  it('renders the form elements', () => {
    customRender(<LoginForm onSubmit={() => {}} />);

    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(screen.getByLabelText('password')).toBeInTheDocument();
    expect(screen.getByLabelText('userType')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'login' })).toBeInTheDocument();
  });

  it('updates state on input change', () => {
    customRender(<LoginForm onSubmit={() => {}} />);

    const emailInput = screen.getByLabelText('email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');

    const passwordInput = screen.getByLabelText('password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');

    const userTypeSelect = screen.getByLabelText('userType');
    fireEvent.change(userTypeSelect, { target: { value: 'farmer' } });
    expect(userTypeSelect.value).toBe('farmer');
  });

  it('calls onSubmit with form data when submitted', async () => {
    const mockOnSubmit = jest.fn();
    customRender(<LoginForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText('email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('userType'), { target: { value: 'farmer' } });

    fireEvent.click(screen.getByRole('button', { name: 'login' }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      userType: 'farmer'
    });
  });
});
