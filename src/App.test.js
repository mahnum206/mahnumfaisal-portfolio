import { render, screen } from '@testing-library/react';
import App from './App';

test('renders hero name', () => {
  render(<App />);
  expect(screen.getByText(/mahnum faisal/i)).toBeInTheDocument();
});
