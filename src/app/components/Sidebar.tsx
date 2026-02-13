import { 
  Building2, 
  Users, 
  Package, 
  ShoppingCart, 
  CheckSquare, 
  ClipboardCheck, 
  Archive, 
  FileText, 
  Truck, 
  Bed, 
  BarChart3,
  LogOut,
  LayoutDashboard,
  Send
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import type { User } from '../types';

interface SidebarProps {
  currentUser: User;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export function Sidebar({ currentUser, currentView, onViewChange, onLogout }: SidebarProps) {
  const isCentral = currentUser.role === 'admin';
  const isBranch = currentUser.role === 'branch_operator';

  const centralMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'branches', label: 'Filiais', icon: Building2 },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'catalog', label: 'Catálogo Global', icon: Package },
    { id: 'purchases', label: 'Compras', icon: ShoppingCart },
    { id: 'authorizations', label: 'Homologações', icon: CheckSquare },
    { id: 'orders', label: 'Pedidos', icon: Send },
    { id: 'refueling', label: 'Abastecimento', icon: Truck },
    { id: 'linen', label: 'Enxoval', icon: Bed },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  ];

  const branchMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'receiving', label: 'Recebimento', icon: ClipboardCheck },
    { id: 'consumption', label: 'Consumo', icon: FileText },
    { id: 'inventory', label: 'Inventário', icon: Archive },
    { id: 'orders', label: 'Pedidos', icon: Send },
    { id: 'refueling', label: 'Abastecimento', icon: Truck },
    { id: 'linen', label: 'Enxoval', icon: Bed },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  ];

  const menuItems = isCentral ? centralMenuItems : branchMenuItems;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Building2 className="size-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Suprimentos</h2>
            <p className="text-xs text-gray-500">Sistema de Gestão</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 mb-6">
          <p className="text-xs text-gray-600 mb-1">Logado como:</p>
          <p className="font-medium text-sm text-gray-900">{currentUser.name}</p>
          <p className="text-xs text-gray-600">
            {currentUser.role === 'admin' && 'Administrador'}
            {currentUser.role === 'branch_operator' && 'Operador Filial'}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="size-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={onLogout}
        >
          <LogOut className="size-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
}