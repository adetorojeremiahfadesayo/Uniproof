import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('UniProof app flow', () => {
  it('shows Ada as verified and releases emergency aid once', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getAllByText('Ada Okafor').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Verified').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Emergency Aid Grant').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /release funds/i }));

    expect(screen.getByText(/Funds released on Stellar testnet/i)).toBeInTheDocument();
    expect(screen.getByText('Claim used')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /release funds/i }));

    expect(screen.getAllByText(/Claim already used/i).length).toBeGreaterThan(0);
  });

  it('lets a donor fund the selected pool', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /add 1000 xlm/i }));

    expect(screen.getByText(/Donor funding confirmed/i)).toBeInTheDocument();
    expect(screen.getByText('3,500 XLM')).toBeInTheDocument();
  });
});
