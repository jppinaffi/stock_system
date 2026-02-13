import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  Package, 
  TrendingDown, 
  AlertCircle,
  DollarSign,
  Archive,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { mockInventory, mockConsumptions, mockOrders, mockProducts, mockBranches } from '../data/mockData';
import type { User } from '../types';

interface DashboardBranchProps {
  currentUser: User;
}

export function DashboardBranch({ currentUser }: DashboardBranchProps) {
  const branchId = currentUser.branchId!;
  const branch = mockBranches.find(b => b.id === branchId);
  
  const branchInventory = mockInventory.filter(inv => inv.branchId === branchId);
  const branchConsumptions = mockConsumptions.filter(c => c.branchId === branchId);
  const branchOrders = mockOrders.filter(o => o.branchId === branchId);

  const totalItems = branchInventory.reduce((sum, inv) => sum + inv.quantity, 0);
  const totalValue = branchInventory.reduce((sum, inv) => sum + (inv.quantity * inv.unitPrice), 0);
  const todayConsumptions = branchConsumptions.filter(c => {
    const consumedDate = new Date(c.consumedAt);
    const today = new Date();
    return consumedDate.toDateString() === today.toDateString();
  }).length;
  
  const pendingOrders = branchOrders.filter(o => o.status === 'pendente').length;
  const lowStockItems = branchInventory.filter(inv => inv.quantity < 20);

  const recentConsumptions = branchConsumptions.slice(-5).reverse();

  const ordersByStatus = {
    pendente: branchOrders.filter(o => o.status === 'pendente').length,
    aprovado: branchOrders.filter(o => o.status === 'aprovado').length,
    rejeitado: branchOrders.filter(o => o.status === 'rejeitado').length,
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard - {branch?.name}</h1>
        <p className="text-gray-600">Visão geral do estoque e operações da filial</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens em Estoque</CardTitle>
            <Package className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-gray-600 mt-1">Unidades disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor do Estoque</CardTitle>
            <DollarSign className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalValue.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">Capital imobilizado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consumos Hoje</CardTitle>
            <TrendingDown className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayConsumptions}</div>
            <p className="text-xs text-gray-600 mt-1">Registros de saída</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
            <AlertCircle className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingOrders}</div>
            <p className="text-xs text-gray-600 mt-1">Aguardando aprovação</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
            <Clock className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{ordersByStatus.pendente}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Aprovados</CardTitle>
            <CheckCircle className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{ordersByStatus.aprovado}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Rejeitados</CardTitle>
            <XCircle className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{ordersByStatus.rejeitado}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Consumos Recentes</CardTitle>
            <CardDescription>Últimas saídas registradas</CardDescription>
          </CardHeader>
          <CardContent>
            {recentConsumptions.length === 0 ? (
              <p className="text-sm text-gray-600">Nenhum consumo registrado</p>
            ) : (
              <div className="space-y-4">
                {recentConsumptions.map((consumption) => {
                  const product = mockProducts.find(p => p.id === consumption.productId);
                  return (
                    <div key={consumption.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                      <div>
                        <p className="font-medium text-sm">{product?.name}</p>
                        <p className="text-xs text-gray-600">
                          {consumption.consumedBy} - {new Date(consumption.consumedAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{consumption.quantity} {product?.unit}</p>
                        <p className="text-xs text-gray-600">R$ {consumption.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="size-5 text-orange-600" />
              Itens com Estoque Baixo
            </CardTitle>
            <CardDescription>Produtos que precisam de reposição</CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockItems.length === 0 ? (
              <p className="text-sm text-gray-600">Todos os itens com estoque adequado</p>
            ) : (
              <div className="space-y-4">
                {lowStockItems.map((inv) => {
                  const product = mockProducts.find(p => p.id === inv.productId);
                  return (
                    <div key={inv.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                      <div>
                        <p className="font-medium text-sm">{product?.name}</p>
                        <p className="text-xs text-gray-600">Código: {product?.barcode || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm text-orange-600">{inv.quantity} {product?.unit}</p>
                        <p className="text-xs text-gray-600">Estoque atual</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Inventory Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="size-5 text-blue-600" />
            Visão Geral do Inventário
          </CardTitle>
          <CardDescription>Produtos disponíveis na filial</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {branchInventory.map((inv) => {
              const product = mockProducts.find(p => p.id === inv.productId);
              const itemValue = inv.quantity * inv.unitPrice;
              
              return (
                <div key={inv.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{product?.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{product?.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-600">
                        Categoria: <span className="font-medium">{product?.category}</span>
                      </span>
                      {product?.barcode && (
                        <span className="text-xs text-gray-600">
                          Código: <span className="font-medium">{product.barcode}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{inv.quantity} {product?.unit}</p>
                    <p className="text-sm text-gray-600">R$ {inv.unitPrice.toFixed(2)}/{product?.unit}</p>
                    <p className="text-xs text-gray-500 mt-1">Valor total: R$ {itemValue.toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
