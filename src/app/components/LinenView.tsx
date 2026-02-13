import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Bed, Package } from 'lucide-react';
import { mockProducts, mockInventory } from '../data/mockData';
import type { User } from '../types';

interface LinenViewProps {
  currentUser: User;
}

export function LinenView({ currentUser }: LinenViewProps) {
  const isCentral = currentUser.role === 'admin';
  const branchId = currentUser.branchId;
  
  const linenProducts = mockProducts.filter(p => p.category === 'enxoval');
  const linenInventory = mockInventory.filter(inv => {
    const product = mockProducts.find(p => p.id === inv.productId);
    return product?.category === 'enxoval' && (isCentral || inv.branchId === branchId);
  });
  
  const totalItems = linenInventory.reduce((sum, inv) => sum + inv.quantity, 0);
  const totalValue = linenInventory.reduce((sum, inv) => sum + (inv.quantity * inv.unitPrice), 0);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Enxoval</h1>
        <p className="text-gray-600">Controle de itens sem código de barras (registro manual)</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens de Enxoval</CardTitle>
            <Bed className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-gray-600 mt-1">Unidades disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Package className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">R$ {totalValue.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">Capital em enxoval</p>
          </CardContent>
        </Card>
      </div>

      {/* Linen Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed className="size-5" />
            Produtos de Enxoval
          </CardTitle>
          <CardDescription>Itens cadastrados no catálogo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {linenProducts.map((product) => {
              const inventory = linenInventory.find(inv => inv.productId === product.id);
              
              return (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">
                      enxoval
                    </Badge>
                  </div>
                  
                  {inventory ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Quantidade:</span>
                        <span className="font-medium">{inventory.quantity} {product.unit}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Valor Unit.:</span>
                        <span className="font-medium">R$ {inventory.unitPrice.toFixed(2)}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total:</span>
                          <span className="font-bold text-blue-600">
                            R$ {(inventory.quantity * inventory.unitPrice).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      Sem estoque disponível
                    </div>
                  )}
                  
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Package className="size-3" />
                      Registro manual (sem código de barras)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {linenProducts.length === 0 && (
            <div className="text-center py-12">
              <Bed className="size-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item de enxoval cadastrado</h3>
              <p className="text-gray-600">Cadastre produtos de enxoval no catálogo global</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Bed className="size-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900 mb-1">Sobre o Enxoval</h3>
              <p className="text-sm text-yellow-800">
                Itens de enxoval não possuem código de barras e devem ser registrados manualmente.
                O controle é feito por ID interno do sistema. Garanta a contagem física regular
                para manter a acurácia do inventário.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}