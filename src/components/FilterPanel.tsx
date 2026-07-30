import React from 'react';
import { SimpleGrid, Select, Paper, Title, Text, Group, Badge } from '@mantine/core';
import { IconMapPin, IconGasStation, IconCalendar, IconFilter } from '@tabler/icons-react';
import { FilterState } from '../types/fuel';

interface FilterPanelProps {
  filters: FilterState;
  cityOptions: string[];
  fuelTypeOptions: string[];
  yearOptions: string[];
  onFilterChange: (key: keyof FilterState, value: string | null) => void;
  disabled?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  cityOptions,
  fuelTypeOptions,
  yearOptions,
  onFilterChange,
  disabled = false,
}) => {
  return (
    <Paper
      p="lg"
      radius="lg"
      withBorder
      style={{
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        marginBottom: '24px',
      }}
    >
      <Group justify="space-between" align="center" mb="md">
        <Group gap="xs">
          <IconFilter size={20} color="#2563eb" />
          <div>
            <Title order={3} style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 700 }}>
              Dataset Filters
            </Title>
            <Text size="xs" c="dimmed">
              Dynamically slice data by Metro City, Fuel Type, and Calendar Year
            </Text>
          </div>
        </Group>

        {filters.city && filters.fuelType && filters.year && (
          <Badge variant="light" color="blue" size="md" radius="sm">
            Active: {filters.city} • {filters.fuelType} • {filters.year}
          </Badge>
        )}
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Select
          id="metro-city-select"
          label="Metro City"
          placeholder="Select Metro City"
          data={cityOptions}
          value={filters.city}
          onChange={(val) => onFilterChange('city', val)}
          disabled={disabled}
          leftSection={<IconMapPin size={18} color="#2563eb" />}
          searchable
          allowDeselect={false}
          styles={{
            label: { fontWeight: 600, color: '#334155', marginBottom: '6px' },
            input: {
              borderColor: '#cbd5e1',
              borderRadius: '10px',
              fontWeight: 500,
              backgroundColor: '#f8fafc',
              '&:focus': { borderColor: '#2563eb', backgroundColor: '#ffffff' },
            },
          }}
        />

        <Select
          id="fuel-type-select"
          label="Fuel Type"
          placeholder="Select Fuel Type"
          data={fuelTypeOptions}
          value={filters.fuelType}
          onChange={(val) => onFilterChange('fuelType', val)}
          disabled={disabled}
          leftSection={<IconGasStation size={18} color="#059669" />}
          searchable
          allowDeselect={false}
          styles={{
            label: { fontWeight: 600, color: '#334155', marginBottom: '6px' },
            input: {
              borderColor: '#cbd5e1',
              borderRadius: '10px',
              fontWeight: 500,
              backgroundColor: '#f8fafc',
              '&:focus': { borderColor: '#059669', backgroundColor: '#ffffff' },
            },
          }}
        />

        <Select
          id="calendar-year-select"
          label="Calendar Year"
          placeholder="Select Calendar Year"
          data={yearOptions}
          value={filters.year}
          onChange={(val) => onFilterChange('year', val)}
          disabled={disabled}
          leftSection={<IconCalendar size={18} color="#d97706" />}
          searchable
          allowDeselect={false}
          styles={{
            label: { fontWeight: 600, color: '#334155', marginBottom: '6px' },
            input: {
              borderColor: '#cbd5e1',
              borderRadius: '10px',
              fontWeight: 500,
              backgroundColor: '#f8fafc',
              '&:focus': { borderColor: '#d97706', backgroundColor: '#ffffff' },
            },
          }}
        />
      </SimpleGrid>
    </Paper>
  );
};
