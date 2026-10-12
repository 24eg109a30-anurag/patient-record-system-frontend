import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConsentModal } from '../components/consent/ConsentModal';
import { MOCK_PATIENTS } from '../api/client';

describe('ConsentModal Component', () => {
  it('renders step 1 requesting patient authorization', () => {
    const handleClose = vi.fn();
    const handleConsentGranted = vi.fn();

    render(
      <ConsentModal
        isOpen={true}
        onClose={handleClose}
        patient={MOCK_PATIENTS[0]}
        onConsentGranted={handleConsentGranted}
      />
    );

    expect(screen.getByText(/Authorize Record Access/i)).toBeInTheDocument();
    expect(screen.getByText(/Send OTP to Patient/i)).toBeInTheDocument();
  });

  it('progresses to step 2 after sending OTP and verifies code', async () => {
    const handleClose = vi.fn();
    const handleConsentGranted = vi.fn();

    render(
      <ConsentModal
        isOpen={true}
        onClose={handleClose}
        patient={MOCK_PATIENTS[0]}
        onConsentGranted={handleConsentGranted}
      />
    );

    const sendOtpBtn = screen.getByText(/Send OTP to Patient/i);
    fireEvent.click(sendOtpBtn);

    await waitFor(() => {
      expect(screen.getByText(/Enter Verification Code/i)).toBeInTheDocument();
    });

    const verifyBtn = screen.getByText(/Verify & Unlock/i);
    fireEvent.click(verifyBtn);

    await waitFor(() => {
      expect(handleConsentGranted).toHaveBeenCalledWith(expect.stringContaining('CST-APPROVED-'));
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
