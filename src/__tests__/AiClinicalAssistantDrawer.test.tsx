import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AiClinicalAssistantDrawer } from '../components/rag/AiClinicalAssistantDrawer';

describe('AiClinicalAssistantDrawer Component', () => {
  it('renders initial assistant greeting and prompt chips', () => {
    const handleClose = vi.fn();

    render(
      <AiClinicalAssistantDrawer
        isOpen={true}
        onClose={handleClose}
        patientId="p1-uuid-4471"
        patientName="Johnathon Edward Doe"
      />
    );

    expect(screen.getByText(/AI Clinical Assistant/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Johnathon Edward Doe/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Summarize cardiac complaints and stent history/i)).toBeInTheDocument();
  });

  it('sends clinical question and renders synthesized response with citations', async () => {
    const handleClose = vi.fn();

    render(
      <AiClinicalAssistantDrawer
        isOpen={true}
        onClose={handleClose}
        patientId="p1-uuid-4471"
        patientName="Johnathon Edward Doe"
      />
    );

    const promptChip = screen.getByText(/Summarize cardiac complaints and stent history/i);
    fireEvent.click(promptChip);

    await waitFor(
      () => {
        expect(screen.getByText(/Clinical Synthesis & Longitudinal Findings/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    expect(screen.getByText(/Emergency Encounter: Acute Coronary Syndrome/i)).toBeInTheDocument();
  });
});
