import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createRoot } from 'react-dom/client';
import LoginForm from './LoginForm';

// Mock the i18next hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => `translated_${key}` }),
}));

// Mock Chakra UI components
function mockChakraComponents() {
  const React = require('react');
  return {
    ...jest.requireActual('@chakra-ui/react'),
    useToast: jest.fn(() => jest.fn()),
    Box: ({ children, as, ...props }) => React.createElement(as || 'form', { ...props, role: 'form' }, children),
    VStack: ({ children, ...props }) => React.createElement('div', props, children),
    FormControl: ({ children, isRequired, id, ...props }) => React.createElement('div', { ...props, 'data-testid': id, 'data-required': isRequired, role: 'group' }, children),
    FormLabel: ({ children, htmlFor, ...props }) => React.createElement('label', { ...props, htmlFor }, children),
    Input: ({ id, ...props }) => React.createElement('input', { ...props, id }),
    Button: ({ children, colorScheme, isLoading, ...props }) => React.createElement('button', { ...props, 'data-loading': isLoading ? 'true' : undefined }, children),
    Text: ({ children, ...props }) => React.createElement('p', props, children),
    Select: ({ id, children, placeholder, ...props }) => React.createElement('select', { ...props, id, 'data-testid': id },
      [React.createElement('option', { key: 'placeholder', value: '' }, placeholder), ...React.Children.toArray(children)]
    ),
  };
}

// Move jest.mock() after the mockChakraComponents definition
jest.mock('@chakra-ui/react', () => mockChakraComponents());

// Custom render function using React Testing Library
const customRender = (ui, options) => {
  const ChakraProvider = jest.requireActual('@chakra-ui/react').ChakraProvider;
  return render(ui, {
    wrapper: ({ children }) => <ChakraProvider>{children}</ChakraProvider>,
    ...options
  });
};

describe('LoginForm', () => {
  it('renders the form elements', () => {
    customRender(<LoginForm onSubmit={() => {}} />);

    // Check for form container
    expect(screen.getByRole('form')).toBeInTheDocument();

    // Check for form controls
    const formControls = screen.getAllByRole('group');
    expect(formControls).toHaveLength(3);

    // Check for input fields
    expect(screen.getByLabelText(/translated_username/i)).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText(/translated_password/i)).toHaveAttribute('type', 'password');

    // Check for select field
    const userTypeSelect = screen.getByLabelText(/translated_userType/i);
    expect(userTypeSelect).toBeInTheDocument();
    expect(userTypeSelect).toHaveValue('');

    // Check for select options
    expect(screen.getByRole('option', { name: /translated_selectUserType/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /translated_farmer/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /translated_consumer/i })).toBeInTheDocument();

    // Check for submit button
    expect(screen.getByRole('button', { name: /translated_login/i })).toBeInTheDocument();

    // Check for limited access note
    expect(screen.getByText(/translated_limitedAccessNote/i)).toBeInTheDocument();
  });

  it('updates state on input change', () => {
    customRender(<LoginForm onSubmit={() => {}} />);

    const usernameInput = screen.getByLabelText(/translated_username/i);
    act(() => {
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    });
    expect(usernameInput).toHaveValue('testuser');

    const passwordInput = screen.getByLabelText(/translated_password/i);
    act(() => {
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });
    expect(passwordInput).toHaveValue('password123');

    const userTypeSelect = screen.getByLabelText(/translated_userType/i);
    act(() => {
      fireEvent.change(userTypeSelect, { target: { value: 'farmer' } });
    });
    expect(userTypeSelect).toHaveValue('farmer');
  });

  it('calls onSubmit with form data when submitted', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue();
    customRender(<LoginForm onSubmit={mockOnSubmit} />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/translated_username/i), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByLabelText(/translated_password/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/translated_userType/i), { target: { value: 'farmer' } });
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('form'));
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
      userType: 'farmer'
    });
  });

  it('shows loading state during form submission', async () => {
    const mockOnSubmit = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    customRender(<LoginForm onSubmit={mockOnSubmit} />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/translated_username/i), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByLabelText(/translated_password/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/translated_userType/i), { target: { value: 'farmer' } });
      fireEvent.submit(screen.getByRole('form'));
    });

    expect(screen.getByRole('button', { name: /translated_login/i })).toHaveAttribute('data-loading', 'true');

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    expect(screen.getByRole('button', { name: /translated_login/i })).not.toHaveAttribute('data-loading');
  });
});
