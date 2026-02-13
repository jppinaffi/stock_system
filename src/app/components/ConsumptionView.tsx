import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { FileText, Plus, Barcode, User, Calendar } from 'lucide-react';
import { mockConsumptions, mockProducts, mockInventory } from '../data/mockData';
import type { User as UserType, Consumption } from '../types';

interface ConsumptionViewProps {
  currentUser: UserType;
}

export function ConsumptionView({ currentUser }: ConsumptionViewProps) {
  const branchId = currentUser.branchId!;
  const [consumptions, setConsumptions] = useState(mockConsumptions.filter(c => c.branchId === branchId));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    consumedBy: '',
    consumedByCPF: '',
  });

  const availableInventory = mockInventory.filter(inv => inv.branchId === branchId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const quantity = parseFloat(formData.quantity);
    const inventory = availableInventory.find(inv => inv.productId === formData.productId);
    
    if (!inventory || inventory.quantity < quantity) {
      alert('Estoque insuficiente!');
      return;
    }
    
    const newConsumption: Consumption = {
      id: `cons-${Date.now()}`,
      productId: formData.productId,
      branchId,
      quantity,
      consumedBy: formData.consumedBy,
      consumedByCPF: formData.consumedByCPF,
      consumedAt: new Date(),
      unitPrice: inventory.unitPrice,
      totalPrice: quantity * inventory.unitPrice,
    };
    
    setConsumptions([newConsumption, ...consumptions]);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleScanBarcode = () => {
    // Simulate barcode scanner
    const mockBarcode = '7891234567890';
    const product = mockProducts.find(p => p.barcode === mockBarcode);
    const inStock = availableInventory.find(inv => inv.productId === product?.id);
    
    if (product && inStock) {
      setFormData({ ...formData, productId: product.id });
      alert(`Produto encontrado: ${product.name}\nEstoque disponível: ${inStock.quantity} ${product.unit}`);
    } else {
      alert('Produto não disponível no estoque');
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      quantity: '',
      consumedBy: '',
      consumedByCPF: '',
    });
  };

  const todayConsumptions = consumptions.filter(c => {
    const consumedDate = new Date(c.consumedAt);
    const today = new Date();
    return consumedDate.toDateString() === today.toDateString();
  });

  const totalConsumedValue = consumptions.reduce((sum, c) => sum + c.totalPrice, 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registro de Consumo</h1>
          <p className="text-gray-600">Check-out de itens com rastreamento por colaborador</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Registrar Consumo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Novo Consumo</DialogTitle>
              <DialogDescription>
                Registre a saída de itens com identificação do colaborador
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Produto</Label>
                <div className="flex gap-2">
                  <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableInventory.map(inv => {
                        const product = mockProducts.find(p => p.id === inv.productId);
                        return (
                          <SelectItem key={inv.id} value={inv.productId}>
                            {product?.name} - Disponível: {inv.quantity} {product?.unit}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" onClick={handleScanBarcode}>
                    <Barcode className="size-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                  required
                />
                {formData.productId && (
                  <p className="text-xs text-gray-600">
                    Estoque disponível: {availableInventory.find(inv => inv.productId === formData.productId)?.quantity}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="consumedBy">Nome do Colaborador</Label>
                <Input
                  id="consumedBy"
                  value={formData.consumedBy}
                  onChange={(e) => setFormData({ ...formData, consumedBy: e.target.value })}
                  placeholder="Nome completo"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="consumedByCPF">CPF do Colaborador</Label>
                <Input
                  id="consumedByCPF"
                  value={formData.consumedByCPF}
                  onChange={(e) => setFormData({ ...formData, consumedByCPF: e.target.value })}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  Registrar Consumo
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consumos Hoje</CardTitle>
            <Calendar className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayConsumptions.length}</div>
            <p className="text-xs text-gray-600 mt-1">Registros do dia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Consumos</CardTitle>
            <FileText className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consumptions.length}</div>
            <p className="text-xs text-gray-600 mt-1">Registros históricos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Consumido</CardTitle>
            <FileText className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalConsumedValue.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">Capital em consumo</p>
          </CardContent>
        </Card>
      </div>

      {/* Consumptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Consumo</CardTitle>
          <CardDescription>Rastreamento completo de saídas por colaborador</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Consumido Por</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consumptions.map((consumption) => {
                const product = mockProducts.find(p => p.id === consumption.productId);
                
                return (
                  <TableRow key={consumption.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {new Date(consumption.consumedAt).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(consumption.consumedAt).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product?.name}</p>
                        <p className="text-xs text-gray-600">
                          {product?.category}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-gray-400" />
                        <span className="font-medium">{consumption.consumedBy}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {consumption.consumedByCPF}
                    </TableCell>
                    <TableCell className="text-right">
                      {consumption.quantity} {product?.unit}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium text-blue-600">
                        R$ {consumption.totalPrice.toFixed(2)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {consumptions.length === 0 && (
            <div className="text-center py-12">
              <FileText className="size-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum consumo registrado</h3>
              <p className="text-gray-600">Comece registrando a primeira saída de produtos</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
