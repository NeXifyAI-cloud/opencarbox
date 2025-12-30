import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { ArrowLeft, Save, Loader, Trash2, Plus } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminProductEdit = () => {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    brand: '',
    description: '',
    price: 0,
    original_price: 0,
    stock: 0,
    is_active: true,
    images: [],
    category_id: ''
  });
  
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setFormData({
        ...response.data,
        original_price: response.data.original_price || 0,
        images: response.data.images || []
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Produkt konnte nicht geladen werden.",
      });
      navigate('/admin/produkte');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSwitchChange = (checked) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  const handleAddImage = () => {
    if (imageUrl) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (isNew) {
        await axios.post(`${API}/products`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast({ title: "Erstellt", description: "Produkt erfolgreich angelegt." });
      } else {
        await axios.put(`${API}/products/${id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast({ title: "Gespeichert", description: "Änderungen erfolgreich gespeichert." });
      }
      navigate('/admin/produkte');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: error.response?.data?.detail || "Speichern fehlgeschlagen.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-[#1e3a5f]" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin/produkte')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Zurück
          </Button>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">
            {isNew ? 'Neues Produkt anlegen' : 'Produkt bearbeiten'}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Basisdaten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Produktname</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">Artikelnummer (SKU)</Label>
                  <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marke / Hersteller</Label>
                  <Input id="brand" name="brand" value={formData.brand} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category_id">Kategorie ID</Label>
                  <Input id="category_id" name="category_id" value={formData.category_id || ''} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Preis (€)</Label>
                  <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="original_price">Streichpreis (€)</Label>
                  <Input id="original_price" name="original_price" type="number" step="0.01" value={formData.original_price} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Lagerbestand</Label>
                  <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch id="is_active" checked={formData.is_active} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="is_active">Produkt ist aktiv und im Shop sichtbar</Label>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <Label>Bilder</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Bild-URL eingeben..." 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)} 
                  />
                  <Button type="button" onClick={handleAddImage} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-2">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group border rounded-lg overflow-hidden h-24">
                      <img src={img} alt={`Produktbild ${index}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button type="submit" className="bg-[#1e3a5f] hover:bg-[#2d4a6f]" disabled={saving}>
                  {saving && <Loader className="h-4 w-4 mr-2 animate-spin" />}
                  {isNew ? 'Erstellen' : 'Speichern'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminProductEdit;
