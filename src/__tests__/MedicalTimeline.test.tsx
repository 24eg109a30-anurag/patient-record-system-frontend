import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MedicalTimeline } from '../components/timeline/MedicalTimeline';
import { MOCK_TIMELINE } from '../api/client';

describe('MedicalTimeline Component', () => {
  const records = MOCK_TIMELINE['p1-uuid-4471'];

  it('renders clinical encounters with diagnoses and hospital names', () => {
    render(<MedicalTimeline timeline={records} />);

    expect(screen.getByText(/Acute Coronary Syndrome Rule-Out/i)).toBeInTheDocument();
    expect(screen.getByText(/Metropolitan General Hospital - Emergency Dept/i)).toBeInTheDocument();
    expect(screen.getByText(/Stage II Essential Hypertension/i)).toBeInTheDocument();
  });

  it('filters encounters when clicking encounter type filter pills', () => {
    render(<MedicalTimeline timeline={records} />);

    const emergencyPill = screen.getByRole('button', { name: /emergency/i });
    fireEvent.click(emergencyPill);

    expect(screen.getByText(/Acute Coronary Syndrome Rule-Out/i)).toBeInTheDocument();
    expect(screen.queryByText(/Stage II Essential Hypertension/i)).not.toBeInTheDocument();
  });

  it('renders prescriptions and lab counts inside collapsible encounter card', () => {
    render(<MedicalTimeline timeline={records} />);

    expect(screen.getByText(/Ticagrelor \(Brilinta\)/i)).toBeInTheDocument();
    expect(screen.getByText(/High-Sensitivity Troponin I/i)).toBeInTheDocument();
  });
});
