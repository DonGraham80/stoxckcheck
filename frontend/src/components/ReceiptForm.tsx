import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { apiService } from '../services/api';
import { Item, Site, Supplier, CreateReceiptRequest } from '../types';

const ReceiptForm: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateReceiptRequest>({
    site_id: '',
    supplier_id: '',
    lines: [
      {
        item_id: '',
        qty: 0,
        uom: 'each',
        unit_cost: 0,
        lot: '',
        expiry: '',
        location_id: ''
      }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsData, sitesData, suppliersData] = await Promise.all([
          apiService.getItems(),
          apiService.getSites(),
          apiService.getSuppliers()
        ]);
        setItems(itemsData);
        setSites(sitesData);
        setSuppliers(suppliersData);
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
          qty: 0,
          uom: 'each',
          unit_cost: 0,
          lot: '',
          expiry: '',
          location_id: ''
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
      lines: prev.lines.map((line, i) => {
        if (i === index) {
          const updatedLine = { ...line, [field]: value };
          
          if (field === 'item_id' && value) {
            const selectedItem = items.find(item => item.id === value);
            if (selectedItem) {
              updatedLine.uom = selectedItem.base_uom;
            }
          }
          
          return updatedLine;
        }
        return line;
      })
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    console.log('Submitting receipt with data:', JSON.stringify(formData, null, 2));

    try {
      const processedFormData = {
        ...formData,
        lines: formData.lines.map(line => ({
          ...line,
          expiry: line.expiry === '' ? null : line.expiry
        }))
      };
      
      const result = await apiService.createReceipt(processedFormData);
      alert(`Receipt created successfully! ID: ${result.receipt_id}`);
      
      setFormData({
        site_id: '',
        supplier_id: '',
        lines: [
          {
            item_id: '',
            qty: 0,
            uom: 'each',
            unit_cost: 0,
            lot: '',
            expiry: '',
            location_id: ''
          }
        ]
      });
    } catch (error) {
      console.error('Error creating receipt:', error);
      console.error('Full error details:', error);
      alert('Error creating receipt. Please try again.');
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
        <h2 className="text-3xl font-bold text-gray-900">Create Receipt</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              Supplier
            </label>
            <select
              value={formData.supplier_id}
              onChange={(e) => setFormData(prev => ({ ...prev, supplier_id: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Receipt Lines</h3>
            <button
              type="button"
              onClick={addLine}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Line
            </button>
          </div>

          {formData.lines.map((line, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg">
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
                  Quantity
                </label>
                <input
                  type="number"
                  value={line.qty}
                  onChange={(e) => updateLine(index, 'qty', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UOM
                </label>
                <select
                  value={line.uom}
                  onChange={(e) => updateLine(index, 'uom', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  {(() => {
                    const selectedItem = items.find(item => item.id === line.item_id);
                    if (!selectedItem) return <option value="">Select Item First</option>;
                    
                    const uomOptions = [];
                    if (selectedItem.base_uom) uomOptions.push({ value: selectedItem.base_uom, label: selectedItem.base_uom });
                    if (selectedItem.pack_uom) uomOptions.push({ value: selectedItem.pack_uom, label: `${selectedItem.pack_uom} (${selectedItem.pack_size} ${selectedItem.base_uom})` });
                    if (selectedItem.case_uom) uomOptions.push({ value: selectedItem.case_uom, label: `${selectedItem.case_uom} (${selectedItem.case_size} ${selectedItem.pack_uom || selectedItem.base_uom})` });
                    
                    return uomOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ));
                  })()}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Cost
                </label>
                <input
                  type="number"
                  value={line.unit_cost}
                  onChange={(e) => updateLine(index, 'unit_cost', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lot Code
                </label>
                <input
                  type="text"
                  value={line.lot}
                  onChange={(e) => updateLine(index, 'lot', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
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
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {submitting ? 'Creating...' : 'Create Receipt'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReceiptForm;
