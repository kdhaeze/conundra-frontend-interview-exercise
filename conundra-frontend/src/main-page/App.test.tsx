import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MainPage from './main-page';

test('renders learn react link', () => {
  render(<MainPage />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
