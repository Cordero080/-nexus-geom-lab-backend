import { jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Quote from './Quote';

describe('Quote Component', () => {
  it('should render without crashing', () => {
    render(<Quote />);
  });

  it('should render the quote text', () => {
    render(<Quote />);

    const quoteText = screen.getByText(/The universe is a terrifyingly elegant apparatus/i);
    expect(quoteText).toBeInTheDocument();
  });

  it('should apply the correct CSS class', () => {
    const { container } = render(<Quote />);

    const quoteDiv = container.querySelector('[class*="quoteHighlight"]');
    expect(quoteDiv).toBeInTheDocument();
  });
});
