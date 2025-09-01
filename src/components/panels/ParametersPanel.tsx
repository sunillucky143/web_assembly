import React, { useState } from 'react';
import { Database, Globe, Wifi, Plus, Trash2, Edit3 } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';
import { useUIState } from '../../contexts/UIStateContext';
import { Parameter, ComponentDefinition } from '../../types';

const ParametersPanel: React.FC = () => {
  const { state: projectState } = useProject();
  const { state: uiState } = useUIState();
  const [activeTab, setActiveTab] = useState<'inputs' | 'outputs' | 'apis'>('inputs');
  const [isAddingParameter, setIsAddingParameter] = useState(false);

  // Get selected node and its component
  const selectedNode = uiState.selectedNodeId 
    ? projectState.workspace.nodes[uiState.selectedNodeId]
    : null;

  const selectedComponent = selectedNode 
    ? projectState.components.find(c => c.id === selectedNode.componentId)
    : null;

  // Don't show anything if no component is selected
  if (!selectedNode || !selectedComponent) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Parameters</h3>
          <p className="text-sm text-gray-500">
            Select a component to configure its parameters
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Database size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-sm">No component selected</p>
            <p className="text-xs">Select a component from the workspace to configure its parameters</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddParameter = () => {
    setIsAddingParameter(true);
  };

  const handleSaveParameter = (parameter: Partial<Parameter>) => {
    // TODO: Implement parameter saving
    console.log('Save parameter:', parameter);
    setIsAddingParameter(false);
  };

  const handleDeleteParameter = (parameterId: string) => {
    // TODO: Implement parameter deletion
    console.log('Delete parameter:', parameterId);
  };

  const handleEditParameter = (parameterId: string) => {
    // TODO: Implement parameter editing
    console.log('Edit parameter:', parameterId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Parameters: {selectedComponent.name}
          </h3>
          <button
            onClick={handleAddParameter}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Add Parameter"
          >
            <Plus size={16} />
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Configure data connections and external integrations for {selectedComponent.name}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('inputs')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'inputs'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Database size={16} className="inline mr-2" />
          Inputs
        </button>
        <button
          onClick={() => setActiveTab('outputs')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'outputs'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Globe size={16} className="inline mr-2" />
          Outputs
        </button>
        <button
          onClick={() => setActiveTab('apis')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'apis'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Wifi size={16} className="inline mr-2" />
          APIs
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'inputs' && (
          <InputsTab
            component={selectedComponent}
            onAddParameter={handleAddParameter}
            onDeleteParameter={handleDeleteParameter}
            onEditParameter={handleEditParameter}
          />
        )}
        
        {activeTab === 'outputs' && (
          <OutputsTab
            component={selectedComponent}
            onAddParameter={handleAddParameter}
            onDeleteParameter={handleDeleteParameter}
            onEditParameter={handleEditParameter}
          />
        )}
        
        {activeTab === 'apis' && (
          <APIsTab
            component={selectedComponent}
            onAddParameter={handleAddParameter}
            onDeleteParameter={handleDeleteParameter}
            onEditParameter={handleEditParameter}
          />
        )}
      </div>

      {/* Add Parameter Modal */}
      {isAddingParameter && (
        <AddParameterModal
          onSave={handleSaveParameter}
          onCancel={() => setIsAddingParameter(false)}
          type={activeTab === 'inputs' ? 'input' : activeTab === 'outputs' ? 'output' : 'api'}
        />
      )}
    </div>
  );
};

// Inputs Tab Component - Shows component props
const InputsTab: React.FC<{
  component: ComponentDefinition;
  onAddParameter: () => void;
  onDeleteParameter: (id: string) => void;
  onEditParameter: (id: string) => void;
}> = ({ component, onAddParameter, onDeleteParameter, onEditParameter }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">Input Parameters</h4>
        <button
          onClick={onAddParameter}
          className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
        >
          Add Input
        </button>
      </div>

      {component.props.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <Database size={32} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No input parameters defined</p>
        </div>
      ) : (
        <div className="space-y-3">
          {component.props.map((prop) => (
            <ParameterCard
              key={prop.name}
              parameter={{
                id: prop.name,
                name: prop.name,
                type: 'input',
                dataType: prop.type,
                description: prop.description || prop.name,
                required: prop.required,
                defaultValue: prop.defaultValue
              }}
              onDelete={() => onDeleteParameter(prop.name)}
              onEdit={() => onEditParameter(prop.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Outputs Tab Component - Shows component events
const OutputsTab: React.FC<{
  component: ComponentDefinition;
  onAddParameter: () => void;
  onDeleteParameter: (id: string) => void;
  onEditParameter: (id: string) => void;
}> = ({ component, onAddParameter, onDeleteParameter, onEditParameter }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">Output Events</h4>
        <button
          onClick={onAddParameter}
          className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
        >
          Add Output
        </button>
      </div>

      {component.events.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <Globe size={32} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No output events defined</p>
        </div>
      ) : (
        <div className="space-y-3">
          {component.events.map((event) => (
            <ParameterCard
              key={event.name}
              parameter={{
                id: event.name,
                name: event.name,
                type: 'output',
                dataType: 'function',
                description: event.description || event.name,
                required: false,
                defaultValue: undefined
              }}
              onDelete={() => onDeleteParameter(event.name)}
              onEdit={() => onEditParameter(event.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// APIs Tab Component - Shows external API connections
const APIsTab: React.FC<{
  component: ComponentDefinition;
  onAddParameter: () => void;
  onDeleteParameter: (id: string) => void;
  onEditParameter: (id: string) => void;
}> = ({ component, onAddParameter, onDeleteParameter, onEditParameter }) => {
  // Mock API connections for now
  const mockAPIs = [
    { 
      id: '1', 
      name: 'userAPI', 
      type: 'api', 
      description: 'User management API', 
      endpoint: 'https://api.example.com/users',
      required: true 
    },
    { 
      id: '2', 
      name: 'authAPI', 
      type: 'api', 
      description: 'Authentication service', 
      endpoint: 'https://auth.example.com',
      required: true 
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">API Connections</h4>
        <button
          onClick={onAddParameter}
          className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
        >
          Add API
        </button>
      </div>

      {mockAPIs.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <Wifi size={32} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No API connections defined</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mockAPIs.map((api) => (
            <ParameterCard
              key={api.id}
              parameter={{
                id: api.id,
                name: api.name,
                type: 'api',
                dataType: 'object',
                description: api.description,
                required: api.required,
                endpoint: api.endpoint
              }}
              onDelete={() => onDeleteParameter(api.id)}
              onEdit={() => onEditParameter(api.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Parameter Card Component
const ParameterCard: React.FC<{
  parameter: any;
  onDelete: () => void;
  onEdit: () => void;
}> = ({ parameter, onDelete, onEdit }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h5 className="text-sm font-medium text-gray-900">{parameter.name}</h5>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              parameter.required 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {parameter.required ? 'Required' : 'Optional'}
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-2">{parameter.description}</p>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>Type: {parameter.type}</span>
            {parameter.endpoint && (
              <span>• Endpoint: {parameter.endpoint}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={onEdit}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="Edit Parameter"
          >
            <Edit3 size={12} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete Parameter"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Parameter Modal Component
const AddParameterModal: React.FC<{
  onSave: (parameter: Partial<Parameter>) => void;
  onCancel: () => void;
  type: 'input' | 'output' | 'api';
}> = ({ onSave, onCancel, type }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'string',
    description: '',
    required: false,
    endpoint: '',
    defaultValue: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Add {type.charAt(0).toUpperCase() + type.slice(1)} Parameter
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Parameter name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="object">Object</option>
              <option value="array">Array</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Parameter description"
            />
          </div>
          
          {type === 'api' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint</label>
              <input
                type="url"
                value={formData.endpoint}
                onChange={(e) => handleChange('endpoint', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://api.example.com/endpoint"
              />
            </div>
          )}
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="required"
              checked={formData.required}
              onChange={(e) => handleChange('required', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="required" className="ml-2 text-sm text-gray-700">
              Required parameter
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Parameter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParametersPanel;
