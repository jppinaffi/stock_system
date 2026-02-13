import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Building2, Plus, Edit, Power, MapPin } from 'lucide-react';
import { mockBranches } from '../data/mockData';
import type { Branch } from '../types';

export function BranchesView() {
  const [branches, setBranches] = useState(mockBranches);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBranch) {
      // Edit existing branch
      setBranches(branches.map(b => 
        b.id === editingBranch.id 
          ? { ...b, ...formData }
          : b
      ));
    } else {
      // Add new branch
      const newBranch: Branch = {
        id: `branch-${Date.now()}`,
        ...formData,
        active: true,
        createdAt: new Date(),
      };
      setBranches([...branches, newBranch]);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      code: branch.code,
      address: branch.address,
    });
    setIsDialogOpen(true);
  };

  const handleToggleStatus = (branchId: string) => {
    setBranches(branches.map(b =>
      b.id === branchId ? { ...b, active: !b.active } : b
    ));
  };

  const resetForm = () => {
    setEditingBranch(null);
    setFormData({
      name: '',
      code: '',
      address: '',
    });
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Filiais</h1>
          <p className="text-gray-600">Cadastro e gerenciamento de unidades operacionais</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Nova Filial
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBranch ? 'Editar Filial' : 'Nova Filial'}</DialogTitle>
              <DialogDescription>
                {editingBranch ? 'Atualize as informações da filial' : 'Cadastre uma nova unidade operacional'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Filial</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Filial São Paulo"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="code">Código</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ex: SP-001"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ex: Av. Paulista, 1000 - São Paulo/SP"
                  required
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingBranch ? 'Salvar Alterações' : 'Cadastrar Filial'}
                </Button>
                <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <Card key={branch.id} className={!branch.active ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${branch.active ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <Building2 className={`size-5 ${branch.active ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{branch.name}</CardTitle>
                    <CardDescription className="mt-1">{branch.code}</CardDescription>
                  </div>
                </div>
                <Badge variant={branch.active ? 'default' : 'secondary'}>
                  {branch.active ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                  <span>{branch.address}</span>
                </div>
                
                <div className="text-xs text-gray-500">
                  Criada em: {new Date(branch.createdAt).toLocaleDateString('pt-BR')}
                </div>
                
                <div className="flex gap-2 pt-3 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEdit(branch)}
                  >
                    <Edit className="size-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant={branch.active ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => handleToggleStatus(branch.id)}
                  >
                    <Power className="size-4 mr-1" />
                    {branch.active ? 'Desativar' : 'Ativar'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {branches.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="size-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma filial cadastrada</h3>
            <p className="text-gray-600 mb-4">Comece criando sua primeira unidade operacional</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
