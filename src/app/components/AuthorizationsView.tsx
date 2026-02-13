import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { CheckSquare, CheckCircle, XCircle, Building2 } from 'lucide-react';
import { mockBranchAuthorizations, mockBranches, mockProducts } from '../data/mockData';
import type { BranchAuthorization } from '../types';

export function AuthorizationsView() {
  const [selectedBranch, setSelectedBranch] = useState<string>(mockBranches[0]?.id || '');
  const [authorizations, setAuthorizations] = useState(mockBranchAuthorizations);

  const handleToggleAuthorization = (productId: string) => {
    const existing = authorizations.find(
      auth => auth.branchId === selectedBranch && auth.productId === productId
    );

    if (existing) {
      setAuthorizations(authorizations.map(auth =>
        auth.id === existing.id
          ? { ...auth, authorized: !auth.authorized, authorizedAt: new Date() }
          : auth
      ));
    } else {
      const newAuth: BranchAuthorization = {
        id: `auth-${Date.now()}`,
        branchId: selectedBranch,
        productId,
        authorized: true,
        authorizedBy: 'user-1',
        authorizedAt: new Date(),
      };
      setAuthorizations([...authorizations, newAuth]);
    }
  };

  const branchAuths = authorizations.filter(auth => auth.branchId === selectedBranch);
  const authorizedProducts = branchAuths.filter(auth => auth.authorized).length;
  const unauthorizedProducts = mockProducts.length - authorizedProducts;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Homologação de Itens</h1>
        <p className="text-gray-600">Defina quais produtos estão liberados para cada filial</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filial Selecionada</CardTitle>
            <Building2 className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockBranches.filter(b => b.active).map(branch => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Autorizados</CardTitle>
            <CheckCircle className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{authorizedProducts}</div>
            <p className="text-xs text-gray-600 mt-1">Itens liberados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Não Autorizados</CardTitle>
            <XCircle className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unauthorizedProducts}</div>
            <p className="text-xs text-gray-600 mt-1">Itens bloqueados</p>
          </CardContent>
        </Card>
      </div>

      {/* Authorization Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="size-5" />
            Produtos e Autorizações
          </CardTitle>
          <CardDescription>
            Gerencie quais itens podem ser solicitados pela filial selecionada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Código de Barras</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProducts.map((product) => {
                const auth = branchAuths.find(a => a.productId === product.id);
                const isAuthorized = auth?.authorized || false;
                
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-gray-600">{product.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{product.category}</span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.barcode || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={isAuthorized ? 'default' : 'secondary'}>
                        {isAuthorized ? (
                          <>
                            <CheckCircle className="size-3 mr-1" />
                            Autorizado
                          </>
                        ) : (
                          <>
                            <XCircle className="size-3 mr-1" />
                            Não Autorizado
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={isAuthorized ? 'outline' : 'default'}
                        onClick={() => handleToggleAuthorization(product.id)}
                      >
                        {isAuthorized ? 'Revogar' : 'Autorizar'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckSquare className="size-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Sobre a Homologação</h3>
              <p className="text-sm text-blue-800">
                Apenas produtos autorizados podem ser solicitados normalmente pela filial. 
                Produtos não autorizados podem ser pedidos mediante justificativa e aprovação prévia da Central.
                Isso garante controle sobre o que cada unidade pode requisitar, evitando pedidos inadequados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
