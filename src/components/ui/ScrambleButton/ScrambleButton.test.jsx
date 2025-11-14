import { jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScrambleButton from './ScrambleButton';

describe('ScrambleButton Component', () => {
  it('should render without crashing', () => {
    render(<ScrambleButton label="Test Button" />);
  });

  it('should call onClick handler when clicked', () => {
    const mockOnClick = jest.fn();
    const { container } = render(<ScrambleButton label="Click Me" onClick={mockOnClick} />);

    const button = container.querySelector('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should apply custom className', () => {
    const { container } = render(<ScrambleButton label="Styled Button" className="custom-class" />);

    const button = container.querySelector('.custom-class');
    expect(button).toBeInTheDocument();
  });

  it('should render as a button element', () => {
    const { container } = render(<ScrambleButton label="Test" />);

    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });
});
