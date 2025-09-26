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
  HelpCircle
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import InventoryView from './components/InventoryView';
import ReceiptForm from './components/ReceiptForm';
import ProductionForm from './components/ProductionForm';
import WastageForm from './components/WastageForm';
import TransferForm from './components/TransferForm';
import CountForm from './components/CountForm';
import VoiceInterface from './components/VoiceInterface';
import AgentInterface from './components/AgentInterface';

type View = 'dashboard' | 'inventory' | 'receipt' | 'production' | 'wastage' | 'transfer' | 'count' | 'voice' | 'agent';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'receipt', label: 'Receipts', icon: Truck },
    { id: 'production', label: 'Production', icon: ChefHat },
    { id: 'wastage', label: 'Wastage', icon: Trash2 },
    { id: 'transfer', label: 'Transfers', icon: ArrowRightLeft },
    { id: 'count', label: 'Counts', icon: ClipboardList },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'agent', label: 'AI Agent', icon: Bot },
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
        return <VoiceInterface />;
      case 'agent':
        return <AgentInterface />;
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
              <a
                href="/USER_GUIDE.md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                User Guide
              </a>
              <div className="text-sm text-gray-500">
                Central High School
              </div>
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
}

export default App;
