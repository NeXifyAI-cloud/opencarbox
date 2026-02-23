/**
 * Hilfsfunktionen für die Fahrzeugsuche via HSN/TSN.
 * In einer Produktionsumgebung würde hier eine API (z.B. TecDoc) abgefragt werden.
 */

export interface VehicleInfo {
  hsn: string;
  tsn: string;
  brand: string;
  model: string;
  year: string;
}

// Mock-Daten für die Entwicklung
const MOCK_VEHICLES: VehicleInfo[] = [
  { hsn: '0603', tsn: 'ADO', brand: 'VW', model: 'Golf VII', year: '2012-2020' },
  { hsn: '0603', tsn: 'BEY', brand: 'VW', model: 'Passat B8', year: '2014-2023' },
  { hsn: '0005', tsn: 'BVP', brand: 'BMW', model: '3er (F30)', year: '2011-2019' },
  { hsn: '1313', tsn: 'BHY', brand: 'Mercedes', model: 'C-Klasse (W205)', year: '2014-2021' },
];

export async function lookupVehicleByHsnTsn(hsn: string, tsn: string): Promise<VehicleInfo | null> {
  // Simuliere Netzwerkverzögerung
  await new Promise((resolve) => setTimeout(resolve, 500));

  const vehicle = MOCK_VEHICLES.find(
    (v) => v.hsn === hsn && v.tsn.toUpperCase() === tsn.toUpperCase()
  );

  return vehicle || null;
}
