import React, { useRef, useState, useCallback } from 'react';
import { Trash2, Settings, Link } from 'lucide-react';
import { WorkspaceNode as WorkspaceNodeType, ComponentDefinition } from '../../types';

interface WorkspaceNodeProps {
  node: WorkspaceNodeType;
  component?: ComponentDefinition;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (nodeId: string) => void;
  onUpdate: (nodeId: string, updates: Partial<WorkspaceNodeType>) => void;
  onDelete: (nodeId: string) => void;
  onHover: (nodeId: string | undefined) => void;
}

const WorkspaceNode: React.FC<WorkspaceNodeProps> = ({
  node,
  component,
  isSelected,
  isHovered,
  onSelect,
  onUpdate,
  onDelete,
  onHover,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (e.button === 0) { // Left click only
      onSelect(node.id);
      setIsDragging(true);
      setDragStart({
        x: e.clientX - node.position.x,
        y: e.clientY - node.position.y,
      });
    }
  }, [node.id, node.position, onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && !isResizing) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      onUpdate(node.id, { position: { x: newX, y: newY } });
    }
  }, [isDragging, isResizing, dragStart, node.id, onUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const handleResizeStart = useCallback((e: React.MouseEvent, corner: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      width: node.size.width,
      height: node.size.height,
      x: e.clientX,
      y: e.clientY,
    });
  }, [node.size]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(100, resizeStart.width + deltaX);
      const newHeight = Math.max(50, resizeStart.height + deltaY);
      
      onUpdate(node.id, { size: { width: newWidth, height: newHeight } });
    }
  }, [isResizing, resizeStart, node.id, onUpdate]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(node.id);
  }, [node.id, onDelete]);

  const handleSettings = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Open component settings/configuration
    console.log('Open settings for node:', node.id);
  }, [node.id]);

  const handleWireStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Start wiring from this node
    console.log('Start wiring from node:', node.id);
  }, [node.id]);

  // Add global event listeners
  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', isDragging ? handleMouseMove : handleResizeMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', isDragging ? handleMouseMove : handleResizeMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleResizeMove, handleMouseUp]);

  // Get display values
  const displayText = node.props?.text || component?.props?.find(p => p.name === 'text')?.defaultValue || 'Component';
  const displayTitle = node.props?.title || component?.props?.find(p => p.name === 'title')?.defaultValue || component?.name || 'Unknown';
  const displayPlaceholder = node.props?.placeholder || component?.props?.find(p => p.name === 'placeholder')?.defaultValue || '';

  // Apply styles from the node
  const nodeStyles = {
    backgroundColor: node.styles?.backgroundColor || '#ffffff',
    color: node.styles?.color || '#000000',
    border: node.styles?.border || '1px solid #d1d5db',
    borderRadius: node.styles?.borderRadius || '8px',
    padding: node.styles?.padding || '16px',
    margin: node.styles?.margin || '0px',
    boxShadow: node.styles?.boxShadow || 'none',
    fontSize: node.styles?.fontSize || '14px',
    fontWeight: node.styles?.fontWeight || 'normal',
  };

  return (
    <div
      ref={nodeRef}
      className={`absolute component-node ${isSelected ? 'selected' : ''}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: node.size.width,
        height: node.size.height,
        zIndex: isSelected ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(undefined)}
    >
      {/* Node Content */}
      <div
        className={`w-full h-full rounded-lg shadow-sm transition-all ${
          isSelected
            ? 'ring-2 ring-blue-500 ring-opacity-50'
            : isHovered
            ? 'ring-1 ring-gray-400'
            : ''
        }`}
        style={nodeStyles}
      >
        {/* Component Header */}
        <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-700 truncate">
              {displayTitle}
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleWireStart}
              className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Start Wiring"
            >
              <Link size={12} />
            </button>
            <button
              onClick={handleSettings}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="Settings"
            >
              <Settings size={12} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Component Body */}
        <div className="p-3 flex-1">
          {/* Display component-specific content */}
          {component?.category === 'Buttons' && (
            <div className="text-center">
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                style={{
                  backgroundColor: node.styles?.backgroundColor || '#3b82f6',
                  color: node.styles?.color || '#ffffff',
                  borderRadius: node.styles?.borderRadius || '8px',
                  fontSize: node.styles?.fontSize || '14px',
                  fontWeight: node.styles?.fontWeight || 'normal',
                }}
              >
                {displayText}
              </button>
            </div>
          )}
          
          {component?.category === 'Forms' && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder={displayPlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                style={{
                  border: node.styles?.border || '1px solid #d1d5db',
                  borderRadius: node.styles?.borderRadius || '6px',
                  padding: node.styles?.padding || '8px 12px',
                  fontSize: node.styles?.fontSize || '14px',
                }}
                readOnly
              />
            </div>
          )}
          
          {component?.category === 'Layout' && component.name === 'Info Card' && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900" style={{ fontSize: node.styles?.fontSize || '16px' }}>
                {displayTitle}
              </h4>
              <p className="text-gray-600" style={{ fontSize: node.styles?.fontSize || '14px' }}>
                {displayText}
              </p>
            </div>
          )}
          
          {component?.category === 'Layout' && component.name === 'Flex Container' && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-xs font-medium mb-1">Flex Container</div>
                <div className="text-xs">Direction: {node.props?.direction || 'row'}</div>
              </div>
            </div>
          )}
          
          {/* Fallback for other components */}
          {!['Buttons', 'Forms', 'Layout'].includes(component?.category || '') && (
            <div className="text-center text-gray-500">
              <div className="text-sm font-medium mb-1">{displayTitle}</div>
              <div className="text-xs">{displayText}</div>
            </div>
          )}
          
          {/* Component Info */}
          <div className="mt-3 pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-1">
              {component?.category || 'No category'}
            </div>
            <div className="text-xs text-gray-400">
              {node.size.width} × {node.size.height}
            </div>
          </div>
        </div>
      </div>

      {/* Resize Handles */}
      {isSelected && (
        <>
          {/* Top-left corner */}
          <div
            className="absolute top-0 left-0 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />
          {/* Top-right corner */}
          <div
            className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize"
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          {/* Bottom-left corner */}
          <div
            className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />
          {/* Bottom-right corner */}
          <div
            className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize"
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />
        </>
      )}
    </div>
  );
};

export default WorkspaceNode;
