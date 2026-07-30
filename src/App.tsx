import React, { useEffect, useState, useMemo } from 'react';
import {
  Container,
  Paper,
  Loader,
  Text,
  Alert,
  Center,
  Stack,
  Box,
  Badge,
  Group,
  MantineProvider,
  createTheme,
  Divider,
} from '@mantine/core';
import { IconAlertCircle, IconChartBar, IconDatabase } from '@tabler/icons-react';
import { DashboardHeader } from './components/DashboardHeader';
import { FilterPanel } from './components/FilterPanel';
import { KpiSummaryCards } from './components/KpiSummaryCards';
import { MonthlyRSPChart } from './components/MonthlyRSPChart';
import { FilterState, IndexedDataset, NormalizedFuelRecord } from './types/fuel';
import { parseFuelCSV } from './utils/dataParser';
import {
  extractUniqueFilterOptions,
  buildIndexedDataset,
  computeMonthlyAverages,
  computeKpiSummary,
} from './utils/dataProcessor';

const theme = createTheme({
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  primaryColor: 'blue',
});

export const AppContent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<NormalizedFuelRecord[]>([]);

  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [fuelTypeOptions, setFuelTypeOptions] = useState<string[]>([]);
  const [yearOptions, setYearOptions] = useState<string[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    city: null,
    fuelType: null,
    year: null,
  });

  // Load dataset asynchronously (supports dataset.csv or metro.csv)
  useEffect(() => {
    async function loadDataset() {
      try {
        setLoading(true);
        let csvText = '';

        try {
          const res = await fetch('./dataset.csv');
          if (res.ok) {
            csvText = await res.text();
          }
        } catch {
          // Fallback to metro.csv
        }

        if (!csvText || !csvText.trim()) {
          const resFallback = await fetch('./metro.csv');
          if (!resFallback.ok) {
            throw new Error(`HTTP error fetching dataset: ${resFallback.status}`);
          }
          csvText = await resFallback.text();
        }

        const parsedRecords = parseFuelCSV(csvText);

        if (parsedRecords.length === 0) {
          setError('Failed to parse dataset or dataset is empty.');
          setLoading(false);
          return;
        }

        setRecords(parsedRecords);

        const { cities, fuelTypes, years } = extractUniqueFilterOptions(parsedRecords);

        setCityOptions(cities);
        setFuelTypeOptions(fuelTypes);
        setYearOptions(years);

        // Automatically select the first valid option so chart displays immediately
        setFilters({
          city: cities[0] || null,
          fuelType: fuelTypes[0] || null,
          year: years[0] || null,
        });

        setLoading(false);
      } catch (err: any) {
        console.error('Error loading fuel dataset:', err);
        setError(err?.message || 'An unexpected error occurred while loading dataset.');
        setLoading(false);
      }
    }

    loadDataset();
  }, []);

  // Pre-index dataset for O(1) performance
  const indexedDataset: IndexedDataset = useMemo(() => {
    return buildIndexedDataset(records);
  }, [records]);

  // Compute 12-month average RSP dynamically based on selected filters
  const monthlyData = useMemo(() => {
    if (!filters.city || !filters.fuelType || !filters.year) {
      return [];
    }
    const parsedYear = parseInt(filters.year, 10);
    return computeMonthlyAverages(indexedDataset, filters.city, filters.fuelType, parsedYear);
  }, [indexedDataset, filters.city, filters.fuelType, filters.year]);

  // Compute summary KPI metrics for selected filter combination
  const kpiSummary = useMemo(() => {
    return computeKpiSummary(monthlyData);
  }, [monthlyData]);

  const handleFilterChange = (key: keyof FilterState, value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const hasUsableData = useMemo(() => {
    if (!monthlyData || monthlyData.length === 0) return false;
    return monthlyData.some((m) => m.recordCount > 0 && m.averageRSP > 0);
  }, [monthlyData]);

  return (
    <Box style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
      <DashboardHeader />

      <Container size="xl" mt="xl">
        <FilterPanel
          filters={filters}
          cityOptions={cityOptions}
          fuelTypeOptions={fuelTypeOptions}
          yearOptions={yearOptions}
          onFilterChange={handleFilterChange}
          disabled={loading || !!error}
        />

        {!loading && !error && hasUsableData && (
          <KpiSummaryCards summary={kpiSummary} filters={filters} />
        )}

        <Paper
          p="lg"
          radius="lg"
          withBorder
          style={{
            backgroundColor: '#ffffff',
            borderColor: '#e2e8f0',
            boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.04)',
          }}
        >
          <Group justify="space-between" align="center" mb="lg">
            <Group gap="xs">
              <IconChartBar size={22} color="#2563eb" />
              <Text style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>
                Monthly Average RSP Bar Chart
              </Text>
            </Group>

            {!loading && records.length > 0 && (
              <Group gap="xs">
                <Badge variant="light" color="blue" leftSection={<IconDatabase size={14} />}>
                  {records.length.toLocaleString()} Dataset Records
                </Badge>
              </Group>
            )}
          </Group>

          {loading ? (
            <Center style={{ height: 380 }}>
              <Stack align="center" gap="xs">
                <Loader size="lg" type="dots" color="blue" />
                <Text size="sm" c="dimmed" fw={500}>
                  Loading National Data & Analytics Platform dataset...
                </Text>
              </Stack>
            </Center>
          ) : error ? (
            <Alert icon={<IconAlertCircle size={20} />} title="Data Error" color="red" my="lg">
              {error}
            </Alert>
          ) : !hasUsableData ? (
            <Center style={{ height: 340 }}>
              <Stack align="center" gap="xs">
                <IconAlertCircle size={42} color="#94a3b8" />
                <Text size="md" fw={600} style={{ color: '#64748b' }}>
                  No data available for the selected filters.
                </Text>
                <Text size="xs" c="dimmed">
                  Please try selecting a different Metro City, Fuel Type, or Calendar Year.
                </Text>
              </Stack>
            </Center>
          ) : (
            <MonthlyRSPChart data={monthlyData} filters={filters} />
          )}
        </Paper>

        <Divider my="xl" color="#e2e8f0" />

        <Center mt="md">
          <Text size="xs" c="dimmed" style={{ textAlign: 'center' }}>
            National Data & Analytics Platform (NDAP), NITI Aayog • Petroleum Planning & Analysis Cell (PPAC)
            <br />
            Built with React, Vite, Mantine UI, and Apache ECharts
          </Text>
        </Center>
      </Container>
    </Box>
  );
};

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <AppContent />
    </MantineProvider>
  );
}
