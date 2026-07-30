import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { MonthlyAggregationResult, FilterState } from '../types/fuel';
import { Box } from '@mantine/core';

interface MonthlyRSPChartProps {
  data: MonthlyAggregationResult[];
  filters: FilterState;
}

export const MonthlyRSPChart: React.FC<MonthlyRSPChartProps> = ({ data, filters }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  const dynamicTitle = `Monthly Average RSP — ${filters.fuelType || ''} (${filters.city || ''}) — ${filters.year || ''}`;

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize ECharts instance if not already initialized
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current, undefined, {
        renderer: 'canvas',
      });
    }

    const chartInstance = chartInstanceRef.current;

    const xData = data.map((d) => d.shortMonthName);
    const yData = data.map((d) => d.averageRSP);

    // Calculate valid average for markLine
    const validPrices = data.filter((d) => d.averageRSP > 0).map((d) => d.averageRSP);
    const yearlyAvg =
      validPrices.length > 0
        ? Number((validPrices.reduce((a, b) => a + b, 0) / validPrices.length).toFixed(2))
        : 0;

    const option = {
      backgroundColor: '#ffffff',
      title: {
        text: dynamicTitle,
        left: 'center',
        top: 10,
        textStyle: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 16,
          fontWeight: 700,
          color: '#0f172a',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(37, 99, 235, 0.06)',
          },
        },
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        shadowBlur: 15,
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        padding: [12, 16],
        borderRadius: 10,
        textStyle: {
          color: '#0f172a',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 13,
        },
        formatter: (params: any) => {
          const item = params[0];
          if (!item) return '';
          const monthIndex = item.dataIndex;
          const monthFull = data[monthIndex]?.monthName || item.name;
          const val = item.value;
          const recCount = data[monthIndex]?.recordCount || 0;
          const isHighest = val > 0 && Math.max(...yData) === val;
          const isLowest = val > 0 && Math.min(...validPrices) === val;

          return `
            <div style="font-weight: 700; color: #1e293b; font-size: 14px; margin-bottom: 6px;">${monthFull} ${filters.year || ''}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 4px;">
              <span style="color: #64748b; font-weight: 500;">Average RSP:</span>
              <strong style="color: #2563eb; font-size: 15px;">₹ ${val > 0 ? Number(val).toFixed(2) : '0.00'} / L</strong>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px;">
              <span style="color: #64748b; font-weight: 500;">Recorded Days:</span>
              <span style="color: #334155; font-weight: 600;">${recCount} days</span>
            </div>
            ${
              isHighest
                ? '<div style="margin-top: 6px; padding: 2px 8px; background: #ffe4e6; color: #e11d48; font-weight: 700; font-size: 11px; border-radius: 4px; text-align: center;">Highest Price Month</div>'
                : ''
            }
            ${
              isLowest
                ? '<div style="margin-top: 6px; padding: 2px 8px; background: #d1fae5; color: #059669; font-weight: 700; font-size: 11px; border-radius: 4px; text-align: center;">Lowest Price Month</div>'
                : ''
            }
          `;
        },
      },
      grid: {
        left: '4%',
        right: '4%',
        bottom: '8%',
        top: '18%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisLine: {
          lineStyle: {
            color: '#cbd5e1',
          },
        },
        axisTick: {
          alignWithLabel: true,
          lineStyle: {
            color: '#94a3b8',
          },
        },
        axisLabel: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: '#475569',
        },
      },
      yAxis: {
        type: 'value',
        name: 'Average RSP (₹/L)',
        nameLocation: 'end',
        nameGap: 15,
        nameTextStyle: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: '#64748b',
          padding: [0, 0, 0, 10],
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#f1f5f9',
          },
        },
        axisLabel: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 12,
          color: '#64748b',
          formatter: (value: number) => `₹${value}`,
        },
      },
      series: [
        {
          name: 'Average RSP',
          type: 'bar',
          barWidth: '45%',
          data: yData,
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#3b82f6' },
              { offset: 0.5, color: '#2563eb' },
              { offset: 1, color: '#1d4ed8' },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#60a5fa' },
                { offset: 1, color: '#2563eb' },
              ]),
              shadowBlur: 12,
              shadowOffsetX: 0,
              shadowColor: 'rgba(37, 99, 235, 0.3)',
            },
          },
          markLine: yearlyAvg > 0 ? {
            symbol: 'none',
            data: [
              {
                type: 'average',
                name: 'Yearly Avg',
                lineStyle: {
                  color: '#ef4444',
                  type: 'dashed',
                  width: 2,
                },
                label: {
                  formatter: `Avg: ₹${yearlyAvg}`,
                  position: 'end',
                  color: '#ef4444',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                },
              },
            ],
          } : undefined,
          markPoint: {
            data: [
              { type: 'max', name: 'Peak Price', symbolSize: 45 },
              { type: 'min', name: 'Lowest Price', symbolSize: 45 },
            ],
            label: {
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              color: '#ffffff',
            },
            itemStyle: {
              color: '#2563eb',
            },
          },
          animationDuration: 1000,
          animationEasing: 'cubicOut',
        },
      ],
    };

    chartInstance.setOption(option as any, true);

    // Handle responsive window resize
    const handleResize = () => {
      chartInstance.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, dynamicTitle, filters]);

  // Clean up ECharts instance on unmount
  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <Box
      style={{
        width: '100%',
        height: '440px',
        position: 'relative',
      }}
    >
      <div
        ref={chartRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
};
