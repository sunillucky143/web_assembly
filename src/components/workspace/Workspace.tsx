import React, { useRef, useState, useCallback } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import { useUIState } from '../../contexts/UIStateContext';
import WorkspaceNode from './WorkspaceNode';
import WireConnection from './WireConnection';
import WorkspaceCanvas from './WorkspaceCanvas';
import { WorkspaceNode as WorkspaceNodeType, WireConnection as WireConnectionType } from '../../types';

const Workspace: React.FC = () => {
  const { state: projectState, dispatch } = useProject();
  const { state: uiState, dispatch: uiDispatch } = useUIState();
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Get current page nodes and wires
  const currentPageId = projectState.pages[0]?.id; // TODO: Implement page switching
  const currentPageNodes = Object.values(projectState.workspace.nodes).filter(
    node => node.pageId === currentPageId
  );
  const currentPageWires = Object.values(projectState.workspace.wires).filter(
    wire => {
      const sourceNode = projectState.workspace.nodes[wire.sourceNodeId];
      const targetNode = projectState.workspace.nodes[wire.targetNodeId];
      return sourceNode?.pageId === currentPageId && targetNode?.pageId === currentPageId;
    }
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!workspaceRef.current) return;

    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    try {
      const dropData = JSON.parse(data);
      
      if (dropData.type === 'component') {
        const rect = workspaceRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create new workspace node
        const newNode: WorkspaceNodeType = {
          id: `node_${Date.now()}`,
          type: 'component',
          componentId: dropData.componentId,
          position: { x, y },
          size: { width: 200, height: 100 },
          props: {},
          styles: {},
          children: [],
          pageId: currentPageId || 'default',
        };

        dispatch({ type: 'ADD_NODE', payload: newNode });
        uiDispatch({ type: 'SELECT_NODE', payload: newNode.id });
      }
    } catch (error) {
      console.error('Error parsing drop data:', error);
    }
  }, [dispatch, uiDispatch, currentPageId]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget === workspaceRef.current) {
      setIsDragging(false);
    }
  }, []);

  const handleNodeSelect = useCallback((nodeId: string) => {
    uiDispatch({ type: 'SELECT_NODE', payload: nodeId });
  }, [uiDispatch]);

  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<WorkspaceNodeType>) => {
    dispatch({ type: 'UPDATE_NODE', payload: { id: nodeId, node: updates } });
  }, [dispatch]);

  const handleNodeDelete = useCallback((nodeId: string) => {
    dispatch({ type: 'DELETE_NODE', payload: nodeId });
    if (uiState.selectedNodeId === nodeId) {
      uiDispatch({ type: 'SELECT_NODE', payload: undefined });
    }
  }, [dispatch, uiDispatch, uiState.selectedNodeId]);

  const handleWireSelect = useCallback((wireId: string) => {
    uiDispatch({ type: 'SELECT_WIRE', payload: wireId });
  }, [uiDispatch]);

  const handleWireDelete = useCallback((wireId: string) => {
    dispatch({ type: 'DELETE_WIRE', payload: wireId });
    if (uiState.selectedWireId === wireId) {
      uiDispatch({ type: 'SELECT_WIRE', payload: undefined });
    }
  }, [dispatch, uiDispatch, uiState.selectedWireId]);

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Workspace Canvas */}
      <WorkspaceCanvas
        ref={workspaceRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        isDragging={isDragging}
        zoom={uiState.zoom}
        pan={uiState.pan}
      >
        {/* Render Nodes */}
        {currentPageNodes.map((node) => (
          <WorkspaceNode
            key={node.id}
            node={node}
            component={projectState.components.find(c => c.id === node.componentId)}
            isSelected={uiState.selectedNodeId === node.id}
            isHovered={uiState.hoveredNodeId === node.id}
            onSelect={handleNodeSelect}
            onUpdate={handleNodeUpdate}
            onDelete={handleNodeDelete}
            onHover={(nodeId) => uiDispatch({ type: 'HOVER_NODE', payload: nodeId })}
          />
        ))}

        {/* Render Wires */}
        {currentPageWires.map((wire) => (
          <WireConnection
            key={wire.id}
            wire={wire}
            sourceNode={projectState.workspace.nodes[wire.sourceNodeId]}
            targetNode={projectState.workspace.nodes[wire.targetNodeId]}
            isSelected={uiState.selectedWireId === wire.id}
            onSelect={handleWireSelect}
            onDelete={handleWireDelete}
          />
        ))}
      </WorkspaceCanvas>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button
          onClick={() => uiDispatch({ type: 'SET_ZOOM', payload: uiState.zoom + 0.1 })}
          className="w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center"
        >
          <span className="text-lg font-bold">+</span>
        </button>
        <button
          onClick={() => uiDispatch({ type: 'SET_ZOOM', payload: uiState.zoom - 0.1 })}
          className="w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center"
        >
          <span className="text-lg font-bold">−</span>
        </button>
        <button
          onClick={() => uiDispatch({ type: 'RESET_VIEW' })}
          className="w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center text-xs"
        >
          Reset
        </button>
      </div>

      {/* Drop Zone Indicator */}
      {isDragging && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-30 pointer-events-none flex items-center justify-center">
          <div className="text-blue-600 text-lg font-medium">
            Drop component here
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;
