import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Plus, Trash2, Save } from 'lucide-react';
import { apiService } from '../services/api';
import { Item, Site, CreateTransferRequest } from '../types';

const TransferForm: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateTransferRequest>({
    from_site_id: '',
    to_site_id: '',
    lines: [
      {
        item_id: '',
        qty_base: 0
      }
    ]
  });

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

  const addLine = () => {
    setFormData(prev => ({
      ...prev,
      lines: [
        ...prev.lines,
        {
          item_id: '',
          qty_base: 0
        }
      ]
    }));
  };

  const removeLine = (index: number) => {
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index)
    }));
  };

  const updateLine = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.map((line, i) => 
        i === index ? { ...line, [field]: value } : line
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await apiService.createTransfer(formData);
      alert(`Transfer created successfully! ID: ${result.transfer_id}`);
      
      setFormData({
        from_site_id: '',
        to_site_id: '',
        lines: [
          {
            item_id: '',
            qty_base: 0
          }
        ]
      });
    } catch (error) {
      console.error('Error creating transfer:', error);
      alert('Error creating transfer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fromSite = sites.find(site => site.id === formData.from_site_id);
  const toSite = sites.find(site => site.id === formData.to_site_id);

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
        <h2 className="text-3xl font-bold text-gray-900">Create Transfer</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Site
            </label>
            <select
              value={formData.from_site_id}
              onChange={(e) => setFormData(prev => ({ ...prev, from_site_id: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Source Site</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Site
            </label>
            <select
              value={formData.to_site_id}
              onChange={(e) => setFormData(prev => ({ ...prev, to_site_id: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Destination Site</option>
              {sites.filter(site => site.id !== formData.from_site_id).map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {fromSite && toSite && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-medium text-blue-900">{fromSite.name}</h3>
                <p className="text-sm text-blue-700">{fromSite.address}</p>
              </div>
              <ArrowRightLeft className="h-8 w-8 text-blue-600 mx-6" />
              <div className="text-center">
                <h3 className="font-medium text-blue-900">{toSite.name}</h3>
                <p className="text-sm text-blue-700">{toSite.address}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Transfer Lines</h3>
            <button
              type="button"
              onClick={addLine}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Line
            </button>
          </div>

          {formData.lines.map((line, index) => {
            const selectedItem = items.find(item => item.id === line.item_id);
            
            return (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item
                  </label>
                  <select
                    value={line.item_id}
                    onChange={(e) => updateLine(index, 'item_id', e.target.value)}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity {selectedItem && `(${selectedItem.base_uom})`}
                  </label>
                  <input
                    type="number"
                    value={line.qty_base}
                    onChange={(e) => updateLine(index, 'qty_base', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeLine(index)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    disabled={formData.lines.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {submitting ? 'Creating...' : 'Create Transfer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransferForm;
