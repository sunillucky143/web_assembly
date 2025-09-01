import React, { forwardRef, useRef, useEffect, useState } from 'react';
import { useUIState } from '../../contexts/UIStateContext';

interface WorkspaceCanvasProps {
  children: React.ReactNode;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  isDragging: boolean;
  zoom: number;
  pan: { x: number; y: number };
}

const WorkspaceCanvas = forwardRef<HTMLDivElement, WorkspaceCanvasProps>(
  ({ children, onDrop, onDragOver, onDragLeave, isDragging, zoom, pan }, ref) => {
    const { dispatch } = useUIState();
    const canvasRef = useRef<HTMLDivElement>(null);
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });

    // Combine refs
    const combinedRef = (node: HTMLDivElement) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    // Handle mouse wheel for zooming
    const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.1, Math.min(3, zoom + delta));
      
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Calculate new pan to zoom towards mouse position
        const scaleFactor = newZoom / zoom;
        const newPanX = mouseX - (mouseX - pan.x) * scaleFactor;
        const newPanY = mouseY - (mouseY - pan.y) * scaleFactor;
        
        dispatch({ type: 'SET_ZOOM', payload: newZoom });
        dispatch({ type: 'SET_PAN', payload: { x: newPanX, y: newPanY } });
      }
    };

    // Handle mouse down for panning
    const handleMouseDown = (e: React.MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle mouse or Alt+Left mouse
        e.preventDefault();
        setIsPanning(true);
        setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      }
    };

    // Handle mouse move for panning
    const handleMouseMove = (e: React.MouseEvent) => {
      if (isPanning) {
        const newPanX = e.clientX - panStart.x;
        const newPanY = e.clientY - panStart.y;
        dispatch({ type: 'SET_PAN', payload: { x: newPanX, y: newPanY } });
      }
    };

    // Handle mouse up for panning
    const handleMouseUp = () => {
      setIsPanning(false);
    };

    // Handle context menu
    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
    };

    // Update cursor style based on panning state
    useEffect(() => {
      if (canvasRef.current) {
        canvasRef.current.style.cursor = isPanning ? 'grabbing' : 'grab';
      }
    }, [isPanning]);

    // Add global mouse event listeners for panning
    useEffect(() => {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (isPanning) {
          const newPanX = e.clientX - panStart.x;
          const newPanY = e.clientY - panStart.y;
          dispatch({ type: 'SET_PAN', payload: { x: newPanX, y: newPanY } });
        }
      };

      const handleGlobalMouseUp = () => {
        setIsPanning(false);
      };

      if (isPanning) {
        document.addEventListener('mousemove', handleGlobalMouseMove);
        document.addEventListener('mouseup', handleGlobalMouseUp);
      }

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }, [isPanning, panStart, dispatch]);

    return (
      <div
        ref={combinedRef}
        className="w-full h-full relative overflow-hidden bg-gray-50"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
        style={{
          cursor: isPanning ? 'grabbing' : 'grab',
        }}
      >
        {/* Canvas Content with Transform */}
        <div
          className="absolute inset-0 origin-top-left"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Grid Background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            }}
          />

          {/* Children (Nodes and Wires) */}
          {children}
        </div>

        {/* Instructions */}
        {!isDragging && Object.keys(children as any).length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-400">
              <p className="text-lg font-medium mb-2">Welcome to your workspace!</p>
              <p className="text-sm mb-4">Drag components from the left panel to get started</p>
              <div className="flex items-center justify-center space-x-2 text-xs">
                <span>🖱️ Alt + Drag to pan</span>
                <span>•</span>
                <span>🖱️ Scroll to zoom</span>
                <span>•</span>
                <span>🖱️ Middle click to pan</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

WorkspaceCanvas.displayName = 'WorkspaceCanvas';

export default WorkspaceCanvas;
