import React, { useState, useEffect } from 'react';
import { Building, Plus, MapPin, Package, Thermometer, Snowflake, Sun, Edit, Trash2, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { apiService } from '../services/api';
import { Site, StorageType } from '../types';

interface CreateLocationForm {
  name: string;
  storageType: StorageType;
}

interface CreateSiteForm {
  name: string;
  address: string;
  locations: CreateLocationForm[];
}

const SiteManagement: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [expandedSite, setExpandedSite] = useState<string | null>(null);
  const [editingSite, setEditingSite] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<CreateSiteForm>({
    name: '',
    address: '',
    locations: [{ name: 'Main Storage', storageType: 'Ambient' }]
  });
  const [editForm, setEditForm] = useState<CreateSiteForm>({
    name: '',
    address: '',
    locations: []
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const sitesData = await apiService.getSites();
      setSites(sitesData);
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await apiService.createSite(createForm);
      setCreateForm({
        name: '',
        address: '',
        locations: [{ name: 'Main Storage', storageType: 'Ambient' }]
      });
      setShowCreateForm(false);
      await fetchSites();
    } catch (error) {
      console.error('Error creating site:', error);
      alert('Failed to create site. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const addLocation = () => {
    setCreateForm({
      ...createForm,
      locations: [...createForm.locations, { name: '', storageType: 'Ambient' }]
    });
  };

  const removeLocation = (index: number) => {
    setCreateForm({
      ...createForm,
      locations: createForm.locations.filter((_, i) => i !== index)
    });
  };

  const updateLocation = (index: number, field: keyof CreateLocationForm, value: string) => {
    const updatedLocations = [...createForm.locations];
    updatedLocations[index] = { ...updatedLocations[index], [field]: value };
    setCreateForm({ ...createForm, locations: updatedLocations });
  };

  const updateEditLocation = (index: number, field: keyof CreateLocationForm, value: string) => {
    const updatedLocations = [...editForm.locations];
    updatedLocations[index] = { ...updatedLocations[index], [field]: value };
    setEditForm({ ...editForm, locations: updatedLocations });
  };

  const addEditLocation = () => {
    setEditForm({
      ...editForm,
      locations: [...editForm.locations, { name: '', storageType: 'Ambient' }]
    });
  };

  const removeEditLocation = (index: number) => {
    setEditForm({
      ...editForm,
      locations: editForm.locations.filter((_, i) => i !== index)
    });
  };

  const handleSiteClick = (siteId: string) => {
    if (expandedSite === siteId) {
      setExpandedSite(null);
      setEditingSite(null);
    } else {
      setExpandedSite(siteId);
      setEditingSite(null);
    }
  };

  const handleEditSite = (site: Site) => {
    setEditForm({
      name: site.name,
      address: site.address || '',
      locations: site.locations.map(loc => ({
        name: loc.name,
        storageType: loc.storageType
      }))
    });
    setEditingSite(site.id);
  };

  const handleUpdateSite = async (siteId: string) => {
    setSubmitting(true);
    try {
      console.log('Updating site:', siteId);
      alert('Site editing functionality coming soon!');
      setEditingSite(null);
    } catch (error) {
      console.error('Error updating site:', error);
      alert('Failed to update site. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSite = async (siteId: string, siteName: string) => {
    if (window.confirm(`Are you sure you want to delete "${siteName}"? This action cannot be undone.`)) {
      try {
        console.log('Deleting site:', siteId);
        alert('Site deletion functionality coming soon!');
      } catch (error) {
        console.error('Error deleting site:', error);
        alert('Failed to delete site. Please try again.');
      }
    }
  };

  const handleViewSiteInventory = (siteId: string, siteName: string) => {
    console.log('Viewing inventory for site:', siteId);
    alert(`Site-specific inventory view for "${siteName}" coming soon!`);
  };

  const getStorageIcon = (storageType: StorageType) => {
    switch (storageType) {
      case 'Chilled':
        return <Thermometer className="h-4 w-4 text-blue-600" />;
      case 'Frozen':
        return <Snowflake className="h-4 w-4 text-purple-600" />;
      default:
        return <Sun className="h-4 w-4 text-green-600" />;
    }
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
        <h2 className="text-3xl font-bold text-gray-900">Site Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Site
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Site</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name *
              </label>
              <input
                type="text"
                required
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter site name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={createForm.address}
                onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter site address"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Storage Locations *
                </label>
                <button
                  type="button"
                  onClick={addLocation}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Location
                </button>
              </div>
              
              {createForm.locations.map((location, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    required
                    value={location.name}
                    onChange={(e) => updateLocation(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Location name"
                  />
                  <select
                    value={location.storageType}
                    onChange={(e) => updateLocation(index, 'storageType', e.target.value as StorageType)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Ambient">Ambient</option>
                    <option value="Chilled">Chilled</option>
                    <option value="Frozen">Frozen</option>
                  </select>
                  {createForm.locations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLocation(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
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
                {submitting ? 'Creating...' : 'Create Site'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map((site) => (
          <div key={site.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div 
              className="p-6 cursor-pointer"
              onClick={() => handleSiteClick(site.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center flex-1">
                  <Building className="h-8 w-8 text-blue-600 mr-3" />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{site.name}</h3>
                    {site.address && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {site.address}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  {expandedSite === site.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 flex items-center">
                  <Package className="h-4 w-4 mr-1" />
                  Storage Locations ({site.locations?.length || 0})
                </h4>
                {site.locations?.map((location) => (
                  <div key={location.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-900">{location.name}</span>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStorageColor(location.storageType)}`}>
                      {getStorageIcon(location.storageType)}
                      <span className="ml-1">{location.storageType.charAt(0).toUpperCase() + location.storageType.slice(1)}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expanded Site Management Section */}
            {expandedSite === site.id && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {editingSite === site.id ? (
                  /* Edit Form */
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900">Edit Site</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Storage Locations *
                        </label>
                        <button
                          type="button"
                          onClick={addEditLocation}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Location
                        </button>
                      </div>
                      
                      {editForm.locations.map((location, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            required
                            value={location.name}
                            onChange={(e) => updateEditLocation(index, 'name', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Location name"
                          />
                          <select
                            value={location.storageType}
                            onChange={(e) => updateEditLocation(index, 'storageType', e.target.value as StorageType)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Ambient">Ambient</option>
                            <option value="Chilled">Chilled</option>
                            <option value="Frozen">Frozen</option>
                          </select>
                          {editForm.locations.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEditLocation(index)}
                              className="px-3 py-2 text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setEditingSite(null)}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateSite(site.id)}
                        disabled={submitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {submitting ? 'Updating...' : 'Update Site'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Management Actions */
                  <div className="space-y-3">
                    <h4 className="text-lg font-medium text-gray-900">Site Management</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewSiteInventory(site.id, site.name);
                        }}
                        className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Inventory
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSite(site);
                        }}
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Site
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSite(site.id, site.name);
                        }}
                        className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Site
                      </button>
                    </div>

                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                      <strong>Available Actions:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• View site-specific inventory and stock levels</li>
                        <li>• Edit site details and manage storage locations</li>
                        <li>• Delete site (requires confirmation)</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {sites.length === 0 && (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No sites found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first site.
          </p>
        </div>
      )}
    </div>
  );
};

export default SiteManagement;
