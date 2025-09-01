import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { UIState } from '../types';

type UIStateAction =
  | { type: 'SELECT_NODE'; payload: string | undefined }
  | { type: 'SELECT_WIRE'; payload: string | undefined }
  | { type: 'HOVER_NODE'; payload: string | undefined }
  | { type: 'SET_DRAGGING'; payload: boolean }
  | { type: 'SET_WIRING'; payload: boolean }
  | { type: 'SET_MODE'; payload: 'design' | 'code' | 'preview' }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_PAN'; payload: { x: number; y: number } }
  | { type: 'RESET_VIEW' };

const initialState: UIState = {
  selectedNodeId: undefined,
  selectedWireId: undefined,
  hoveredNodeId: undefined,
  isDragging: false,
  isWiring: false,
  mode: 'design',
  zoom: 1,
  pan: { x: 0, y: 0 },
};

const uiStateReducer = (state: UIState, action: UIStateAction): UIState => {
  switch (action.type) {
    case 'SELECT_NODE':
      return {
        ...state,
        selectedNodeId: action.payload,
        selectedWireId: undefined, // Clear wire selection when selecting node
      };
    case 'SELECT_WIRE':
      return {
        ...state,
        selectedWireId: action.payload,
        selectedNodeId: undefined, // Clear node selection when selecting wire
      };
    case 'HOVER_NODE':
      return {
        ...state,
        hoveredNodeId: action.payload,
      };
    case 'SET_DRAGGING':
      return {
        ...state,
        isDragging: action.payload,
      };
    case 'SET_WIRING':
      return {
        ...state,
        isWiring: action.payload,
      };
    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
      };
    case 'SET_ZOOM':
      return {
        ...state,
        zoom: Math.max(0.1, Math.min(3, action.payload)), // Clamp zoom between 0.1 and 3
      };
    case 'SET_PAN':
      return {
        ...state,
        pan: action.payload,
      };
    case 'RESET_VIEW':
      return {
        ...state,
        zoom: 1,
        pan: { x: 0, y: 0 },
      };
    default:
      return state;
  }
};

interface UIStateContextType {
  state: UIState;
  dispatch: React.Dispatch<UIStateAction>;
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export const useUIState = () => {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error('useUIState must be used within a UIStateProvider');
  }
  return context;
};

interface UIStateProviderProps {
  children: ReactNode;
}

export const UIStateProvider: React.FC<UIStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(uiStateReducer, initialState);

  return (
    <UIStateContext.Provider value={{ state, dispatch }}>
      {children}
    </UIStateContext.Provider>
  );
};
