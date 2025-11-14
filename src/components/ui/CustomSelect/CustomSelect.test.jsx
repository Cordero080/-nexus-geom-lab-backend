import { jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomSelect from './CustomSelect';

describe('CustomSelect Component', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('should render without crashing', () => {
    render(<CustomSelect value="option1" onChange={jest.fn()} options={mockOptions} />);
  });

  it('should render with default value', () => {
    render(<CustomSelect value="option1" onChange={jest.fn()} options={mockOptions} />);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('should call onChange when option is clicked', () => {
    const mockOnChange = jest.fn();
    const { container } = render(
      <CustomSelect value="option1" onChange={mockOnChange} options={mockOptions} />
    );

    // Click to open dropdown
    const trigger = container.querySelector('[class*="customSelect__trigger"]');
    fireEvent.click(trigger);

    // Click second option (this requires the dropdown to be open)
    const option2 = screen.getByText('Option 2');
    fireEvent.click(option2);

    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });

  it('should handle empty options array', () => {
    const { container } = render(<CustomSelect value="" onChange={jest.fn()} options={[]} />);

    const selectDiv = container.querySelector('[class*="customSelect"]');
    expect(selectDiv).toBeInTheDocument();
  });
});
