import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { mockUsers, setCurrentUser } from '../data/mockData';
import type { User } from '../types';
import { Building2, Lock, User as UserIcon } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock authentication - in production this would call a real API
    const user = mockUsers.find(u => u.email === email && u.active);
    
    if (user) {
      setCurrentUser(user);
      onLogin(user);
    } else {
      setError('Email ou senha inválidos');
    }
  };

  const handleQuickLogin = (userEmail: string) => {
    const user = mockUsers.find(u => u.email === userEmail);
    if (user) {
      setCurrentUser(user);
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-4 rounded-full">
              <Building2 className="size-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Suprimentos</h1>
          <p className="text-gray-600">Controle centralizado de gestão de ativos</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acesso ao Sistema</CardTitle>
            <CardDescription>Entre com suas credenciais para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full">
                <Lock className="size-4 mr-2" />
                Entrar
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-3">Acesso rápido (demo):</p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickLogin('admin@sistema.com')}
                >
                  <UserIcon className="size-4 mr-2" />
                  Admin Geral (Central)
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickLogin('joao@filial1.com')}
                >
                  <UserIcon className="size-4 mr-2" />
                  João Silva (Filial SP)
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickLogin('maria@filial2.com')}
                >
                  <UserIcon className="size-4 mr-2" />
                  Maria Santos (Filial RJ)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}