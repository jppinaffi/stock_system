import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Truck, Fuel, TrendingUp } from 'lucide-react';
import { mockRefuelings, mockVehicles } from '../data/mockData';
import type { User } from '../types';

interface RefuelingViewProps {
  currentUser: User;
}

export function RefuelingView({ currentUser }: RefuelingViewProps) {
  const branchId = currentUser.branchId || 'branch-1';
  const vehicles = mockVehicles.filter(v => v.branchId === branchId);
  const refuelings = mockRefuelings.filter(r => r.branchId === branchId);
  
  const totalRefuelings = refuelings.length;
  const totalLiters = refuelings.reduce((sum, r) => sum + r.liters, 0);
  const totalValue = refuelings.reduce((sum, r) => sum + r.totalPrice, 0);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Controle de Abastecimento</h1>
        <p className="text-gray-600">Gestão de combustível e quilometragem de veículos</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Abastecimentos</CardTitle>
            <Fuel className="size-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRefuelings}</div>
            <p className="text-xs text-gray-600 mt-1">Registros</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Litros</CardTitle>
            <TrendingUp className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalLiters.toFixed(2)}L</div>
            <p className="text-xs text-gray-600 mt-1">Combustível consumido</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Fuel className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ {totalValue.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">Custo total</p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="size-5" />
            Veículos da Filial
          </CardTitle>
          <CardDescription>Frota disponível para controle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Truck className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{vehicle.plate}</h3>
                    <p className="text-sm text-gray-600">{vehicle.model}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Odômetro:</p>
                  <p className="font-medium">{vehicle.odometer.toLocaleString()} km</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Refueling History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Abastecimentos</CardTitle>
          <CardDescription>Registro de combustível e quilometragem</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead className="text-right">Litros</TableHead>
                <TableHead className="text-right">R$/L</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Odômetro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refuelings.map((refueling) => {
                const vehicle = vehicles.find(v => v.id === refueling.vehicleId);
                
                return (
                  <TableRow key={refueling.id}>
                    <TableCell>
                      {new Date(refueling.fueledAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{vehicle?.plate}</p>
                        <p className="text-xs text-gray-600">{vehicle?.model}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{refueling.liters}L</TableCell>
                    <TableCell className="text-right">R$ {refueling.pricePerLiter.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium text-green-600">
                        R$ {refueling.totalPrice.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{refueling.odometer.toLocaleString()} km</TableCell>
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
