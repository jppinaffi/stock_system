import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Send, Plus, CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import { mockOrders, mockProducts, mockBranches, mockBranchAuthorizations } from '../data/mockData';
import type { User, Order } from '../types';

interface OrdersViewProps {
  currentUser: User;
}

export function OrdersView({ currentUser }: OrdersViewProps) {
  const isCentral = currentUser.role === 'admin';
  const branchId = currentUser.branchId;
  
  const [orders, setOrders] = useState(
    isCentral ? mockOrders : mockOrders.filter(o => o.branchId === branchId)
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    justification: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const product = mockProducts.find(p => p.id === formData.productId);
    const isAuthorized = mockBranchAuthorizations.find(
      auth => auth.branchId === branchId && auth.productId === formData.productId && auth.authorized
    );
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      branchId: branchId!,
      productId: formData.productId,
      quantity: parseFloat(formData.quantity),
      requestedBy: currentUser.id,
      status: isAuthorized ? 'pendente' : 'pendente',
      justification: formData.justification || undefined,
      createdAt: new Date(),
    };
    
    setOrders([newOrder, ...orders]);
    setIsDialogOpen(false);
    resetForm();
    
    if (!isAuthorized) {
      alert('Atenção: Este item não está homologado para sua filial. O pedido requer aprovação especial.');
    }
  };

  const handleApprove = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId 
        ? { ...o, status: 'aprovado' as const, approvedBy: currentUser.id, approvedAt: new Date() }
        : o
    ));
  };

  const handleReject = (orderId: string) => {
    const justification = prompt('Motivo da rejeição:');
    if (justification) {
      setOrders(orders.map(o => 
        o.id === orderId 
          ? { ...o, status: 'rejeitado' as const, justification }
          : o
      ));
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      quantity: '',
      justification: '',
    });
  };

  const getStatusBadge = (status: Order['status']) => {
    const configs = {
      pendente: { label: 'Pendente', variant: 'secondary' as const, icon: Clock, color: 'text-orange-600' },
      aprovado: { label: 'Aprovado', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      rejeitado: { label: 'Rejeitado', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      enviado: { label: 'Enviado', variant: 'default' as const, icon: Package, color: 'text-blue-600' },
      recebido: { label: 'Recebido', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
    };
    const config = configs[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="size-3" />
        {config.label}
      </Badge>
    );
  };

  const authorizedProducts = mockBranchAuthorizations
    .filter(auth => auth.branchId === branchId && auth.authorized)
    .map(auth => auth.productId);

  const pendingCount = orders.filter(o => o.status === 'pendente').length;
  const approvedCount = orders.filter(o => o.status === 'aprovado').length;
  const rejectedCount = orders.filter(o => o.status === 'rejeitado').length;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isCentral ? 'Gestão de Pedidos' : 'Meus Pedidos'}
          </h1>
          <p className="text-gray-600">
            {isCentral 
              ? 'Aprovação e gerenciamento de solicitações das filiais'
              : 'Solicitação de reposição de itens à Central'
            }
          </p>
        </div>
        
        {!isCentral && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4 mr-2" />
                Novo Pedido
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Pedido à Central</DialogTitle>
                <DialogDescription>
                  Solicite a reposição de itens
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Produto</Label>
                  <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map(product => {
                        const isAuthorized = authorizedProducts.includes(product.id);
                        return (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} {!isAuthorized && '⚠️ Não homologado'}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {formData.productId && !authorizedProducts.includes(formData.productId) && (
                    <p className="text-xs text-orange-600">
                      ⚠️ Este item não está homologado para sua filial. Justificativa obrigatória.
                    </p>
                  )}
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
                </div>
                
                {formData.productId && !authorizedProducts.includes(formData.productId) && (
                  <div className="space-y-2">
                    <Label htmlFor="justification">Justificativa *</Label>
                    <Textarea
                      id="justification"
                      value={formData.justification}
                      onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                      placeholder="Explique por que este item não homologado é necessário"
                      required
                    />
                  </div>
                )}
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Enviar Pedido
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
            <p className="text-xs text-gray-600 mt-1">Aguardando análise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckCircle className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <p className="text-xs text-gray-600 mt-1">Pedidos aprovados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitados</CardTitle>
            <XCircle className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            <p className="text-xs text-gray-600 mt-1">Pedidos rejeitados</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="size-5" />
            Pedidos
          </CardTitle>
          <CardDescription>Lista de solicitações de reposição</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                {isCentral && <TableHead>Filial</TableHead>}
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead>Status</TableHead>
                {isCentral && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const product = mockProducts.find(p => p.id === order.productId);
                const branch = mockBranches.find(b => b.id === order.branchId);
                
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    {isCentral && (
                      <TableCell>
                        <div>
                          <p className="font-medium">{branch?.name}</p>
                          <p className="text-xs text-gray-600">{branch?.code}</p>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <div>
                        <p className="font-medium">{product?.name}</p>
                        {order.justification && (
                          <p className="text-xs text-orange-600">⚠️ Item não homologado</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {order.quantity} {product?.unit}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                      {order.justification && order.status === 'rejeitado' && (
                        <p className="text-xs text-gray-600 mt-1">{order.justification}</p>
                      )}
                    </TableCell>
                    {isCentral && (
                      <TableCell className="text-right">
                        {order.status === 'pendente' && (
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleApprove(order.id)}
                            >
                              <CheckCircle className="size-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleReject(order.id)}
                            >
                              <XCircle className="size-4 mr-1" />
                              Rejeitar
                            </Button>
                          </div>
                        )}
                        {order.status === 'aprovado' && (
                          <span className="text-xs text-gray-600">
                            Aprovado em {order.approvedAt && new Date(order.approvedAt).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {orders.length === 0 && (
            <div className="text-center py-12">
              <Send className="size-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-600">
                {isCentral 
                  ? 'Quando as filiais fizerem pedidos, eles aparecerão aqui'
                  : 'Comece criando seu primeiro pedido à Central'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}