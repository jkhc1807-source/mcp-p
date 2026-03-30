import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import About from './About';

test('renders About page title', () => {
  render(
    <MemoryRouter>
      <About />
    </MemoryRouter>
  );
  const titleElement = screen.getByText(/소개 페이지입니다/i);
  expect(titleElement).toBeInTheDocument();
});
