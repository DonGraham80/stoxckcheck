import React, { useState, useEffect } from 'react';
import { ChefHat, Save } from 'lucide-react';
import { apiService } from '../services/api';
import { Recipe, Site, CreateProductionRunRequest } from '../types';

const ProductionForm: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateProductionRunRequest>({
    site_id: '',
    recipe_id: '',
    portions: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesData, sitesData] = await Promise.all([
          apiService.getRecipes(),
          apiService.getSites()
        ]);
        setRecipes(recipesData);
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
      const result = await apiService.createProductionRun(formData);
      alert(`Production run created successfully! ID: ${result.production_id}`);
      
      setFormData({
        site_id: '',
        recipe_id: '',
        portions: 0
      });
    } catch (error) {
      console.error('Error creating production run:', error);
      alert('Error creating production run. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRecipe = recipes.find(recipe => recipe.id === formData.recipe_id);

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
        <h2 className="text-3xl font-bold text-gray-900">Create Production Run</h2>
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
              Recipe
            </label>
            <select
              value={formData.recipe_id}
              onChange={(e) => setFormData(prev => ({ ...prev, recipe_id: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Recipe</option>
              {recipes.map((recipe) => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.name} (Yields {recipe.yield_portions} portions)
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedRecipe && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <ChefHat className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-blue-900">{selectedRecipe.name}</h3>
            </div>
            <p className="text-sm text-blue-700">
              Standard yield: {selectedRecipe.yield_portions} portions
            </p>
          </div>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Portions to Produce
          </label>
          <input
            type="number"
            value={formData.portions}
            onChange={(e) => setFormData(prev => ({ ...prev, portions: parseInt(e.target.value) || 0 }))}
            className="w-full md:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="1"
            placeholder="Enter number of portions"
          />
          {selectedRecipe && formData.portions > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Scaling factor: {(formData.portions / selectedRecipe.yield_portions).toFixed(2)}x
            </p>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {submitting ? 'Creating...' : 'Create Production Run'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductionForm;
