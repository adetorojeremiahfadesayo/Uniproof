import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('UniProof app flow', () => {
  it('does not show the contract events or deployment panels in the main workflow', () => {
    render(<App />);

    expect(screen.queryByText(/Contract Events/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Deployment Readiness/i)).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: /Guided demo tour/i })).toBeInTheDocument();
    expect(screen.getByText(/Step 1 of 6/i)).toBeInTheDocument();
    expect(screen.getByText(/Watch this panel verify the deployed Stellar testnet contract/i)).toBeInTheDocument();
  });

  it('walks judges through the guided spotlight tour', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText(/Step 2 of 6/i)).toBeInTheDocument();
    expect(screen.getByText(/Click Maya Chen/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Skip tour/i }));
    expect(screen.queryByRole('dialog', { name: /Guided demo tour/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Demo Guide/i }));
    expect(screen.getByRole('dialog', { name: /Guided demo tour/i })).toBeInTheDocument();
    expect(screen.getByText(/Step 1 of 6/i)).toBeInTheDocument();
  });

  it('shows Maya as verified, releases emergency aid once, and resets to student selection', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Skip tour/i }));

    expect(screen.getAllByText('Maya Chen').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /Maya Chen/i }));
    await user.click(await screen.findByRole('button', { name: /Emergency Aid Grant/i }, { timeout: 5000 }));
    expect(await screen.findByText(/Qwen Fraud Review Agent/i, {}, { timeout: 5000 })).toBeInTheDocument();
    expect(await screen.findByText(/Low fraud risk/i, {}, { timeout: 5000 })).toBeInTheDocument();
    await user.click(await screen.findByRole('button', { name: /release funds/i }, { timeout: 5000 }));

    expect(screen.getAllByText(/Funds released on Stellar testnet/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('dialog', { name: /Claim approved/i })).toBeInTheDocument();
    expect(screen.getByText(/Confetti success/i)).toBeInTheDocument();
    expect(screen.getByText(/Proof rejected - 2\/3 checks passed/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try another student/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Try another student/i }));

    expect(screen.getAllByText(/Select a student and pool to begin verification/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Leo Martin/i })).toBeInTheDocument();
  }, 10000);

  it('lets a donor fund the selected pool', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Skip tour/i }));
    await user.click(screen.getByRole('button', { name: /Maya Chen/i }));
    await user.click(await screen.findByRole('button', { name: /Emergency Aid Grant/i }, { timeout: 5000 }));
    await user.click(await screen.findByRole('button', { name: /add 1000 xlm/i }, { timeout: 5000 }));

    expect(screen.getAllByText(/Donor funding confirmed/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/3,500 XLM available/i)).toBeInTheDocument();
  }, 10000);

  it('rejects an unverified student through the contract guard', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Skip tour/i }));
    await user.click(screen.getByRole('button', { name: /Leo Martin/i }));
    await user.click(await screen.findByRole('button', { name: /Emergency Aid Grant/i }, { timeout: 5000 }));
    expect(await screen.findByText(/Qwen Fraud Review Agent/i, {}, { timeout: 5000 })).toBeInTheDocument();
    expect(await screen.findByText(/High fraud risk/i, {}, { timeout: 5000 })).toBeInTheDocument();
    await user.click(await screen.findByRole('button', { name: /release funds/i }, { timeout: 5000 }));

    expect(screen.getAllByText(/Claim rejected by contract rules/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('dialog', { name: /Claim rejected/i })).toBeInTheDocument();
    expect(screen.getByText(/University credential is not verified/i)).toBeInTheDocument();
    expect(screen.getAllByText(/proof rejected/i).length).toBeGreaterThan(0);
  }, 10000);

  it('funds the selected scholarship pool', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Skip tour/i }));
    await user.click(screen.getByRole('button', { name: /Maya Chen/i }));
    await user.click(await screen.findByRole('button', { name: /Computer Science Scholarship/i }, { timeout: 5000 }));
    expect(screen.getAllByText(/Computer Science Scholarship selected/i).length).toBeGreaterThan(0);

    await user.click(await screen.findByRole('button', { name: /add 1000 xlm/i }, { timeout: 5000 }));

    expect(screen.getByText(/6,000 XLM available/i)).toBeInTheDocument();
  }, 10000);
});
