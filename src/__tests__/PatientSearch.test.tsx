import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PatientSearch } from '../components/patient/PatientSearch';
import { MOCK_PATIENTS } from '../api/client';

describe('PatientSearch Component', () => {
  it('renders patient registry matches correctly', () => {
    const handleSelect = vi.fn();
    const handleSearch = vi.fn();

    render(
      <PatientSearch
        patients={MOCK_PATIENTS}
        selectedPatientId={null}
        onSelectPatient={handleSelect}
        onSearch={handleSearch}
      />
    );

    expect(screen.getByText('Johnathon Edward Doe')).toBeInTheDocument();
    expect(screen.getByText('Alice Marie Smith')).toBeInTheDocument();
    expect(screen.getByText('NHID-9821-4471')).toBeInTheDocument();
  });

  it('triggers search callback when input text changes', () => {
    const handleSelect = vi.fn();
    const handleSearch = vi.fn();

    render(
      <PatientSearch
        patients={MOCK_PATIENTS}
        selectedPatientId={null}
        onSelectPatient={handleSelect}
        onSearch={handleSearch}
      />
    );

    const input = screen.getByPlaceholderText(/Search name, NHID, phone/i);
    fireEvent.change(input, { target: { value: 'Alice' } });

    expect(handleSearch).toHaveBeenCalledWith('Alice');
  });

  it('triggers onSelectPatient callback when clicking a patient card', () => {
    const handleSelect = vi.fn();
    const handleSearch = vi.fn();

    render(
      <PatientSearch
        patients={MOCK_PATIENTS}
        selectedPatientId={null}
        onSelectPatient={handleSelect}
        onSearch={handleSearch}
      />
    );

    const patientCard = screen.getByText('Johnathon Edward Doe');
    fireEvent.click(patientCard);

    expect(handleSelect).toHaveBeenCalledWith(MOCK_PATIENTS[0]);
  });
});
