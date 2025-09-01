import React from 'react';
import { ComponentDefinition } from '../../types';

interface ComponentCardProps {
  component: ComponentDefinition;
  viewMode: 'grid' | 'list';
  onDragStart: (e: React.DragEvent) => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ component, viewMode, onDragStart }) => {
  const handleClick = () => {
    // TODO: Implement component selection
    console.log('Component selected:', component.id);
  };

  if (viewMode === 'list') {
    return (
      <div
        draggable
        onDragStart={onDragStart}
        onClick={handleClick}
        className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:shadow-sm transition-all"
      >
        {/* Thumbnail */}
        <div className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center">
          {component.thumbnail ? (
            <img src={component.thumbnail} alt={component.name} className="w-8 h-8 object-cover rounded" />
          ) : (
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
          )}
        </div>
        
        {/* Component Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{component.name}</h3>
          <p className="text-xs text-gray-500">{component.category}</p>
        </div>
        
        {/* Framework Badge */}
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
          {component.framework}
        </span>
      </div>
    );
  }

  // Grid view
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={handleClick}
      className="bg-white border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:shadow-sm transition-all overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="w-full h-20 bg-gray-100 border-b border-gray-200 flex items-center justify-center">
        {component.thumbnail ? (
          <img src={component.thumbnail} alt={component.name} className="w-16 h-16 object-cover rounded" />
        ) : (
          <div className="w-12 h-12 bg-gray-300 rounded"></div>
        )}
      </div>
      
      {/* Component Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 truncate mb-1">{component.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{component.category}</span>
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
            {component.framework}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComponentCard;
