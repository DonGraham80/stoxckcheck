import React, { useState, useEffect } from 'react';
import { Search, Filter, Package, MapPin } from 'lucide-react';
import { apiService } from '../services/api';
import { InventoryOnHand, Item, Site } from '../types';

const InventoryView: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryOnHand[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSite, setSelectedSite] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryData, itemsData, sitesData] = await Promise.all([
          apiService.getInventoryOnHand(selectedSite || undefined),
          apiService.getItems(),
          apiService.getSites()
        ]);
        setInventory(inventoryData);
        setItems(itemsData);
        setSites(sitesData);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSite]);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Inventory</h2>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Sites</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const itemInventory = inventory.filter(inv => inv.item_id === item.id);
          const totalOnHand = itemInventory.reduce((sum, inv) => sum + inv.qty_on_hand, 0);
          const totalValue = itemInventory.reduce((sum, inv) => sum + inv.total_value, 0);

          return (
            <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.storage_type === 'chilled' ? 'bg-blue-100 text-blue-800' :
                    item.storage_type === 'frozen' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.storage_type.charAt(0).toUpperCase() + item.storage_type.slice(1)}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category:</span>
                    <span className="text-gray-900">{item.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Unit:</span>
                    <span className="text-gray-900">{item.base_uom}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Standard Cost:</span>
                    <span className="text-gray-900">£{item.standard_cost.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">On Hand</p>
                      <p className="text-lg font-semibold text-gray-900">{totalOnHand} {item.base_uom}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Value</p>
                      <p className="text-lg font-semibold text-gray-900">£{totalValue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {itemInventory.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Locations:</p>
                    <div className="space-y-1">
                      {itemInventory.map((inv, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{inv.location_name}: {inv.qty_on_hand} {item.base_uom}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
