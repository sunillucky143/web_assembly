import React, { useState } from 'react';
import { Search, Grid, List, Plus } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';
import ComponentCard from './ComponentCard';
import { ComponentDefinition } from '../../types';

const ComponentPalette: React.FC = () => {
  const { state } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories from components
  const categories = ['all', ...Array.from(new Set(state.components.map(comp => comp.category)))];

  // Filter components based on search and category
  const filteredComponents = state.components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddComponent = () => {
    // TODO: Implement add component functionality
    console.log('Add component clicked');
  };

  const handleComponentDragStart = (e: React.DragEvent, component: ComponentDefinition) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'component',
      componentId: component.id,
      component: component
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Components</h2>
          <button
            onClick={handleAddComponent}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Add Component"
          >
            <Plus size={16} />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="flex space-x-1 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1 rounded ${
              viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Grid View"
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1 rounded ${
              viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
            }`}
            title="List View"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredComponents.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No components found</p>
            <p className="text-sm">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-2'}>
            {filteredComponents.map((component) => (
              <ComponentCard
                key={component.id}
                component={component}
                viewMode={viewMode}
                onDragStart={(e) => handleComponentDragStart(e, component)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentPalette;
