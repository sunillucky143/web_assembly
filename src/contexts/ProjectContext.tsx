import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Project, ComponentDefinition, Page, WorkspaceNode, WireConnection } from '../types';

interface ProjectState {
  currentProject: Project | null;
  components: ComponentDefinition[];
  pages: Page[];
  workspace: {
    nodes: Record<string, WorkspaceNode>;
    wires: Record<string, WireConnection>;
  };
}

type ProjectAction =
  | { type: 'SET_PROJECT'; payload: Project }
  | { type: 'ADD_COMPONENT'; payload: ComponentDefinition }
  | { type: 'UPDATE_COMPONENT'; payload: { id: string; component: Partial<ComponentDefinition> } }
  | { type: 'DELETE_COMPONENT'; payload: string }
  | { type: 'ADD_PAGE'; payload: Page }
  | { type: 'UPDATE_PAGE'; payload: { id: string; page: Partial<Page> } }
  | { type: 'DELETE_PAGE'; payload: string }
  | { type: 'ADD_NODE'; payload: WorkspaceNode }
  | { type: 'UPDATE_NODE'; payload: { id: string; node: Partial<WorkspaceNode> } }
  | { type: 'DELETE_NODE'; payload: string }
  | { type: 'ADD_WIRE'; payload: WireConnection }
  | { type: 'UPDATE_WIRE'; payload: { id: string; wire: Partial<WireConnection> } }
  | { type: 'DELETE_WIRE'; payload: string };

const initialState: ProjectState = {
  currentProject: null,
  components: [],
  pages: [],
  workspace: {
    nodes: {},
    wires: {},
  },
};

const projectReducer = (state: ProjectState, action: ProjectAction): ProjectState => {
  switch (action.type) {
    case 'SET_PROJECT':
      return {
        ...state,
        currentProject: action.payload,
        components: action.payload.components,
        pages: action.payload.pages,
        workspace: action.payload.workspace,
      };
    case 'ADD_COMPONENT':
      return {
        ...state,
        components: [...state.components, action.payload],
      };
    case 'UPDATE_COMPONENT':
      return {
        ...state,
        components: state.components.map(comp =>
          comp.id === action.payload.id ? { ...comp, ...action.payload.component } : comp
        ),
      };
    case 'DELETE_COMPONENT':
      return {
        ...state,
        components: state.components.filter(comp => comp.id !== action.payload),
      };
    case 'ADD_PAGE':
      return {
        ...state,
        pages: [...state.pages, action.payload],
      };
    case 'UPDATE_PAGE':
      return {
        ...state,
        pages: state.pages.map(page =>
          page.id === action.payload.id ? { ...page, ...action.payload.page } : page
        ),
      };
    case 'DELETE_PAGE':
      return {
        ...state,
        pages: state.pages.filter(page => page.id !== action.payload),
      };
    case 'ADD_NODE':
      return {
        ...state,
        workspace: {
          ...state.workspace,
          nodes: { ...state.workspace.nodes, [action.payload.id]: action.payload },
        },
      };
    case 'UPDATE_NODE':
      return {
        ...state,
        workspace: {
          ...state.workspace,
          nodes: {
            ...state.workspace.nodes,
            [action.payload.id]: { ...state.workspace.nodes[action.payload.id], ...action.payload.node },
          },
        },
      };
    case 'DELETE_NODE':
      const { [action.payload]: deletedNode, ...remainingNodes } = state.workspace.nodes;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          nodes: remainingNodes,
        },
      };
    case 'ADD_WIRE':
      return {
        ...state,
        workspace: {
          ...state.workspace,
          wires: { ...state.workspace.wires, [action.payload.id]: action.payload },
        },
      };
    case 'UPDATE_WIRE':
      return {
        ...state,
        workspace: {
          ...state.workspace,
          wires: {
            ...state.workspace.wires,
            [action.payload.id]: { ...state.workspace.wires[action.payload.id], ...action.payload.wire },
          },
        },
      };
    case 'DELETE_WIRE':
      const { [action.payload]: deletedWire, ...remainingWires } = state.workspace.wires;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          wires: remainingWires,
        },
      };
    default:
      return state;
  }
};

