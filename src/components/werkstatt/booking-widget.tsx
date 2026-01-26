'use client';

import { useState } from 'react';
import { Calendar, Clock, User, Wrench, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BookingWidgetProps {
  serviceId?: string;
  serviceName?: string;
}

/**
 * BookingWidget Organismus-Komponente für schnelle Terminbuchung.
 * Vereinfachter Buchungsprozess mit Kalender-Integration.
 */
export function BookingWidget({ serviceId, serviceName }: BookingWidgetProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const availableTimes = [
    '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
  ];

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !customerName || !customerPhone) return;

    setIsBooking(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsBooking(false);
    setIsBooked(true);
  };

  if (isBooked) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-green-900 mb-2">Termin gebucht!</h3>
        <p className="text-green-700 mb-4">
          Vielen Dank für Ihre Buchung. Sie erhalten eine Bestätigung per SMS.
        </p>
        <Button
          onClick={() => {
            setIsBooked(false);
            setSelectedDate('');
            setSelectedTime('');
            setCustomerName('');
            setCustomerPhone('');
          }}
          variant="outline"
          className="border-green-300 text-green-700 hover:bg-green-100"
        >
          Neue Buchung
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-opencarbox-500 text-white flex items-center justify-center">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Termin buchen</h3>
          <p className="text-sm text-slate-500">
            {serviceName || 'Schnelltermin vereinbaren'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Wunschdatum
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opencarbox-500 focus:border-transparent"
          />
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Uhrzeit
            </label>
            <div className="grid grid-cols-4 gap-2">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={cn(
                    'px-3 py-2 text-sm border rounded-lg transition-all',
                    selectedTime === time
                      ? 'border-opencarbox-500 bg-opencarbox-50 text-opencarbox-700'
                      : 'border-slate-300 hover:border-opencarbox-300'
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Customer Details */}
        {selectedTime && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ihr vollständiger Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opencarbox-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+43 123 456789"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opencarbox-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Book Button */}
        <Button
          onClick={handleBooking}
          disabled={!selectedDate || !selectedTime || !customerName || !customerPhone || isBooking}
          className="w-full bg-opencarbox-500 hover:bg-opencarbox-600 text-white py-3"
        >
          {isBooking ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Termin wird gebucht...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Termin buchen
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}

export default BookingWidget;