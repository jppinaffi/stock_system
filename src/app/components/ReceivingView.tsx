import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ClipboardCheck, Plus, Barcode, Package } from 'lucide-react';
import { mockProducts } from '../data/mockData';

export function ReceivingView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');

  const handleScanBarcode = () => {
    const mockBarcode = '7891234567890';
    const product = mockProducts.find(p => p.barcode === mockBarcode);
    
    if (product) {
      setScannedProduct(product.name);
      alert(`Produto escaneado: ${product.name}`);
    } else {
      alert('Produto não encontrado no catálogo');
    }
  };

  const handleConfirmReceipt = () => {
    if (scannedProduct && quantity) {
      alert(`Recebimento confirmado!\nProduto: ${scannedProduct}\nQuantidade: ${quantity}`);
      setIsDialogOpen(false);
      setScannedProduct('');
      setQuantity('');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirmação de Recebimento</h1>
          <p className="text-gray-600">Baixa de chegada de produtos via código de barras</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Confirmar Recebimento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Recebimento de Produtos</DialogTitle>
              <DialogDescription>
                Escaneie o código de barras para registrar a chegada
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Escanear Código de Barras</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Código de barras"
                    value={scannedProduct}
                    readOnly
                  />
                  <Button type="button" onClick={handleScanBarcode}>
                    <Barcode className="size-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade Recebida</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                />
              </div>
              
              <Button onClick={handleConfirmReceipt} className="w-full">
                Confirmar Recebimento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="size-5" />
            Histórico de Recebimentos
          </CardTitle>
          <CardDescription>Produtos recebidos e confirmados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Package className="size-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum recebimento registrado</h3>
            <p className="text-gray-600">Use o leitor de código de barras para confirmar recebimentos</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
