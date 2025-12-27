import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, User, CheckCircle2, XCircle } from 'lucide-react';

const AdminWorkshop = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 'apt-1',
      customer: 'Max Mustermann',
      service: 'Inspektion & Wartung',
      date: '2025-05-15',
      time: '09:00',
      status: 'pending',
      vehicle: 'VW Golf VII'
    },
    {
      id: 'apt-2',
      customer: 'Anna Schmidt',
      service: 'Reifenwechsel',
      date: '2025-05-15',
      time: '10:30',
      status: 'confirmed',
      vehicle: 'Audi A3'
    },
    {
      id: 'apt-3',
      customer: 'Thomas Müller',
      service: 'Ölwechsel',
      date: '2025-05-16',
      time: '14:00',
      status: 'completed',
      vehicle: 'BMW 320d'
    }
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <Badge className="bg-yellow-500">Ausstehend</Badge>;
      case 'confirmed': return <Badge className="bg-blue-500">Bestätigt</Badge>;
      case 'completed': return <Badge className="bg-green-500">Erledigt</Badge>;
      case 'cancelled': return <Badge className="bg-red-500">Storniert</Badge>;
      default: return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const updateStatus = (id, newStatus) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">Werkstatt-Termine</h1>
            <p className="text-gray-500">Verwalten Sie Service-Anfragen und Termine</p>
          </div>
          <Button className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f]">
            Neuer Termin
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Aktuelle Termine</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kunde / Fahrzeug</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Datum & Zeit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{apt.customer}</p>
                          <p className="text-xs text-gray-500">{apt.vehicle}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{apt.service}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(apt.date).toLocaleDateString('de-DE')}</span>
                        <span className="flex items-center gap-1 text-gray-500"><Clock className="h-3 w-3" /> {apt.time} Uhr</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(apt.status)}</TableCell>
                    <TableCell className="text-right">
                      {apt.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700" onClick={() => updateStatus(apt.id, 'confirmed')}>
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => updateStatus(apt.id, 'cancelled')}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminWorkshop;
