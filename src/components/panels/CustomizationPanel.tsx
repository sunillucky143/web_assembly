import React, { useState } from 'react';
import { Palette, Type, Ruler, Eye } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';
import { useUIState } from '../../contexts/UIStateContext';
// CustomizationOption not currently used

const CustomizationPanel: React.FC = () => {
  const { state: projectState, dispatch } = useProject();
  const { state: uiState } = useUIState();
  const [activeTab, setActiveTab] = useState<'style' | 'layout' | 'content'>('style');

  // Get selected node
  const selectedNode = uiState.selectedNodeId 
    ? projectState.workspace.nodes[uiState.selectedNodeId]
    : null;

  const selectedComponent = selectedNode 
    ? projectState.components.find(c => c.id === selectedNode.componentId)
    : null;

  const handleStyleChange = (property: string, value: string) => {
    if (!selectedNode) return;
    
    // Update the node's styles
    const updatedStyles = {
      ...selectedNode.styles,
      [property]: value
    };
    
    dispatch({
      type: 'UPDATE_NODE',
      payload: {
        id: selectedNode.id,
        node: { styles: updatedStyles }
      }
    });
  };

  const handleLayoutChange = (property: string, value: string) => {
    if (!selectedNode) return;
    
    if (property === 'width' || property === 'height') {
      // Update size
      const updatedSize = {
        ...selectedNode.size,
        [property]: parseInt(value) || 0
      };
      
      dispatch({
        type: 'UPDATE_NODE',
        payload: {
          id: selectedNode.id,
          node: { size: updatedSize }
        }
      });
    } else if (property === 'x' || property === 'y') {
      // Update position
      const updatedPosition = {
        ...selectedNode.position,
        [property]: parseInt(value) || 0
      };
      
      dispatch({
        type: 'UPDATE_NODE',
        payload: {
          id: selectedNode.id,
          node: { position: updatedPosition }
        }
      });
    } else {
      // Update other layout properties in styles
      const updatedStyles = {
        ...selectedNode.styles,
        [property]: value
      };
      
      dispatch({
        type: 'UPDATE_NODE',
        payload: {
          id: selectedNode.id,
          node: { styles: updatedStyles }
        }
      });
    }
  };

  const handleContentChange = (property: string, value: string) => {
    if (!selectedNode) return;
    
    // Update the node's props
    const updatedProps = {
      ...selectedNode.props,
      [property]: value
    };
    
    dispatch({
      type: 'UPDATE_NODE',
      payload: {
        id: selectedNode.id,
        node: { props: updatedProps }
      }
    });
  };

  if (!selectedNode || !selectedComponent) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Eye size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-sm">Select a component to customize</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Customize: {selectedComponent.name}
        </h3>
        <p className="text-sm text-gray-500">
          Modify the appearance and behavior of this component
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'style'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Palette size={16} className="inline mr-2" />
          Style
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'layout'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Ruler size={16} className="inline mr-2" />
          Layout
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'content'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Type size={16} className="inline mr-2" />
          Content
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'style' && (
          <StyleTab
            node={selectedNode}
            component={selectedComponent}
            onChange={handleStyleChange}
          />
        )}
        
        {activeTab === 'layout' && (
          <LayoutTab
            node={selectedNode}
            onChange={handleLayoutChange}
          />
        )}
        
        {activeTab === 'content' && (
          <ContentTab
            node={selectedNode}
            component={selectedComponent}
            onChange={handleContentChange}
          />
        )}
      </div>
    </div>
  );
};

