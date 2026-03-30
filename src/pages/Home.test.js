import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';

test('renders Home page title', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
  const titleElement = screen.getByText(/메인 페이지입니다!/i);
  expect(titleElement).toBeInTheDocument();
});
