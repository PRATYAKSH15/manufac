import React from 'react';
import { Group, Title, Text, Box, Container, ThemeIcon } from '@mantine/core';
import { IconGasStation, IconChartAreaLine } from '@tabler/icons-react';

export const DashboardHeader: React.FC = () => {
  return (
    <Box
      component="header"
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        paddingTop: '20px',
        paddingBottom: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
      }}
    >
      <Container size="xl">
        <Group justify="space-between" align="center">
          <Group gap="md">
            <ThemeIcon
              size={48}
              radius="xl"
              variant="gradient"
              gradient={{ from: 'blue', to: 'indigo', deg: 135 }}
              style={{ boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)' }}
            >
              <IconGasStation size={26} stroke={2} />
            </ThemeIcon>
            <div>
              <Title
                order={1}
                style={{
                  color: '#0f172a',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: '1.65rem',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                Manufac Analytics
              </Title>
              <Text
                size="sm"
                style={{
                  color: '#64748b',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 500,
                  marginTop: '2px',
                }}
              >
                Retail Fuel Price Analytics Dashboard — Metro Cities
              </Text>
            </div>
          </Group>

          <Group gap="sm">
            <Box
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <IconChartAreaLine size={16} color="#2563eb" />
              <Text size="xs" style={{ color: '#1e293b', fontWeight: 600, letterSpacing: '0.02em' }}>
                NDAP / NITI Aayog Dataset
              </Text>
            </Box>
          </Group>
        </Group>
      </Container>
    </Box>
  );
};
