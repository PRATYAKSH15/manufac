export interface RawFuelRecord {
  Date: string;
  City: string;
  Fuel_Type: string;
  RSP: string | number;
}

export interface NormalizedFuelRecord {
  date: string;       // YYYY-MM-DD
  city: string;       // e.g. "Delhi", "Mumbai"
  fuelType: string;   // e.g. "Petrol", "Diesel"
  year: number;       // e.g. 2024
  monthIndex: number; // 0 to 11 (0 = Jan, 11 = Dec)
  rsp: number;        // Retail Selling Price (0 if missing/null)
}

export interface FilterState {
  city: string | null;
  fuelType: string | null;
  year: string | null;
}

export interface MonthlyAggregationResult {
  monthName: string;
  shortMonthName: string;
  averageRSP: number;
  recordCount: number;
  totalRSP: number;
}

export interface KpiSummary {
  yearlyAverage: number;
  highestMonth: { monthName: string; price: number };
  lowestMonth: { monthName: string; price: number };
  totalRecordedDays: number;
}

/**
 * Pre-indexed nested HashMap structure for ultra-fast O(1) query lookups:
 * City -> FuelType -> Year -> MonthIndex (0..11) -> RSP Values Array
 */
export type IndexedDataset = Record<
  string, // City
  Record<
    string, // Fuel Type
    Record<
      number, // Year
      Record<number, number[]> // Month Index -> Array of RSP prices
    >
  >
>;
