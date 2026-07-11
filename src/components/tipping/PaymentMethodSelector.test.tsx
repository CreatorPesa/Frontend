import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentMethodSelector } from '@/components/tipping/PaymentMethodSelector';

describe('PaymentMethodSelector', () => {
  it('renders every supported payment method', () => {
    render(<PaymentMethodSelector value={null} onChange={vi.fn()} />);
    ['M-Pesa', 'Airtel Money', 'MTN MoMo', 'Bank transfer', 'Crypto wallet'].forEach((label) => {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });
  });

  it('highlights the selected method', () => {
    render(<PaymentMethodSelector value="mtn_momo" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'MTN MoMo' })).toHaveClass('border-brand-500');
    expect(screen.getByRole('button', { name: 'M-Pesa' })).not.toHaveClass('border-brand-500');
  });

  it('calls onChange with the method id when clicked', () => {
    const onChange = vi.fn();
    render(<PaymentMethodSelector value={null} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Airtel Money' }));
    expect(onChange).toHaveBeenCalledWith('airtel_money');
  });
});
