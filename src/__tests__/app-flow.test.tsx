import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('UniProof app flow', () => {
  it('does not show the contract events or deployment panels in the main workflow', () => {
    render(<App />);

    expect(screen.queryByText(/Contract Events/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Deployment Readiness/i)).not.toBeInTheDocument();
  });

  it('shows Ada as verified and releases emergency aid once', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getAllByText('Ada Okafor').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /Ada Okafor/i }));
    await user.click(await screen.findByRole('button', { name: /Emergency Aid Grant/i }, { timeout: 5000 }));
    await user.click(await screen.findByRole('button', { name: /release funds/i }, { timeout: 5000 }));

    expect(screen.getAllByText(/Funds released on Stellar testnet/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('dialog', { name: /Claim approved/i })).toBeInTheDocument();
    expect(screen.getByText(/Confetti success/i)).toBeInTheDocument();
    expect(screen.getByText(/Proof rejected - 2\/3 checks passed/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /release funds/i }));

    expect(screen.getAllByText(/Claim already used/i).length).toBeGreaterThan(0);
  }, 10000);

  it('lets a donor fund the selected pool', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Ada Okafor/i }));
    await user.click(await screen.findByRole('button', { name: /Emergency Aid Grant/i }, { timeout: 5000 }));
    await user.click(await screen.findByRole('button', { name: /add 1000 xlm/i }, { timeout: 5000 }));

    expect(screen.getAllByText(/Donor funding confirmed/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/3,500 XLM available/i)).toBeInTheDocument();
  }, 10000);

  it('rejects an unverified student through the contract guard', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Timi Adeyemi/i }));
    await user.click(await screen.findByRole('button', { name: /Emergency Aid Grant/i }, { timeout: 5000 }));
    await user.click(await screen.findByRole('button', { name: /release funds/i }, { timeout: 5000 }));

    expect(screen.getAllByText(/Claim rejected by contract rules/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('dialog', { name: /Claim rejected/i })).toBeInTheDocument();
    expect(screen.getByText(/University credential is not verified/i)).toBeInTheDocument();
    expect(screen.getAllByText(/proof rejected/i).length).toBeGreaterThan(0);
  }, 10000);

  it('funds the selected scholarship pool', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Ada Okafor/i }));
    await user.click(await screen.findByRole('button', { name: /Computer Science Scholarship/i }, { timeout: 5000 }));
    expect(screen.getAllByText(/Computer Science Scholarship selected/i).length).toBeGreaterThan(0);

    await user.click(await screen.findByRole('button', { name: /add 1000 xlm/i }, { timeout: 5000 }));

    expect(screen.getByText(/6,000 XLM available/i)).toBeInTheDocument();
  }, 10000);
});
