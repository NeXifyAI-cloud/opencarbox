import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/konto');
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#1e3a5f]">Anmelden</CardTitle>
            <CardDescription>
              Melden Sie sich in Ihrem Carvatoo-Konto an
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-Mail-Adresse</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ihre@email.at"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-600">Angemeldet bleiben</span>
                </label>
                <Link to="/passwort-vergessen" className="text-[#4fd1c5] hover:underline">
                  Passwort vergessen?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1e3a5f] hover:bg-[#2d4a6f]"
                disabled={loading}
              >
                {loading ? 'Wird angemeldet...' : 'Anmelden'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Noch kein Konto? </span>
              <Link to="/registrieren" className="text-[#4fd1c5] hover:underline font-medium">
                Jetzt registrieren
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
