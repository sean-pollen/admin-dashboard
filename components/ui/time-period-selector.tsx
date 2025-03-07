'use client';

import { ToggleGroup, ToggleGroupItem } from './toggle-group';

export type TimePeriod = 'short_term' | 'medium_term' | 'long_term';

interface TimePeriodSelectorProps {
  value: TimePeriod;
  onChange: (value: TimePeriod) => void;
}

export default function TimePeriodSelector({
  value,
  onChange
}: TimePeriodSelectorProps) {
  const handleSelect = (newValue: string) => {
    if (newValue) {
      onChange(newValue as TimePeriod);
    }
  };

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={handleSelect}
      className="w-full max-w-md justify-start"
    >
      <ToggleGroupItem value="short_term" className="flex-1 px-3">
        1 Month
      </ToggleGroupItem>
      <ToggleGroupItem value="medium_term" className="flex-1 px-3">
        6 Months
      </ToggleGroupItem>
      <ToggleGroupItem value="long_term" className="flex-1 px-3">
        1 Year
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
