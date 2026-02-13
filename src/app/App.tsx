import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { DashboardCentral } from './components/DashboardCentral';
import { DashboardBranch } from './components/DashboardBranch';
import { BranchesView } from './components/BranchesView';
import { UsersView } from './components/UsersView';
import { CatalogView } from './components/CatalogView';
import { PurchasesView } from './components/PurchasesView';
import { AuthorizationsView } from './components/AuthorizationsView';
import { OrdersView } from './components/OrdersView';
import { ReceivingView } from './components/ReceivingView';
import { ConsumptionView } from './components/ConsumptionView';
import { InventoryView } from './components/InventoryView';
import { RefuelingView } from './components/RefuelingView';
import { LinenView } from './components/LinenView';
import { ReportsView } from './components/ReportsView';
import { Toaster } from './components/ui/sonner';
import { getCurrentUser, setCurrentUser } from './data/mockData';
import type { User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    setCurrentView('dashboard');
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const isCentral = user.role === 'admin';

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return isCentral ? <DashboardCentral /> : <DashboardBranch currentUser={user} />;
      
      // Central views
      case 'branches':
        return isCentral ? <BranchesView /> : null;
      case 'users':
        return isCentral ? <UsersView /> : null;
      case 'catalog':
        return isCentral ? <CatalogView /> : null;
      case 'purchases':
        return isCentral ? <PurchasesView /> : null;
      case 'authorizations':
        return isCentral ? <AuthorizationsView /> : null;
      
      // Branch views
      case 'receiving':
        return !isCentral ? <ReceivingView /> : null;
      case 'consumption':
        return !isCentral ? <ConsumptionView currentUser={user} /> : null;
      case 'inventory':
        return !isCentral ? <InventoryView currentUser={user} /> : null;
      
      // Shared views
      case 'orders':
        return <OrdersView currentUser={user} />;
      case 'refueling':
        return <RefuelingView currentUser={user} />;
      case 'linen':
        return <LinenView currentUser={user} />;
      case 'reports':
        return <ReportsView currentUser={user} />;
      
      default:
        return isCentral ? <DashboardCentral /> : <DashboardBranch currentUser={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentUser={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
      
      <Toaster />
    </div>
  );
}