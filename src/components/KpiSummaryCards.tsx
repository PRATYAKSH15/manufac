import React from 'react';
import { SimpleGrid, Paper, Text, Group, ThemeIcon, Badge } from '@mantine/core';
import {
  IconCurrencyRupee,
  IconTrendingUp,
  IconTrendingDown,
  IconCalendarStats,
} from '@tabler/icons-react';
import { KpiSummary, FilterState } from '../types/fuel';

interface KpiSummaryCardsProps {
  summary: KpiSummary;
  filters: FilterState;
}

export const KpiSummaryCards: React.FC<KpiSummaryCardsProps> = ({ summary, filters }) => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mb="xl">
      {/* Card 1: Yearly Average */}
      <Paper
        p="md"
        radius="lg"
        withBorder
        style={{
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
          boxShadow: '0 4px 15px rgba(37, 99, 235, 0.04)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <Group justify="space-between" align="flex-start">
          <div>
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5}>
              Yearly Average ({filters.year || 'Selected'})
            </Text>
            <Text size="xl" fw={800} style={{ color: '#0f172a', marginTop: 4 }}>
              {summary.yearlyAverage > 0 ? `₹${summary.yearlyAverage.toFixed(2)}` : '₹0.00'}
              <Text component="span" size="xs" fw={500} c="dimmed" ml={4}>
                / L
              </Text>
            </Text>
          </div>
          <ThemeIcon size={42} radius="md" variant="light" color="blue">
            <IconCurrencyRupee size={22} />
          </ThemeIcon>
        </Group>
        <Group justify="space-between" mt="sm">
          <Badge variant="subtle" color="blue" size="xs">
            {filters.city || 'Metro'} • {filters.fuelType || 'Fuel'}
          </Badge>
        </Group>
      </Paper>

      {/* Card 2: Highest Price Month */}
      <Paper
        p="md"
        radius="lg"
        withBorder
        style={{
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
          boxShadow: '0 4px 15px rgba(225, 29, 72, 0.04)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <Group justify="space-between" align="flex-start">
          <div>
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5}>
              Peak RSP Month
            </Text>
            <Text size="xl" fw={800} style={{ color: '#e11d48', marginTop: 4 }}>
              {summary.highestMonth.price > 0 ? `₹${summary.highestMonth.price.toFixed(2)}` : '₹0.00'}
            </Text>
          </div>
          <ThemeIcon size={42} radius="md" variant="light" color="rose">
            <IconTrendingUp size={22} />
          </ThemeIcon>
        </Group>
        <Group justify="space-between" mt="sm">
          <Badge variant="light" color="rose" size="xs">
            {summary.highestMonth.monthName}
          </Badge>
        </Group>
      </Paper>

      {/* Card 3: Lowest Price Month */}
      <Paper
        p="md"
        radius="lg"
        withBorder
        style={{
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.04)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <Group justify="space-between" align="flex-start">
          <div>
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5}>
              Lowest RSP Month
            </Text>
            <Text size="xl" fw={800} style={{ color: '#059669', marginTop: 4 }}>
              {summary.lowestMonth.price > 0 ? `₹${summary.lowestMonth.price.toFixed(2)}` : '₹0.00'}
            </Text>
          </div>
          <ThemeIcon size={42} radius="md" variant="light" color="teal">
            <IconTrendingDown size={22} />
          </ThemeIcon>
        </Group>
        <Group justify="space-between" mt="sm">
          <Badge variant="light" color="teal" size="xs">
            {summary.lowestMonth.monthName}
          </Badge>
        </Group>
      </Paper>

      {/* Card 4: Total Recorded Days */}
      <Paper
        p="md"
        radius="lg"
        withBorder
        style={{
          backgroundColor: '#ffffff',
          borderColor: '#e2e8f0',
          boxShadow: '0 4px 15px rgba(217, 119, 6, 0.04)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <Group justify="space-between" align="flex-start">
          <div>
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5}>
              Recorded Samples
            </Text>
            <Text size="xl" fw={800} style={{ color: '#0f172a', marginTop: 4 }}>
              {summary.totalRecordedDays}
              <Text component="span" size="xs" fw={500} c="dimmed" ml={4}>
                Days
              </Text>
            </Text>
          </div>
          <ThemeIcon size={42} radius="md" variant="light" color="amber">
            <IconCalendarStats size={22} />
          </ThemeIcon>
        </Group>
        <Group justify="space-between" mt="sm">
          <Badge variant="subtle" color="amber" size="xs">
            Daily Granularity
          </Badge>
        </Group>
      </Paper>
    </SimpleGrid>
  );
};
