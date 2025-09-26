import React from 'react';
import { Book, Users, Package, Truck, ChefHat, Trash2, ArrowRightLeft, ClipboardList, BarChart3 } from 'lucide-react';

const UserGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <Book className="mx-auto h-16 w-16 text-blue-600 mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">School Catering Stock Management</h1>
        <p className="text-xl text-gray-600">User Guide</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
        <p className="text-gray-700 mb-4">
          The School Catering Stock Management system helps you track inventory, manage receipts, 
          record production runs, handle wastage, and monitor stock movements across your school 
          catering operations.
        </p>
        <p className="text-gray-700">
          This system is designed specifically for school catering teams to maintain accurate 
          inventory records and ensure food safety compliance.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started</h2>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <BarChart3 className="h-6 w-6 text-blue-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard</h3>
              <p className="text-gray-700">
                Your main overview showing total items, inventory value, recent movements, and key metrics. 
                Use this to get a quick snapshot of your current stock status.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Package className="h-6 w-6 text-green-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Inventory</h3>
              <p className="text-gray-700">
                View all items in your inventory with current stock levels, storage requirements, 
                and unit costs. Items are categorized by storage type (Ambient, Chilled, Frozen).
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Functions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <Truck className="h-6 w-6 text-blue-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Receipts</h3>
              <p className="text-gray-700 text-sm">
                Record deliveries from suppliers. Enter item details, quantities, unit costs, 
                lot codes, and expiry dates. This increases your stock levels.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <ChefHat className="h-6 w-6 text-purple-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Production</h3>
              <p className="text-gray-700 text-sm">
                Record meal production runs. Select recipes and quantities to automatically 
                deduct ingredients from stock and add finished meals.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Trash2 className="h-6 w-6 text-red-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Wastage</h3>
              <p className="text-gray-700 text-sm">
                Record food waste due to spoilage, damage, or expiry. Include reasons 
                for tracking and compliance purposes.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <ArrowRightLeft className="h-6 w-6 text-orange-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transfers</h3>
              <p className="text-gray-700 text-sm">
                Move stock between locations within your site. Track items being 
                transferred from storage to kitchen areas.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <ClipboardList className="h-6 w-6 text-green-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stock Counts</h3>
              <p className="text-gray-700 text-sm">
                Perform physical stock counts to verify actual quantities match 
                system records. Adjust discrepancies as needed.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
        
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900">Daily Operations</h3>
            <p className="text-gray-700 text-sm">
              Record all receipts immediately upon delivery. Update production runs after each meal service. 
              Record wastage as soon as it's identified.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold text-gray-900">Food Safety</h3>
            <p className="text-gray-700 text-sm">
              Always enter accurate expiry dates and lot codes. Monitor chilled and frozen items closely. 
              Use FIFO (First In, First Out) rotation principles.
            </p>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-semibold text-gray-900">Accuracy</h3>
            <p className="text-gray-700 text-sm">
              Perform regular stock counts to verify system accuracy. Investigate and resolve 
              discrepancies promptly. Keep lot codes and expiry dates up to date.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Storage Types</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">🌡️</div>
            <h3 className="font-semibold text-green-800">Ambient</h3>
            <p className="text-sm text-green-700">Room temperature storage for dry goods, canned items</p>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">❄️</div>
            <h3 className="font-semibold text-blue-800">Chilled</h3>
            <p className="text-sm text-blue-700">Refrigerated storage 0-5°C for dairy, fresh produce</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">🧊</div>
            <h3 className="font-semibold text-purple-800">Frozen</h3>
            <p className="text-sm text-purple-700">Frozen storage -18°C or below for frozen foods</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Support</h2>
        <p className="text-gray-700 mb-4">
          For technical support or questions about using the system, contact your IT administrator 
          or the system support team.
        </p>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            <strong>System Version:</strong> School Catering Stock Management MVP<br />
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
