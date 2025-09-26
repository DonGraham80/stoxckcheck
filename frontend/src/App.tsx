import { useState } from 'react';
import { 
  Package, 
  Truck, 
  ChefHat, 
  Trash2, 
  ArrowRightLeft, 
  ClipboardList,
  BarChart3,
  Mic,
  Bot,
  HelpCircle,
  Building,
  LogOut,
  User
} from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import InventoryView from './components/InventoryView';
import ReceiptForm from './components/ReceiptForm';
import ProductionForm from './components/ProductionForm';
import WastageForm from './components/WastageForm';
import TransferForm from './components/TransferForm';
import CountForm from './components/CountForm';
// import VoiceInterface from './components/VoiceInterface';
// import AgentInterface from './components/AgentInterface';
import UserGuide from './components/UserGuide';
import SiteManagement from './components/SiteManagement';
import Login from './components/Login';

type View = 'dashboard' | 'inventory' | 'receipt' | 'production' | 'wastage' | 'transfer' | 'count' | 'voice' | 'agent' | 'userguide' | 'sites';

const AppContent: React.FC = () => {
  const { user, tenant, logout, isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'sites', label: 'Sites', icon: Building },
    { id: 'receipt', label: 'Receipts', icon: Truck },
    { id: 'production', label: 'Production', icon: ChefHat },
    { id: 'wastage', label: 'Wastage', icon: Trash2 },
    { id: 'transfer', label: 'Transfers', icon: ArrowRightLeft },
    { id: 'count', label: 'Counts', icon: ClipboardList },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'agent', label: 'AI Agent', icon: Bot },
    { id: 'userguide', label: 'User Guide', icon: HelpCircle },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <InventoryView />;
      case 'receipt':
        return <ReceiptForm />;
      case 'production':
        return <ProductionForm />;
      case 'wastage':
        return <WastageForm />;
      case 'transfer':
        return <TransferForm />;
      case 'count':
        return <CountForm />;
      case 'voice':
        return <div className="p-6 text-center text-gray-500">Voice Interface - Coming Soon</div>;
      case 'agent':
        return <div className="p-6 text-center text-gray-500">AI Agent - Coming Soon</div>;
      case 'userguide':
        return <UserGuide />;
      case 'sites':
        return <SiteManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">School Catering Stock Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <User className="h-4 w-4 mr-1" />
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-sm text-gray-500">
                {tenant?.name}
              </div>
              <button
                onClick={logout}
                className="flex items-center px-3 py-1 text-sm text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setCurrentView(item.id as View)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentView === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
