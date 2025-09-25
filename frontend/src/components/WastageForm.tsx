import React, { useState, useEffect } from 'react';
import { Trash2, Save } from 'lucide-react';
import { apiService } from '../services/api';
import { Item, Site, CreateWastageRequest } from '../types';

const WastageForm: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateWastageRequest>({
    site_id: '',
    item_id: '',
    lot_id: '',
    location_id: '',
    qty_base: 0,
    reason: ''
  });

  const wastageReasons = [
    'Expired',
    'Damaged',
    'Contaminated',
    'Over-production',
    'Spillage',
    'Quality issue',
    'Other'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsData, sitesData] = await Promise.all([
          apiService.getItems(),
          apiService.getSites()
        ]);
        setItems(itemsData);
        setSites(sitesData);
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await apiService.createWastage(formData);
      alert(`Wastage recorded successfully! ID: ${result.wastage_id}`);
      
      setFormData({
        site_id: '',
        item_id: '',
        lot_id: '',
        location_id: '',
        qty_base: 0,
        reason: ''
      });
    } catch (error) {
      console.error('Error recording wastage:', error);
      alert('Error recording wastage. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSite = sites.find(site => site.id === formData.site_id);
  const selectedItem = items.find(item => item.id === formData.item_id);

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
        <h2 className="text-3xl font-bold text-gray-900">Record Wastage</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site
            </label>
            <select
              value={formData.site_id}
              onChange={(e) => setFormData(prev => ({ ...prev, site_id: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Site</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item
            </label>
            <select
              value={formData.item_id}
              onChange={(e) => setFormData(prev => ({ ...prev, item_id: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.sku})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedItem && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Trash2 className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">{selectedItem.name}</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">SKU:</span>
                <span className="ml-2 text-gray-900">{selectedItem.sku}</span>
              </div>
              <div>
                <span className="text-gray-500">Category:</span>
                <span className="ml-2 text-gray-900">{selectedItem.category}</span>
              </div>
              <div>
                <span className="text-gray-500">Storage:</span>
                <span className="ml-2 text-gray-900">{selectedItem.storage_type}</span>
              </div>
              <div>
                <span className="text-gray-500">Unit:</span>
                <span className="ml-2 text-gray-900">{selectedItem.base_uom}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <select
              value={formData.location_id}
              onChange={(e) => setFormData(prev => ({ ...prev, location_id: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Location</option>
              {selectedSite?.locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lot Code
            </label>
            <input
              type="text"
              value={formData.lot_id}
              onChange={(e) => setFormData(prev => ({ ...prev, lot_id: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              placeholder="Enter lot code"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity Wasted {selectedItem && `(${selectedItem.base_uom})`}
            </label>
            <input
              type="number"
              value={formData.qty_base}
              onChange={(e) => setFormData(prev => ({ ...prev, qty_base: parseFloat(e.target.value) || 0 }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
              step="0.01"
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Wastage
            </label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Reason</option>
              {wastageReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>
        </div>

        {formData.reason === 'Other' && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details
            </label>
            <textarea
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Please provide additional details about the wastage..."
            />
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {submitting ? 'Recording...' : 'Record Wastage'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WastageForm;
