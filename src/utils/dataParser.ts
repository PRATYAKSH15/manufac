import { NormalizedFuelRecord } from '../types/fuel';

/**
 * Fast zero-dependency CSV parser tailored for the RSP fuel price dataset.
 * Supports both standard normalized CSVs (Date, City, Fuel_Type, RSP) and raw NDAP metro.csv
 * format (Calendar Day, Metro Cities, Products, Retail Selling Price...).
 */
export function parseFuelCSV(csvText: string): NormalizedFuelRecord[] {
  if (!csvText || !csvText.trim()) {
    return [];
  }

  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length <= 1) {
    return [];
  }

  // Parse header line to dynamically locate column indices
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine).map((h) => h.trim().toLowerCase());

  const dateIdx = headers.findIndex(
    (h) => h === 'date' || h === 'calendar day' || h.includes('day')
  );
  const cityIdx = headers.findIndex(
    (h) => h === 'city' || h === 'metro cities' || h.includes('city') || h.includes('cities')
  );
  const fuelTypeIdx = headers.findIndex(
    (h) =>
      h === 'fuel_type' ||
      h === 'fuel type' ||
      h === 'fueltype' ||
      h.includes('product') ||
      h.includes('products')
  );
  const rspIdx = headers.findIndex(
    (h) => h === 'rsp' || h.includes('retail selling price') || h.includes('price')
  );

  // Fallback indices if headers match standard positions
  const actualDateIdx = dateIdx !== -1 ? dateIdx : 0;
  const actualCityIdx = cityIdx !== -1 ? cityIdx : 1;
  const actualFuelTypeIdx = fuelTypeIdx !== -1 ? fuelTypeIdx : 2;
  const actualRspIdx = rspIdx !== -1 ? rspIdx : 3;

  const records: NormalizedFuelRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = parseCSVLine(line);
    const rawDate = cols[actualDateIdx]?.trim() || '';
    const rawCity = cols[actualCityIdx]?.trim() || '';
    const rawFuelType = cols[actualFuelTypeIdx]?.trim() || '';
    const rawRSP = cols[actualRspIdx]?.trim();

    if (!rawDate || !rawCity || !rawFuelType) {
      continue;
    }

    // Treat missing/empty/null/NaN values as 0 per assignment specification
    let rspValue = 0;
    if (rawRSP !== undefined && rawRSP !== null && rawRSP !== '') {
      const parsedVal = parseFloat(rawRSP);
      rspValue = isNaN(parsedVal) ? 0 : parsedVal;
    }

    // Parse date (expected format YYYY-MM-DD)
    const dateObj = new Date(rawDate);
    if (isNaN(dateObj.getTime())) {
      continue;
    }

    const year = dateObj.getFullYear();
    const monthIndex = dateObj.getMonth(); // 0 = Jan, 11 = Dec

    records.push({
      date: rawDate,
      city: rawCity,
      fuelType: rawFuelType,
      year,
      monthIndex,
      rsp: rspValue,
    });
  }

  return records;
}

/**
 * Utility to split CSV line handling optional quotes safely.
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
