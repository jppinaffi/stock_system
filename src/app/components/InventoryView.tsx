import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Archive, Package, TrendingDown, AlertCircle } from 'lucide-react';
import { mockInventory, mockProducts } from '../data/mockData';
import type { User } from '../types';

interface InventoryViewProps {
  currentUser: User;
}

export function InventoryView({ currentUser }: InventoryViewProps) {
  const branchId = currentUser.branchId!;
  const inventory = mockInventory.filter(inv => inv.branchId === branchId);
  
  const totalItems = inventory.reduce((sum, inv) => sum + inv.quantity, 0);
  const totalValue = inventory.reduce((sum, inv) => sum + (inv.quantity * inv.unitPrice), 0);
  const lowStockItems = inventory.filter(inv => inv.quantity < 20);
  
  const getCategoryColor = (category: string) => {
    const colors = {
      alimento: 'bg-green-100 text-green-700',
      medicamento: 'bg-red-100 text-red-700',
      enxoval: 'bg-blue-100 text-blue-700',
      outro: 'bg-gray-100 text-gray-700',
    };
    return colors[category as keyof typeof colors] || colors.outro;
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventário Local</h1>
        <p className="text-gray-600">Visualização em tempo real do estoque disponível</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
            <Package className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-gray-600 mt-1">Unidades em estoque</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Archive className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {totalValue.toFixed(2)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Capital imobilizado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertCircle className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
            <p className="text-xs text-gray-600 mt-1">Itens precisam reposição</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {inventory.map((inv) => {
          const product = mockProducts.find(p => p.id === inv.productId);
          const itemValue = inv.quantity * inv.unitPrice;
          const isLowStock = inv.quantity < 20;
          
          return (
            <Card key={inv.id} className={isLowStock ? 'border-orange-300' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product?.name}</CardTitle>
                    <CardDescription className="mt-1">{product?.description}</CardDescription>
                  </div>
                  <Badge className={getCategoryColor(product?.category || 'outro')}>
                    {product?.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLowStock && (
                    <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                      <AlertCircle className="size-4" />
                      <span>Estoque baixo - solicite reposição</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Quantidade Disponível</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {inv.quantity} {product?.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Valor Unitário</p>
                      <p className="text-xl font-medium">
                        R$ {inv.unitPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Valor Total em Estoque:</span>
                      <span className="text-lg font-bold text-green-600">
                        R$ {itemValue.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <TrendingDown className="size-3" />
                    Última atualização: {new Date(inv.lastUpdated).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {inventory.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Archive className="size-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item em estoque</h3>
            <p className="text-gray-600">Solicite itens à Central para começar</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
