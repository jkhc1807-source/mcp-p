import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders main page title in App component', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const titleElement = screen.getByText(/메인 페이지입니다!/i);
  expect(titleElement).toBeInTheDocument();
});

