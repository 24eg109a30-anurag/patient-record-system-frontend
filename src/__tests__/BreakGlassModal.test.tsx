import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BreakGlassModal } from '../components/consent/BreakGlassModal';
import { MOCK_PATIENTS } from '../api/client';

describe('BreakGlassModal Component', () => {
  it('renders emergency override warning and input fields', () => {
    const handleClose = vi.fn();
    const handleBreakGlass = vi.fn();

    render(
      <BreakGlassModal
        isOpen={true}
        onClose={handleClose}
        patient={MOCK_PATIENTS[0]}
        onBreakGlassTriggered={handleBreakGlass}
      />
    );

    expect(screen.getByText(/Emergency Break-Glass Override/i)).toBeInTheDocument();
    expect(screen.getByText(/Emergency Reason:/i)).toBeInTheDocument();
    expect(screen.getByText(/Patient Condition:/i)).toBeInTheDocument();
  });

  it('requires checkbox acknowledgment before submitting emergency override', async () => {
    const handleClose = vi.fn();
    const handleBreakGlass = vi.fn();

    render(
      <BreakGlassModal
        isOpen={true}
        onClose={handleClose}
        patient={MOCK_PATIENTS[0]}
        onBreakGlassTriggered={handleBreakGlass}
      />
    );

    const submitBtn = screen.getByText(/Override & Open Record/i);
    expect(submitBtn).toBeDisabled();

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleBreakGlass).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String)
      );
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
