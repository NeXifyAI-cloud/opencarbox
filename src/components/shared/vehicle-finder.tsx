'use client';

import { useState } from 'react';
import { Search, Car, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface VehicleFinderProps {
  onVehicleFound?: (hsnTsn: string, vehicle: any) => void;
}

/**
 * VehicleFinder Organismus-Komponente für HSN/TSN Fahrzeugsuche.
 * Ermöglicht Eingabe von HSN/TSN oder Kennzeichen für Fahrzeugidentifikation.
 */
export function VehicleFinder({ onVehicleFound }: VehicleFinderProps) {
  const [searchType, setSearchType] = useState<'hsn' | 'plate'>('hsn');
  const [hsnValue, setHsnValue] = useState('');
  const [tsnValue, setTsnValue] = useState('');
  const [plateValue, setPlateValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundVehicle, setFoundVehicle] = useState<any>(null);

  const handleSearch = async () => {
    setIsSearching(true);

    // Simulate API search
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock result
    const mockVehicle = {
      make: 'BMW',
      model: '3er Reihe',
      year: 2020,
      engine: '2.0 Diesel',
      hsn: hsnValue,
      tsn: tsnValue,
    };

    setFoundVehicle(mockVehicle);
    onVehicleFound?.(searchType === 'hsn' ? `${hsnValue}/${tsnValue}` : plateValue, mockVehicle);
    setIsSearching(false);
  };

  const resetSearch = () => {
    setHsnValue('');
    setTsnValue('');
    setPlateValue('');
    setFoundVehicle(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-carvantooo-500 text-white flex items-center justify-center">
          <Car className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Fahrzeug finden</h3>
          <p className="text-sm text-slate-500">
            HSN/TSN oder Kennzeichen eingeben
          </p>
        </div>
      </div>

      {!foundVehicle ? (
        <div className="space-y-4">
          {/* Search Type Toggle */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setSearchType('hsn')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                searchType === 'hsn'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Hash className="w-4 h-4 inline mr-2" />
              HSN/TSN
            </button>
            <button
              onClick={() => setSearchType('plate')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                searchType === 'plate'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Car className="w-4 h-4 inline mr-2" />
              Kennzeichen
            </button>
          </div>

          {/* Search Inputs */}
          {searchType === 'hsn' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  HSN
                </label>
                <Input
                  value={hsnValue}
                  onChange={(e) => setHsnValue(e.target.value.toUpperCase())}
                  placeholder="0000"
                  maxLength={4}
                  className="text-center font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  TSN
                </label>
                <Input
                  value={tsnValue}
                  onChange={(e) => setTsnValue(e.target.value.toUpperCase())}
                  placeholder="000"
                  maxLength={3}
                  className="text-center font-mono"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Kennzeichen
              </label>
              <Input
                value={plateValue}
                onChange={(e) => setPlateValue(e.target.value.toUpperCase())}
                placeholder="W-123AB"
                maxLength={10}
                className="text-center font-mono"
              />
            </div>
          )}

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={
              isSearching ||
              (searchType === 'hsn' && (!hsnValue || !tsnValue)) ||
              (searchType === 'plate' && !plateValue)
            }
            className="w-full bg-carvantooo-500 hover:bg-carvantooo-600 text-white py-3"
          >
            {isSearching ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Fahrzeug wird gesucht...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Fahrzeug finden
              </div>
            )}
          </Button>
        </div>
      ) : (
        /* Vehicle Found Result */
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <Search className="w-3 h-3 text-white" />
              </div>
              <span className="font-medium">Fahrzeug gefunden!</span>
            </div>
            <div className="text-sm text-green-800">
              <p className="font-medium">{foundVehicle.make} {foundVehicle.model}</p>
              <p className="text-green-600">Bj. {foundVehicle.year} • {foundVehicle.engine}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => onVehicleFound?.('', foundVehicle)}
              className="flex-1 bg-carvantooo-500 hover:bg-carvantooo-600 text-white"
            >
              Passende Teile finden
            </Button>
            <Button
              onClick={resetSearch}
              variant="outline"
              className="px-4"
            >
              Neu suchen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleFinder;