import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  Building2, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  AlertCircle,
  DollarSign,
  Archive
} from 'lucide-react';
import { mockBranches, mockProducts, mockPurchases, mockInventory, mockOrders } from '../data/mockData';

export function DashboardCentral() {
  const totalBranches = mockBranches.filter(b => b.active).length;
  const totalProducts = mockProducts.length;
  const totalPurchases = mockPurchases.length;
  const pendingOrders = mockOrders.filter(o => o.status === 'pendente').length;

  const totalPurchaseValue = mockPurchases.reduce((sum, p) => sum + p.totalPrice, 0);
  const totalInventoryValue = mockInventory.reduce((sum, inv) => {
    return sum + (inv.quantity * inv.unitPrice);
  }, 0);

  const recentPurchases = mockPurchases.slice(-5).reverse();
  const lowStockItems = mockInventory.filter(inv => inv.quantity < 20);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Central</h1>
        <p className="text-gray-600">Visão geral do sistema de gestão de suprimentos</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filiais Ativas</CardTitle>
            <Building2 className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBranches}</div>
            <p className="text-xs text-gray-600 mt-1">Unidades operacionais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Cadastrados</CardTitle>
            <Package className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-gray-600 mt-1">Itens no catálogo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compras Realizadas</CardTitle>
            <ShoppingCart className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPurchases}</div>
            <p className="text-xs text-green-600 mt-1">
              <TrendingUp className="size-3 inline mr-1" />
              R$ {totalPurchaseValue.toFixed(2)}
            </p>
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

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="size-5 text-green-600" />
              Valor Total em Compras
            </CardTitle>
            <CardDescription>Capital investido em aquisições</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              R$ {totalPurchaseValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="size-5 text-blue-600" />
              Valor Total em Estoque
            </CardTitle>
            <CardDescription>Capital imobilizado nas filiais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              R$ {totalInventoryValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compras Recentes</CardTitle>
            <CardDescription>Últimas aquisições registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPurchases.map((purchase) => {
                const product = mockProducts.find(p => p.id === purchase.productId);
                return (
                  <div key={purchase.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{product?.name}</p>
                      <p className="text-xs text-gray-600">
                        {purchase.quantity} {product?.unit} - {new Date(purchase.purchaseDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">R$ {purchase.totalPrice.toFixed(2)}</p>
                      <p className="text-xs text-gray-600">R$ {purchase.unitPrice.toFixed(2)}/{product?.unit}</p>
                    </div>
                  </div>
                );
              })}
            </div>
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
              <p className="text-sm text-gray-600">Nenhum item com estoque baixo</p>
            ) : (
              <div className="space-y-4">
                {lowStockItems.slice(0, 5).map((inv) => {
                  const product = mockProducts.find(p => p.id === inv.productId);
                  const branch = mockBranches.find(b => b.id === inv.branchId);
                  return (
                    <div key={inv.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                      <div>
                        <p className="font-medium text-sm">{product?.name}</p>
                        <p className="text-xs text-gray-600">{branch?.name}</p>
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

      {/* Active Branches */}
      <Card>
        <CardHeader>
          <CardTitle>Filiais Ativas</CardTitle>
          <CardDescription>Unidades operacionais do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockBranches.filter(b => b.active).map((branch) => {
              const branchInventory = mockInventory.filter(inv => inv.branchId === branch.id);
              const branchValue = branchInventory.reduce((sum, inv) => sum + (inv.quantity * inv.unitPrice), 0);
              
              return (
                <div key={branch.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Building2 className="size-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{branch.name}</h3>
                      <p className="text-xs text-gray-600">{branch.code}</p>
                      <p className="text-xs text-gray-500 mt-1">{branch.address}</p>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-600">Estoque:</p>
                        <p className="text-sm font-medium text-blue-600">
                          R$ {branchValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
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
