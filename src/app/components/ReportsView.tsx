import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart3, Download, TrendingUp, User, Package, DollarSign } from 'lucide-react';
import { mockConsumptions, mockProducts, mockBranches, mockUsers, mockAuditLogs } from '../data/mockData';
import type { User as UserType } from '../types';

interface ReportsViewProps {
  currentUser: UserType;
}

export function ReportsView({ currentUser }: ReportsViewProps) {
  const isCentral = currentUser.role === 'admin';
  const [reportType, setReportType] = useState<string>('consumption-by-user');
  const [selectedBranch, setSelectedBranch] = useState<string>(currentUser.branchId || 'all');

  // Consumption by User Report
  const consumptionByUser = mockConsumptions
    .filter(c => selectedBranch === 'all' || c.branchId === selectedBranch)
    .reduce((acc, consumption) => {
      const key = consumption.consumedByCPF;
      if (!acc[key]) {
        acc[key] = {
          name: consumption.consumedBy,
          cpf: consumption.consumedByCPF,
          totalValue: 0,
          totalItems: 0,
          consumptions: [],
        };
      }
      acc[key].totalValue += consumption.totalPrice;
      acc[key].totalItems += consumption.quantity;
      acc[key].consumptions.push(consumption);
      return acc;
    }, {} as Record<string, any>);

  // Consumption by Product Report
  const consumptionByProduct = mockConsumptions
    .filter(c => selectedBranch === 'all' || c.branchId === selectedBranch)
    .reduce((acc, consumption) => {
      const key = consumption.productId;
      const product = mockProducts.find(p => p.id === key);
      if (!acc[key]) {
        acc[key] = {
          productName: product?.name || 'Unknown',
          category: product?.category || 'other',
          totalQuantity: 0,
          totalValue: 0,
          occurrences: 0,
        };
      }
      acc[key].totalQuantity += consumption.quantity;
      acc[key].totalValue += consumption.totalPrice;
      acc[key].occurrences += 1;
      return acc;
    }, {} as Record<string, any>);

  // Audit Trail Report
  const auditTrail = mockAuditLogs
    .filter(log => selectedBranch === 'all' || log.branchId === selectedBranch)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleExport = () => {
    alert('Funcionalidade de exportação: Em produção, este botão geraria um arquivo Excel/PDF com os dados do relatório.');
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatórios e Rastreabilidade</h1>
          <p className="text-gray-600">Análise de dados e auditoria completa do sistema</p>
        </div>
        
        <Button onClick={handleExport}>
          <Download className="size-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consumption-by-user">Consumo por Colaborador</SelectItem>
              <SelectItem value="consumption-by-product">Consumo por Produto</SelectItem>
              <SelectItem value="audit-trail">Trilha de Auditoria</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isCentral && (
          <div className="w-64">
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Filiais</SelectItem>
                {mockBranches.map(branch => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Consumption by User Report */}
      {reportType === 'consumption-by-user' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Consumo por Colaborador
            </CardTitle>
            <CardDescription>
              Rastreamento de consumo individual para controle de desperdício
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead className="text-right">Total de Itens</TableHead>
                  <TableHead className="text-right">Valor Total Consumido</TableHead>
                  <TableHead className="text-right">Nº de Registros</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(consumptionByUser)
                  .sort((a: any, b: any) => b.totalValue - a.totalValue)
                  .map((user: any, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.cpf}</TableCell>
                      <TableCell className="text-right">{user.totalItems}</TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium text-blue-600">
                          R$ {user.totalValue.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{user.consumptions.length}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            
            {Object.keys(consumptionByUser).length === 0 && (
              <div className="text-center py-12">
                <User className="size-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum consumo registrado no período</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Consumption by Product Report */}
      {reportType === 'consumption-by-product' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="size-5" />
              Consumo por Produto
            </CardTitle>
            <CardDescription>
              Análise de gargalos e padrões de consumo por item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Quantidade Total</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead className="text-right">Frequência</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(consumptionByProduct)
                  .sort((a: any, b: any) => b.totalValue - a.totalValue)
                  .map((product: any, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{product.productName}</TableCell>
                      <TableCell>
                        <span className="capitalize">{product.category}</span>
                      </TableCell>
                      <TableCell className="text-right">{product.totalQuantity.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium text-green-600">
                          R$ {product.totalValue.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{product.occurrences} vezes</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            
            {Object.keys(consumptionByProduct).length === 0 && (
              <div className="text-center py-12">
                <Package className="size-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum consumo registrado no período</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Audit Trail Report */}
      {reportType === 'audit-trail' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5" />
              Trilha de Auditoria
            </CardTitle>
            <CardDescription>
              Registro completo de todas as movimentações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditTrail.slice(0, 50).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {new Date(log.timestamp).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{log.action}</span>
                    </TableCell>
                    <TableCell>{log.userName}</TableCell>
                    <TableCell className="text-sm text-gray-600">{log.userCPF}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {log.details.productName && (
                          <p>Produto: {log.details.productName}</p>
                        )}
                        {log.details.quantity && (
                          <p>Quantidade: {log.details.quantity}</p>
                        )}
                        {log.details.totalPrice && (
                          <p className="text-blue-600 font-medium">
                            Valor: R$ {log.details.totalPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {auditTrail.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 className="size-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum registro de auditoria encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Registros</CardTitle>
            <BarChart3 className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportType === 'audit-trail' ? auditTrail.length : Object.keys(
                reportType === 'consumption-by-user' ? consumptionByUser : consumptionByProduct
              ).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {mockConsumptions
                .filter(c => selectedBranch === 'all' || c.branchId === selectedBranch)
                .reduce((sum, c) => sum + c.totalPrice, 0)
                .toFixed(2)
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendência</CardTitle>
            <TrendingUp className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">+12%</div>
            <p className="text-xs text-gray-600 mt-1">vs. período anterior</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}