interface ProjectContextType {
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // Sample components
  const sampleComponents: ComponentDefinition[] = [
    {
      id: 'button-1',
      name: 'Primary Button',
      category: 'Buttons',
      framework: 'react',
      props: [
        { name: 'text', type: 'string', defaultValue: 'Click me', required: true, description: 'Button text' },
        { name: 'variant', type: 'string', defaultValue: 'primary', required: false, description: 'Button style variant' },
        { name: 'size', type: 'string', defaultValue: 'medium', required: false, description: 'Button size' },
        { name: 'disabled', type: 'boolean', defaultValue: false, required: false, description: 'Is button disabled' }
      ],
      events: [
        { name: 'onClick', payload: 'event', description: 'Fired when button is clicked' },
        { name: 'onHover', payload: 'event', description: 'Fired when mouse hovers over button' }
      ],
      styles: [
        { property: 'backgroundColor', value: '#3b82f6', type: 'static' },
        { property: 'color', value: '#ffffff', type: 'static' },
        { property: 'borderRadius', value: '8px', type: 'static' }
      ],
      code: '<button className="btn btn-primary">{text}</button>',
      thumbnail: undefined
    },
    {
      id: 'input-1',
      name: 'Text Input',
      category: 'Forms',
      framework: 'react',
      props: [
        { name: 'placeholder', type: 'string', defaultValue: 'Enter text...', required: false, description: 'Input placeholder' },
        { name: 'type', type: 'string', defaultValue: 'text', required: false, description: 'Input type' },
        { name: 'required', type: 'boolean', defaultValue: false, required: false, description: 'Is input required' },
        { name: 'maxLength', type: 'number', defaultValue: 100, required: false, description: 'Maximum input length' }
      ],
      events: [
        { name: 'onChange', payload: 'value', description: 'Fired when input value changes' },
        { name: 'onFocus', payload: 'event', description: 'Fired when input gains focus' },
        { name: 'onBlur', payload: 'event', description: 'Fired when input loses focus' }
      ],
      styles: [
        { property: 'border', value: '1px solid #d1d5db', type: 'static' },
        { property: 'borderRadius', value: '6px', type: 'static' },
        { property: 'padding', value: '8px 12px', type: 'static' }
      ],
      code: '<input type={type} placeholder={placeholder} required={required} maxLength={maxLength} />',
      thumbnail: undefined
    },
    {
      id: 'card-1',
      name: 'Info Card',
      category: 'Layout',
      framework: 'react',
      props: [
        { name: 'title', type: 'string', defaultValue: 'Card Title', required: true, description: 'Card title text' },
        { name: 'content', type: 'string', defaultValue: 'Card content goes here...', required: true, description: 'Card content text' },
        { name: 'showShadow', type: 'boolean', defaultValue: true, required: false, description: 'Show card shadow' }
      ],
      events: [
        { name: 'onClick', payload: 'event', description: 'Fired when card is clicked' }
      ],
      styles: [
        { property: 'backgroundColor', value: '#ffffff', type: 'static' },
        { property: 'borderRadius', value: '12px', type: 'static' },
        { property: 'padding', value: '20px', type: 'static' }
      ],
      code: '<div className="card">{title} {content}</div>',
      thumbnail: undefined
    },
    {
      id: 'container-1',
      name: 'Flex Container',
      category: 'Layout',
      framework: 'react',
      props: [
        { name: 'direction', type: 'string', defaultValue: 'row', required: false, description: 'Flex direction' },
        { name: 'justify', type: 'string', defaultValue: 'flex-start', required: false, description: 'Justify content' },
        { name: 'align', type: 'string', defaultValue: 'stretch', required: false, description: 'Align items' },
        { name: 'gap', type: 'number', defaultValue: 16, required: false, description: 'Gap between items' }
      ],
      events: [],
      styles: [
        { property: 'display', value: 'flex', type: 'static' },
        { property: 'padding', value: '16px', type: 'static' },
        { property: 'backgroundColor', value: '#f8fafc', type: 'static' }
      ],
      code: '<div className="flex-container">{children}</div>',
      thumbnail: undefined
    }
  ];

  // Sample pages
  const samplePages: Page[] = [
    {
      id: 'page-1',
      name: 'Home',
      nodes: ['node-1', 'node-2', 'node-3'],
      wires: [],
      layout: 'vertical',
      scrollDirection: 'vertical'
    }
  ];

  // Sample workspace nodes
  const sampleNodes: Record<string, WorkspaceNode> = {
    'node-1': {
      id: 'node-1',
      type: 'component',
      componentId: 'button-1',
      position: { x: 100, y: 100 },
      size: { width: 200, height: 120 },
      props: { text: 'Click me!' },
      styles: { backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '8px' },
      children: [],
      pageId: 'page-1',
    },
    'node-2': {
      id: 'node-2',
      type: 'component',
      componentId: 'input-1',
      position: { x: 350, y: 100 },
      size: { width: 250, height: 120 },
      props: { placeholder: 'Enter your name...', type: 'text' },
      styles: { border: '2px solid #3b82f6', borderRadius: '8px', padding: '12px' },
      children: [],
      pageId: 'page-1',
    },
    'node-3': {
      id: 'node-3',
      type: 'component',
      componentId: 'card-1',
      position: { x: 100, y: 280 },
      size: { width: 300, height: 150 },
      props: { title: 'Welcome!', content: 'This is a sample card component.' },
      styles: { backgroundColor: '#f8fafc', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
      children: [],
      pageId: 'page-1',
    },
  };

  // Initialize with sample data
  React.useEffect(() => {
    if (state.components.length === 0) {
      dispatch({ type: 'SET_PROJECT', payload: {
        id: 'project-1',
        name: 'Sample Project',
        description: 'A sample project to test the visual frontend platform',
        pages: samplePages,
        components: sampleComponents,
        workspace: {
          nodes: sampleNodes,
          wires: {}
        },
        settings: {
          framework: 'react',
          buildTool: 'vite',
          cssFramework: 'tailwind',
          outputFormat: 'tsx'
        }
      }});
    }
  }, []);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};
