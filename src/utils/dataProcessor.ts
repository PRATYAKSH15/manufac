import {
  NormalizedFuelRecord,
  IndexedDataset,
  MonthlyAggregationResult,
  KpiSummary,
} from '../types/fuel';

export const MONTH_NAMES_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const MONTH_NAMES_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Extracts unique Metro Cities, Fuel Types, and Calendar Years dynamically from dataset.
 * Sorted logically (e.g. Cities alphabetically, Years ascending/descending).
 */
export function extractUniqueFilterOptions(records: NormalizedFuelRecord[]) {
  const citySet = new Set<string>();
  const fuelTypeSet = new Set<string>();
  const yearSet = new Set<number>();

  for (let i = 0; i < records.length; i++) {
    const rec = records[i];
    if (rec.city) citySet.add(rec.city);
    if (rec.fuelType) fuelTypeSet.add(rec.fuelType);
    if (rec.year) yearSet.add(rec.year);
  }

  const cities = Array.from(citySet).sort();
  const fuelTypes = Array.from(fuelTypeSet).sort();
  const years = Array.from(yearSet).sort((a, b) => a - b).map(String);

  return { cities, fuelTypes, years };
}

/**
 * Pre-indexes the entire dataset into a nested lookup table for ultra-fast lookup:
 * City -> FuelType -> Year -> MonthIndex -> RSP[]
 */
export function buildIndexedDataset(records: NormalizedFuelRecord[]): IndexedDataset {
  const index: IndexedDataset = {};

  for (let i = 0; i < records.length; i++) {
    const { city, fuelType, year, monthIndex, rsp } = records[i];

    if (!index[city]) {
      index[city] = {};
    }
    if (!index[city][fuelType]) {
      index[city][fuelType] = {};
    }
    if (!index[city][fuelType][year]) {
      index[city][fuelType][year] = {};
    }
    if (!index[city][fuelType][year][monthIndex]) {
      index[city][fuelType][year][monthIndex] = [];
    }

    index[city][fuelType][year][monthIndex].push(rsp);
  }

  return index;
}

/**
 * Computes monthly average RSP for all 12 calendar months for the selected City, Fuel Type, and Year.
 * Uses the pre-indexed dataset for O(1) performance.
 * 
 * Formula:
 * Monthly Average RSP = Sum of valid RSP values for that month / Number of relevant records for that month
 * If a month has no matching records, its average value is 0.
 */
export function computeMonthlyAverages(
  indexedDataset: IndexedDataset,
  city: string | null,
  fuelType: string | null,
  year: number | null
): MonthlyAggregationResult[] {
  const results: MonthlyAggregationResult[] = [];

  for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
    const monthName = MONTH_NAMES_FULL[monthIdx];
    const shortMonthName = MONTH_NAMES_SHORT[monthIdx];

    if (!city || !fuelType || !year) {
      results.push({
        monthName,
        shortMonthName,
        averageRSP: 0,
        recordCount: 0,
        totalRSP: 0,
      });
      continue;
    }

    const rspValues = indexedDataset[city]?.[fuelType]?.[year]?.[monthIdx];

    if (!rspValues || rspValues.length === 0) {
      results.push({
        monthName,
        shortMonthName,
        averageRSP: 0,
        recordCount: 0,
        totalRSP: 0,
      });
    } else {
      const sum = rspValues.reduce((acc, val) => acc + val, 0);
      const count = rspValues.length;
      // Calculate exact monthly average rounded to 2 decimal places
      const avg = count > 0 ? Number((sum / count).toFixed(2)) : 0;

      results.push({
        monthName,
        shortMonthName,
        averageRSP: avg,
        recordCount: count,
        totalRSP: Number(sum.toFixed(2)),
      });
    }
  }

  return results;
}

/**
 * Computes summary KPI metrics (yearly average, peak month, lowest month, recorded days)
 * for the currently active filter selection.
 */
export function computeKpiSummary(monthlyData: MonthlyAggregationResult[]): KpiSummary {
  const validMonths = monthlyData.filter((m) => m.recordCount > 0 && m.averageRSP > 0);
  if (validMonths.length === 0) {
    return {
      yearlyAverage: 0,
      highestMonth: { monthName: 'N/A', price: 0 },
      lowestMonth: { monthName: 'N/A', price: 0 },
      totalRecordedDays: 0,
    };
  }

  const totalSum = validMonths.reduce((acc, m) => acc + m.totalRSP, 0);
  const totalDays = validMonths.reduce((acc, m) => acc + m.recordCount, 0);
  const yearlyAverage = totalDays > 0 ? Number((totalSum / totalDays).toFixed(2)) : 0;

  let highest = validMonths[0];
  let lowest = validMonths[0];

  for (const m of validMonths) {
    if (m.averageRSP > highest.averageRSP) highest = m;
    if (m.averageRSP < lowest.averageRSP) lowest = m;
  }

  return {
    yearlyAverage,
    highestMonth: { monthName: highest.monthName, price: highest.averageRSP },
    lowestMonth: { monthName: lowest.monthName, price: lowest.averageRSP },
    totalRecordedDays: totalDays,
  };
}
