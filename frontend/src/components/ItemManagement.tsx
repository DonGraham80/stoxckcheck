import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { apiService } from '../services/api';
import { Item, StorageType } from '../types';

interface CreateItemForm {
  sku: string;
  name: string;
  category: string;
  storageType: StorageType;
  baseUom: string;
  packUom: string;
  packSize: number | '';
  caseUom: string;
  caseSize: number | '';
  standardCost: number | '';
}

const ItemManagement: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<CreateItemForm>({
    sku: '',
    name: '',
    category: '',
    storageType: 'Ambient',
    baseUom: '',
    packUom: '',
    packSize: '',
    caseUom: '',
    caseSize: '',
    standardCost: ''
  });
  const [editForm, setEditForm] = useState<CreateItemForm>({
    sku: '',
    name: '',
    category: '',
    storageType: 'Ambient',
    baseUom: '',
    packUom: '',
    packSize: '',
    caseUom: '',
    caseSize: '',
    standardCost: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const itemsData = await apiService.getItems();
      setItems(itemsData);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...createForm,
        packSize: createForm.packSize === '' ? undefined : Number(createForm.packSize),
        caseSize: createForm.caseSize === '' ? undefined : Number(createForm.caseSize),
        standardCost: Number(createForm.standardCost)
      };

      await apiService.createItem(data);
      setCreateForm({
        sku: '',
        name: '',
        category: '',
        storageType: 'Ambient',
        baseUom: '',
        packUom: '',
        packSize: '',
        caseUom: '',
        caseSize: '',
        standardCost: ''
      });
      setShowCreateForm(false);
      await fetchItems();
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Failed to create item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent, itemId: string) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...editForm,
        packSize: editForm.packSize === '' ? undefined : Number(editForm.packSize),
        caseSize: editForm.caseSize === '' ? undefined : Number(editForm.caseSize),
        standardCost: Number(editForm.standardCost)
      };

      await apiService.updateItem(itemId, data);
      setEditingItem(null);
      await fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (itemId: string, itemName: string) => {
    if (!confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiService.deleteItem(itemId);
      await fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. It may be in use in inventory or transactions.');
    }
  };

  const startEdit = (item: Item) => {
    setEditForm({
      sku: item.sku,
      name: item.name,
      category: item.category,
      storageType: item.storageType,
      baseUom: item.baseUom,
      packUom: item.packUom || '',
      packSize: item.packSize || '',
      caseUom: item.caseUom || '',
      caseSize: item.caseSize || '',
      standardCost: item.standardCost
    });
    setEditingItem(item.id);
  };

  const getStorageColor = (storageType: StorageType) => {
    switch (storageType) {
      case 'Chilled':
        return 'bg-blue-100 text-blue-800';
      case 'Frozen':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

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
        <h2 className="text-3xl font-bold text-gray-900">Item Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Item</h3>
          <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
              <input
                type="text"
                required
                value={createForm.sku}
                onChange={(e) => setCreateForm({ ...createForm, sku: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter SKU"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                required
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter item name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <input
                type="text"
                required
                value={createForm.category}
                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Storage Type *</label>
              <select
                value={createForm.storageType}
                onChange={(e) => setCreateForm({ ...createForm, storageType: e.target.value as StorageType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Ambient">Ambient</option>
                <option value="Chilled">Chilled</option>
                <option value="Frozen">Frozen</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base UOM *</label>
              <input
                type="text"
                required
                value={createForm.baseUom}
                onChange={(e) => setCreateForm({ ...createForm, baseUom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., kg, litre, each"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Standard Cost *</label>
              <input
                type="number"
                step="0.01"
                required
                value={createForm.standardCost}
                onChange={(e) => setCreateForm({ ...createForm, standardCost: e.target.value === '' ? '' : Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Storage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UOM</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                {editingItem === item.id ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editForm.sku}
                          onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          placeholder="SKU"
                        />
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          placeholder="Name"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="Category"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={editForm.storageType}
                        onChange={(e) => setEditForm({ ...editForm, storageType: e.target.value as StorageType })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="Ambient">Ambient</option>
                        <option value="Chilled">Chilled</option>
                        <option value="Frozen">Frozen</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={editForm.baseUom}
                        onChange={(e) => setEditForm({ ...editForm, baseUom: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="UOM"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.standardCost}
                        onChange={(e) => setEditForm({ ...editForm, standardCost: e.target.value === '' ? '' : Number(e.target.value) })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="Cost"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => handleEditSubmit(e, item.id)}
                          disabled={submitting}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStorageColor(item.storageType)}`}>
                        {item.storageType.charAt(0).toUpperCase() + item.storageType.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.baseUom}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">£{item.standardCost?.toFixed(2) || '0.00'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first item.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemManagement;
