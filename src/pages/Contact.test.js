import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contact from './Contact';

test('renders Contact page title', () => {
  render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>
  );
  const titleElement = screen.getByText(/Contact Us/i);
  expect(titleElement).toBeInTheDocument();
});

test('shows form when Send Message is clicked', () => {
  render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>
  );
  
  const sendButton = screen.getByRole('button', { name: /Send Message/i });
  fireEvent.click(sendButton);
  
  const nameInput = screen.getByPlaceholderText(/Name/i);
  const emailInput = screen.getByPlaceholderText(/Email/i);
  const messageInput = screen.getByPlaceholderText(/Your Message/i);
  
  expect(nameInput).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
  expect(messageInput).toBeInTheDocument();
});
