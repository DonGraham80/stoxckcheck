import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Trash2, Save } from 'lucide-react';
import { apiService } from '../services/api';
import { Item, Site, CreateCountRequest } from '../types';

const CountForm: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateCountRequest>({
    site_id: '',
    lines: [
      {
        item_id: '',
        lot_id: '',
        location_id: '',
        expected_qty: undefined,
        actual_qty: 0
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
          lot_id: '',
          location_id: '',
          expected_qty: undefined,
          actual_qty: 0
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
      const result = await apiService.createCount(formData);
      alert(`Count created successfully! ID: ${result.count_id}`);
      
      setFormData({
        site_id: '',
        lines: [
          {
            item_id: '',
            lot_id: '',
            location_id: '',
            expected_qty: undefined,
            actual_qty: 0
          }
        ]
      });
    } catch (error) {
      console.error('Error creating count:', error);
      alert('Error creating count. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSite = sites.find(site => site.id === formData.site_id);

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
        <h2 className="text-3xl font-bold text-gray-900">Cycle Count</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site
          </label>
          <select
            value={formData.site_id}
            onChange={(e) => setFormData(prev => ({ ...prev, site_id: e.target.value }))}
            className="w-full md:w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Count Lines</h3>
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
            const variance = line.expected_qty !== undefined ? line.actual_qty - line.expected_qty : 0;
            
            return (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
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
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <select
                      value={line.location_id}
                      onChange={(e) => updateLine(index, 'location_id', e.target.value)}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lot Code
                    </label>
                    <input
                      type="text"
                      value={line.lot_id}
                      onChange={(e) => updateLine(index, 'lot_id', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                      placeholder="Enter lot code"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Qty {selectedItem && `(${selectedItem.base_uom})`}
                    </label>
                    <input
                      type="number"
                      value={line.expected_qty || ''}
                      onChange={(e) => updateLine(index, 'expected_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      step="0.01"
                      placeholder="Optional"
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actual Qty {selectedItem && `(${selectedItem.base_uom})`}
                    </label>
                    <input
                      type="number"
                      value={line.actual_qty}
                      onChange={(e) => updateLine(index, 'actual_qty', parseFloat(e.target.value) || 0)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {line.expected_qty !== undefined && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Variance
                        </label>
                        <div className={`px-3 py-2 rounded-md text-sm font-medium ${
                          variance === 0 ? 'bg-green-100 text-green-800' :
                          variance > 0 ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {variance > 0 ? '+' : ''}{variance} {selectedItem?.base_uom}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <div className={`px-3 py-2 rounded-md text-sm font-medium ${
                          variance === 0 ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {variance === 0 ? 'Match' : 'Adjustment Required'}
                        </div>
                      </div>
                    </>
                  )}
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
            {submitting ? 'Processing...' : 'Process Count'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CountForm;