// Style Tab Component
const StyleTab: React.FC<{
  node: any;
  component: any;
  onChange: (property: string, value: string) => void;
}> = ({ node, onChange }) => {
  const [colorValue, setColorValue] = useState(node.styles?.backgroundColor || '#3b82f6');
  const [borderRadius, setBorderRadius] = useState(node.styles?.borderRadius?.replace('px', '') || '8');
  const [shadow, setShadow] = useState(node.styles?.boxShadow || 'none');

  return (
    <div className="space-y-6">
      {/* Colors */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Colors</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Background Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={colorValue}
                onChange={(e) => {
                  setColorValue(e.target.value);
                  onChange('backgroundColor', e.target.value);
                }}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={colorValue}
                onChange={(e) => {
                  setColorValue(e.target.value);
                  onChange('backgroundColor', e.target.value);
                }}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                placeholder="#000000"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Text Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={node.styles?.color || '#000000'}
                onChange={(e) => onChange('color', e.target.value)}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={node.styles?.color || '#000000'}
                onChange={(e) => onChange('color', e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Borders */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Borders</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Border Radius</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="50"
                value={borderRadius}
                onChange={(e) => {
                  setBorderRadius(e.target.value);
                  onChange('borderRadius', `${e.target.value}px`);
                }}
                className="flex-1"
              />
              <span className="text-xs text-gray-500 w-8">{borderRadius}px</span>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Border Width</label>
            <select
              value={node.styles?.borderWidth || '0'}
              onChange={(e) => onChange('borderWidth', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            >
              <option value="0">None</option>
              <option value="1px">1px</option>
              <option value="2px">2px</option>
              <option value="3px">3px</option>
              <option value="4px">4px</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shadows */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Shadows</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Box Shadow</label>
            <select
              value={shadow}
              onChange={(e) => {
                setShadow(e.target.value);
                onChange('boxShadow', e.target.value);
              }}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            >
              <option value="none">None</option>
              <option value="0 1px 3px rgba(0,0,0,0.12)">Small</option>
              <option value="0 4px 6px rgba(0,0,0,0.1)">Medium</option>
              <option value="0 10px 25px rgba(0,0,0,0.15)">Large</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// Layout Tab Component
const LayoutTab: React.FC<{
  node: any;
  onChange: (property: string, value: string) => void;
}> = ({ node, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Dimensions */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Dimensions</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Width</label>
            <input
              type="number"
              value={node.size.width}
              onChange={(e) => onChange('width', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="Width"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Height</label>
            <input
              type="number"
              value={node.size.height}
              onChange={(e) => onChange('height', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="Height"
            />
          </div>
        </div>
      </div>

      {/* Position */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Position</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">X</label>
            <input
              type="number"
              value={node.position.x}
              onChange={(e) => onChange('x', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="X position"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Y</label>
            <input
              type="number"
              value={node.position.y}
              onChange={(e) => onChange('y', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="Y position"
            />
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Spacing</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Padding</label>
            <input
              type="text"
              value={node.styles?.padding || '16px'}
              onChange={(e) => onChange('padding', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="16px"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Margin</label>
            <input
              type="text"
              value={node.styles?.margin || '0px'}
              onChange={(e) => onChange('margin', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="0px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Content Tab Component
const ContentTab: React.FC<{
  node: any;
  component: any;
  onChange: (property: string, value: string) => void;
}> = ({ node, component, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Text Content */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Text Content</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Text</label>
            <input
              type="text"
              value={node.props?.text || 'Component Text'}
              onChange={(e) => onChange('text', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              placeholder="Enter text content"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Font Size</label>
            <select
              value={node.styles?.fontSize || '16px'}
              onChange={(e) => onChange('fontSize', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            >
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="18px">18px</option>
              <option value="20px">20px</option>
              <option value="24px">24px</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Font Weight</label>
            <select
              value={node.styles?.fontWeight || 'normal'}
              onChange={(e) => onChange('fontWeight', e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="600">Semi-bold</option>
              <option value="300">Light</option>
            </select>
          </div>
        </div>
      </div>

      {/* Component Props */}
      {component?.props && component.props.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Component Properties</h4>
          <div className="space-y-3">
            {component.props.map((prop: any) => (
              <div key={prop.name}>
                <label className="block text-xs text-gray-600 mb-1">{prop.name}</label>
                <input
                  type={prop.type === 'number' ? 'number' : 'text'}
                  value={node.props?.[prop.name] || prop.defaultValue || ''}
                  onChange={(e) => onChange(prop.name, e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  placeholder={prop.description || prop.name}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizationPanel;
