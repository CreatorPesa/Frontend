import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AmountPicker } from '@/components/tipping/AmountPicker';

describe('AmountPicker', () => {
  it('highlights the active preset amount', () => {
    render(<AmountPicker amount={10} onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: '$10' })).toHaveClass('border-brand-500');
    expect(screen.getByRole('button', { name: '$5' })).not.toHaveClass('border-brand-500');
  });

  it('calls onChange with the preset value when clicked', () => {
    const onChange = vi.fn();
    render(<AmountPicker amount={null} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: '$25' }));
    expect(onChange).toHaveBeenCalledWith(25);
  });

  it('calls onChange with a custom typed amount', () => {
    const onChange = vi.fn();
    render(<AmountPicker amount={null} onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText('Custom amount'), { target: { value: '42' } });
    expect(onChange).toHaveBeenCalledWith(42);
  });
});
