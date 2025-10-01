import React from 'react';

interface YearPickerProps {
  value: string;
  onChange: (year: string) => void;
  minYear?: number;
  maxYear?: number;
}

export function YearPicker({ value, onChange, minYear = 1900, maxYear }: YearPickerProps) {
  const currentYear = new Date().getFullYear();
  const years = [];
  const max = maxYear || currentYear + 1;
  for (let y = max; y >= minYear; y--) {
    years.push(y);
  }
  return (
    <select
      className="border border-gray-700 p-2 rounded focus:ring-2 focus:ring-purple-500 bg-gray-900 text-gray-100 placeholder-gray-400"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">Select year</option>
      {years.map(y => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>
  );
}
