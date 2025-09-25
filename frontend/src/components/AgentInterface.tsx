import React, { useState } from 'react';
import { Bot, Send, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { apiService } from '../services/api';

interface AgentPlan {
  plan_id: string;
  description: string;
  steps: Array<{ action: string; params: Record<string, any> }>;
  requires_confirmation: boolean;
}

const AgentInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<AgentPlan | null>(null);
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setCurrentPlan(null);
    setExecutionResult(null);

    try {
      const plan = await apiService.createAgentPlan(query);
      setCurrentPlan(plan);
    } catch (error) {
      console.error('Error creating plan:', error);
      alert('Error creating plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const executePlan = async (confirmed: boolean = false) => {
    if (!currentPlan) return;

    setExecuting(true);
    try {
      const result = await apiService.executeAgentPlan(currentPlan.plan_id, confirmed);
      setExecutionResult(result.message);
    } catch (error) {
      console.error('Error executing plan:', error);
      setExecutionResult('Error executing plan. Please try again.');
    } finally {
      setExecuting(false);
    }
  };

  const exampleQueries = [
    "Receive delivery of 50 liters of milk from FreshFoods",
    "Produce 100 portions of spaghetti bolognese",
    "Record wastage of 5kg expired chicken",
    "Transfer 20 loaves of bread to secondary school",
    "Perform inventory count in the main kitchen"
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">AI Agent</h2>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Bot className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Natural Language Commands</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe what you want to do:
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., 'Receive a delivery of 50 liters of milk from FreshFoods supplier'"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Send className="h-4 w-4 mr-2" />
            {loading ? 'Creating Plan...' : 'Create Plan'}
          </button>
        </form>
      </div>

      {currentPlan && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Execution Plan</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Description:</h4>
              <p className="text-gray-700">{currentPlan.description}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 mt-2">
                {currentPlan.steps.map((step, index) => (
                  <li key={index} className="text-gray-700">
                    <span className="font-medium">{step.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    {Object.keys(step.params).length > 0 && (
                      <div className="ml-6 mt-1 text-sm text-gray-600">
                        Parameters: {JSON.stringify(step.params, null, 2)}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="flex space-x-3 pt-4">
              {currentPlan.requires_confirmation ? (
                <>
                  <button
                    onClick={() => executePlan(true)}
                    disabled={executing}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {executing ? 'Executing...' : 'Confirm & Execute'}
                  </button>
                  <button
                    onClick={() => setCurrentPlan(null)}
                    disabled={executing}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => executePlan(false)}
                  disabled={executing}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {executing ? 'Executing...' : 'Execute'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {executionResult && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Execution Result</h3>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-800">{executionResult}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Example Commands</h3>
        <div className="space-y-2">
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => setQuery(example)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md border border-gray-200 hover:border-gray-300 transition-colors"
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentInterface;
