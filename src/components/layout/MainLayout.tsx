import React from 'react';
import Workspace from '../workspace/Workspace';
import ComponentPalette from '../palette/ComponentPalette';
import CustomizationPanel from '../panels/CustomizationPanel';
import ParametersPanel from '../panels/ParametersPanel';
import NavigationBar from './NavigationBar';
import { useUIState } from '../../contexts/UIStateContext';

const MainLayout: React.FC = () => {
  const { state } = useUIState();

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Top Navigation Bar */}
      <NavigationBar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Component Palette */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <ComponentPalette />
        </div>
        
        {/* Center - Workspace */}
        <div className="flex-1 flex flex-col">
          <Workspace />
        </div>
        
        {/* Right Sidebar - Panels */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Mode Toggle */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex space-x-2">
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  state.mode === 'design'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => {/* TODO: Implement mode toggle */}}
              >
                Design
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  state.mode === 'code'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => {/* TODO: Implement mode toggle */}}
              >
                Code
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  state.mode === 'preview'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => {/* TODO: Implement mode toggle */}}
              >
                Preview
              </button>
            </div>
          </div>
          
          {/* Customization Panel */}
          <div className="flex-1 overflow-y-auto">
            <CustomizationPanel />
          </div>
          
          {/* Parameters Panel */}
          <div className="border-t border-gray-200">
            <ParametersPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
