import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Users, Plus, Edit, Power, Shield, Building2 } from 'lucide-react';
import { mockUsers, mockBranches } from '../data/mockData';
import type { User, UserRole } from '../types';

export function UsersView() {
  const [users, setUsers] = useState(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    role: 'branch_operator' as UserRole,
    branchId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...formData, branchId: formData.role === 'branch_operator' ? formData.branchId : undefined }
          : u
      ));
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        ...formData,
        branchId: formData.role === 'branch_operator' ? formData.branchId : undefined,
        active: true,
        createdAt: new Date(),
      };
      setUsers([...users, newUser]);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      role: user.role,
      branchId: user.branchId || '',
    });
    setIsDialogOpen(true);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, active: !u.active } : u
    ));
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      cpf: '',
      role: 'branch_operator',
      branchId: '',
    });
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const getRoleName = (role: UserRole) => {
    const roles = {
      admin: 'Administrador',
      branch_operator: 'Operador Filial',
    };
    return roles[role];
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-700',
      branch_operator: 'bg-green-100 text-green-700',
    };
    return colors[role];
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Usuários</h1>
          <p className="text-gray-600">Controle de acesso e permissões (RBAC)</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
              <DialogDescription>
                {editingUser ? 'Atualize as informações do usuário' : 'Cadastre um novo usuário no sistema'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: João Silva"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="joao@exemplo.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Perfil de Acesso</Label>
                <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="branch_operator">Operador Filial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.role === 'branch_operator' && (
                <div className="space-y-2">
                  <Label htmlFor="branch">Filial</Label>
                  <Select value={formData.branchId} onValueChange={(value) => setFormData({ ...formData, branchId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma filial" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockBranches.filter(b => b.active).map(branch => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name} ({branch.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingUser ? 'Salvar Alterações' : 'Cadastrar Usuário'}
                </Button>
                <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            Usuários Cadastrados
          </CardTitle>
          <CardDescription>Lista completa de usuários do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Filial</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const branch = mockBranches.find(b => b.id === user.branchId);
                
                return (
                  <TableRow key={user.id} className={!user.active ? 'opacity-60' : ''}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.cpf}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        <Shield className="size-3 mr-1" />
                        {getRoleName(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {branch ? (
                        <span className="text-sm flex items-center gap-1">
                          <Building2 className="size-3" />
                          {branch.name}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.active ? 'default' : 'secondary'}>
                        {user.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="size-4 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          variant={user.active ? 'outline' : 'default'}
                          size="sm"
                          onClick={() => handleToggleStatus(user.id)}
                        >
                          <Power className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}