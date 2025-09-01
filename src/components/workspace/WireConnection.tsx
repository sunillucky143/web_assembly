import React, { useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import { WireConnection as WireConnectionType, WorkspaceNode as WorkspaceNodeType } from '../../types';

interface WireConnectionProps {
  wire: WireConnectionType;
  sourceNode?: WorkspaceNodeType;
  targetNode?: WorkspaceNodeType;
  isSelected: boolean;
  onSelect: (wireId: string) => void;
  onDelete: (wireId: string) => void;
}

const WireConnection: React.FC<WireConnectionProps> = ({
  wire,
  sourceNode,
  targetNode,
  isSelected,
  onSelect,
  onDelete,
}) => {
  // Calculate wire path
  const wirePath = useMemo(() => {
    if (!sourceNode || !targetNode) return '';

    const sourceCenter = {
      x: sourceNode.position.x + sourceNode.size.width / 2,
      y: sourceNode.position.y + sourceNode.size.height / 2,
    };

    const targetCenter = {
      x: targetNode.position.x + targetNode.size.width / 2,
      y: targetNode.position.y + targetNode.size.height / 2,
    };

    // Calculate control points for a curved line
    const dx = targetCenter.x - sourceCenter.x;
    const dy = targetCenter.y - sourceCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Create a curved path with control points
    const controlPoint1 = {
      x: sourceCenter.x + distance * 0.25,
      y: sourceCenter.y,
    };
    
    const controlPoint2 = {
      x: targetCenter.x - distance * 0.25,
      y: targetCenter.y,
    };

    return `M ${sourceCenter.x} ${sourceCenter.y} C ${controlPoint1.x} ${controlPoint1.y} ${controlPoint2.x} ${controlPoint2.y} ${targetCenter.x} ${targetCenter.y}`;
  }, [sourceNode, targetNode]);

  // Calculate wire center for label positioning
  const wireCenter = useMemo(() => {
    if (!sourceNode || !targetNode) return { x: 0, y: 0 };

    const sourceCenter = {
      x: sourceNode.position.x + sourceNode.size.width / 2,
      y: sourceNode.position.y + sourceNode.size.height / 2,
    };

    const targetCenter = {
      x: targetNode.position.x + targetNode.size.width / 2,
      y: targetNode.position.y + targetNode.size.height / 2,
    };

    return {
      x: (sourceCenter.x + targetCenter.x) / 2,
      y: (sourceCenter.y + targetCenter.y) / 2,
    };
  }, [sourceNode, targetNode]);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(wire.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(wire.id);
  };

  return (
    <g className="wire-connection-group">
      {/* Wire Path */}
      <path
        d={wirePath}
        className={`wire-connection ${isSelected ? 'stroke-blue-600 stroke-3' : 'stroke-blue-500 stroke-2'}`}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      />

      {/* Wire Label */}
      <g transform={`translate(${wireCenter.x}, ${wireCenter.y})`}>
        {/* Label Background */}
        <rect
          x="-30"
          y="-12"
          width="60"
          height="24"
          rx="12"
          fill="white"
          stroke={isSelected ? '#2563eb' : '#3b82f6'}
          strokeWidth="2"
          className="cursor-pointer"
          onClick={handleClick}
        />
        
        {/* Label Text */}
        <text
          x="0"
          y="4"
          textAnchor="middle"
          className="text-xs font-medium fill-gray-700 pointer-events-none"
        >
          {wire.sourceEvent} → {wire.targetAction}
        </text>
      </g>

      {/* Delete Button (only when selected) */}
      {isSelected && (
        <g transform={`translate(${wireCenter.x + 40}, ${wireCenter.y - 20})`}>
          {/* Delete Button Background */}
          <circle
            r="12"
            fill="#ef4444"
            className="cursor-pointer"
            onClick={handleDelete}
          />
          
          {/* Delete Icon */}
          <g transform="translate(-6, -6)">
            <Trash2 size={12} className="fill-white" />
          </g>
        </g>
      )}

      {/* Connection Points */}
      {isSelected && (
        <>
          {/* Source Connection Point */}
          <circle
            cx={sourceNode.position.x + sourceNode.size.width / 2}
            cy={sourceNode.position.y + sourceNode.size.height / 2}
            r="4"
            fill="#3b82f6"
            stroke="white"
            strokeWidth="2"
          />
          
          {/* Target Connection Point */}
          <circle
            cx={targetNode.position.x + targetNode.size.width / 2}
            cy={targetNode.position.y + targetNode.size.height / 2}
            r="4"
            fill="#3b82f6"
            stroke="white"
            strokeWidth="2"
          />
        </>
      )}
    </g>
  );
};

export default WireConnection;
