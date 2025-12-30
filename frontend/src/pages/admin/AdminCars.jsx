import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Car, Plus, Edit, Trash2, Loader } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminCars = () => {
  const { token } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get(`${API}/vehicles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Fahrzeug wirklich löschen?')) {
      try {
        await axios.delete(`${API}/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCars();
      } catch (error) {
        console.error("Error deleting vehicle:", error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">Fahrzeugbestand</h1>
            <p className="text-gray-500">Verwalten Sie Ihre Verkaufsfahrzeuge</p>
          </div>
          <Button className="bg-[#4fd1c5] hover:bg-[#38b2ac] text-[#1e3a5f] flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Fahrzeug hinzufügen
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Aktueller Bestand ({cars.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader className="h-8 w-8 animate-spin text-[#1e3a5f]" />
              </div>
            ) : cars.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Keine Fahrzeuge im Bestand.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fahrzeug</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Preis</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={car.image || 'https://via.placeholder.com/50'} 
                            alt={`${car.brand} ${car.model}`}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{car.brand} {car.model}</p>
                            <p className="text-xs text-gray-500">{car.variant || 'Standard'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          <p>{car.year} • {car.mileage?.toLocaleString()} km</p>
                          <p>{car.fuel} • {car.transmission}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">
                        {car.price?.toLocaleString('de-DE')} €
                      </TableCell>
                      <TableCell>
                        {car.isNew ? (
                          <Badge className="bg-blue-500">Neuwagen</Badge>
                        ) : (
                          <Badge className="bg-gray-500">Gebraucht</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 hover:text-red-500"
                            onClick={() => handleDelete(car.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCars;
