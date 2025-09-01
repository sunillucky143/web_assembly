import React from 'react';
import { Plus, Settings, Save, Download, Eye } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';
import { useUIState } from '../../contexts/UIStateContext';

const NavigationBar: React.FC = () => {
  const { state: projectState } = useProject();
  const { state: uiState, dispatch } = useUIState();

  const handleAddPage = () => {
    // TODO: Implement add page functionality
    console.log('Add page clicked');
  };

  const handleSaveProject = () => {
    // TODO: Implement save project functionality
    console.log('Save project clicked');
  };

  const handleExportCode = () => {
    // TODO: Implement export code functionality
    console.log('Export code clicked');
  };

  const handlePreview = () => {
    dispatch({ type: 'SET_MODE', payload: 'preview' });
  };

  const handleSettings = () => {
    // TODO: Implement settings functionality
    console.log('Settings clicked');
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left Side - Project Info */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-900">
          {projectState.currentProject?.name || 'Untitled Project'}
        </h1>
        <span className="text-sm text-gray-500">
          {projectState.currentProject?.description || 'No description'}
        </span>
      </div>

      {/* Center - Page Navigation */}
      <div className="flex items-center space-x-2">
        {projectState.pages.map((page) => (
          <button
            key={page.id}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            onClick={() => {
              // TODO: Implement page switching
              console.log('Switch to page:', page.id);
            }}
          >
            {page.name}
          </button>
        ))}
        <button
          onClick={handleAddPage}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          title="Add Page"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePreview}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          <Eye size={16} />
          <span>Preview</span>
        </button>
        
        <button
          onClick={handleSaveProject}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Save size={16} />
          <span>Save</span>
        </button>
        
        <button
          onClick={handleExportCode}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          <Download size={16} />
          <span>Export</span>
        </button>
        
        <button
          onClick={handleSettings}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          title="Settings"
        >
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;
