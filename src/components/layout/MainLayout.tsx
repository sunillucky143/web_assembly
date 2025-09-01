import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ComponentPalette from '../palette/ComponentPalette';
import Workspace from '../workspace/Workspace';
import CustomizationPanel from '../panels/CustomizationPanel';
import ParametersPanel from '../panels/ParametersPanel';
import NavigationBar from './NavigationBar';
// import { useUIState } from '../../contexts/UIStateContext';

const MainLayout: React.FC = () => {
  // UI state available for future use
  // const { state } = useUIState();
  
  // Panel width states
  const [leftPanelWidth, setLeftPanelWidth] = useState(256);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  
  // Panel visibility states
  const [isLeftPanelVisible, setIsLeftPanelVisible] = useState(true);
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);
  
  // Resize states
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  
  // Refs for resize handles
  const leftResizeRef = useRef<HTMLDivElement>(null);
  const rightResizeRef = useRef<HTMLDivElement>(null);

  // Store original widths for restoration
  const [originalLeftWidth, setOriginalLeftWidth] = useState(256);
  const [originalRightWidth, setOriginalRightWidth] = useState(320);

  // Toggle left panel visibility
  const toggleLeftPanel = () => {
    if (isLeftPanelVisible) {
      setOriginalLeftWidth(leftPanelWidth);
      setIsLeftPanelVisible(false);
      setLeftPanelWidth(0);
    } else {
      setIsLeftPanelVisible(true);
      setLeftPanelWidth(originalLeftWidth);
    }
  };

  // Toggle right panel visibility
  const toggleRightPanel = () => {
    if (isRightPanelVisible) {
      setOriginalRightWidth(rightPanelWidth);
      setIsRightPanelVisible(false);
      setRightPanelWidth(0);
    } else {
      setIsRightPanelVisible(true);
      setRightPanelWidth(originalRightWidth);
    }
  };

  // Left panel resize handlers
  const handleLeftResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingLeft(true);
  }, []);

  const handleLeftResizeMove = useCallback((e: MouseEvent) => {
    if (isResizingLeft) {
      const newWidth = Math.max(200, Math.min(400, e.clientX));
      setLeftPanelWidth(newWidth);
      if (isLeftPanelVisible) {
        setOriginalLeftWidth(newWidth);
      }
    }
  }, [isResizingLeft, isLeftPanelVisible]);

  const handleLeftResizeEnd = useCallback(() => {
    setIsResizingLeft(false);
  }, []);

  // Right panel resize handlers
  const handleRightResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingRight(true);
  }, []);

  const handleRightResizeMove = useCallback((e: MouseEvent) => {
    if (isResizingRight) {
      const newWidth = Math.max(250, Math.min(500, window.innerWidth - e.clientX));
      setRightPanelWidth(newWidth);
      if (isRightPanelVisible) {
        setOriginalRightWidth(newWidth);
      }
    }
  }, [isResizingRight, isRightPanelVisible]);

  const handleRightResizeEnd = useCallback(() => {
    setIsResizingRight(false);
  }, []);

  // Global mouse event listeners for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        handleLeftResizeMove(e);
      } else if (isResizingRight) {
        handleRightResizeMove(e);
      }
    };

    const handleMouseUp = () => {
      if (isResizingLeft) {
        handleLeftResizeEnd();
      } else if (isResizingRight) {
        handleRightResizeEnd();
      }
    };

    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight, handleLeftResizeMove, handleRightResizeMove, handleLeftResizeEnd, handleRightResizeEnd]);

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <div className="h-16 bg-white border-b border-gray-200 flex-shrink-0">
        <NavigationBar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Component Palette */}
        <div 
          className="bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out relative"
          style={{ width: `${leftPanelWidth}px` }}
        >
          <ComponentPalette />
          
          {/* Minimize/Expand Button for Left Panel */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20">
            <button
              onClick={toggleLeftPanel}
              className={`w-6 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg shadow-lg transition-all duration-200 flex items-center justify-center ${
                isLeftPanelVisible ? 'opacity-100' : 'opacity-60'
              }`}
              title={isLeftPanelVisible ? "Minimize left panel" : "Expand left panel"}
            >
              {isLeftPanelVisible ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        </div>

        {/* Left Resize Handle */}
        {isLeftPanelVisible && (
          <div
            ref={leftResizeRef}
            className={`w-2 bg-gray-200 hover:bg-blue-400 cursor-col-resize transition-all duration-200 ${
              isResizingLeft ? 'bg-blue-500' : ''
            }`}
            onMouseDown={handleLeftResizeStart}
            title="Drag to resize left panel"
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-0.5 h-8 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        )}
        
        {/* Center - Workspace */}
        <div className="flex-1 flex flex-col min-w-0">
          <Workspace />
        </div>
        
        {/* Right Resize Handle */}
        {isRightPanelVisible && (
          <div
            ref={rightResizeRef}
            className={`w-2 bg-gray-200 hover:bg-blue-400 cursor-col-resize transition-all duration-200 ${
              isResizingRight ? 'bg-blue-500' : ''
            }`}
            onMouseDown={handleRightResizeStart}
            title="Drag to resize right panel"
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-0.5 h-8 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        )}

        {/* Right Panel - Customization and Parameters */}
        <div 
          className="bg-white border-l border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out relative"
          style={{ width: `${rightPanelWidth}px` }}
        >
          <div className="h-full flex flex-col">
            <CustomizationPanel />
            <div className="border-t border-gray-200">
              <ParametersPanel />
            </div>
          </div>
          
          {/* Minimize/Expand Button for Right Panel */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20">
            <button
              onClick={toggleRightPanel}
              className={`w-6 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-l-lg shadow-lg transition-all duration-200 flex items-center justify-center ${
                isRightPanelVisible ? 'opacity-100' : 'opacity-60'
              }`}
              title={isRightPanelVisible ? "Minimize right panel" : "Expand right panel"}
            >
              {isRightPanelVisible ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
