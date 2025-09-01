// Component Types
export interface ComponentDefinition {
  id: string;
  name: string;
  category: string;
  framework: 'react' | 'vue' | 'angular' | 'vanilla';
  props: ComponentProp[];
  events: ComponentEvent[];
  styles: StyleDefinition[];
  code: string;
  thumbnail?: string;
}

export interface ComponentProp {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function';
  defaultValue?: any;
  required: boolean;
  description?: string;
}

export interface ComponentEvent {
  name: string;
  payload?: any;
  description?: string;
}

export interface StyleDefinition {
  property: string;
  value: string;
  type: 'static' | 'dynamic' | 'conditional';
  condition?: string;
}

// Workspace Types
export interface WorkspaceNode {
  id: string;
  type: 'component' | 'container' | 'page';
  componentId?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  props: Record<string, any>;
  styles: Record<string, any>;
  children: string[];
  parent?: string;
  pageId: string;
}

export interface WireConnection {
  id: string;
  sourceNodeId: string;
  sourceEvent: string;
  targetNodeId: string;
  targetAction: string;
  condition?: string;
  transform?: string;
}

export interface Page {
  id: string;
  name: string;
  nodes: string[];
  wires: string[];
  layout: 'horizontal' | 'vertical' | 'grid';
  scrollDirection: 'horizontal' | 'vertical';
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  pages: Page[];
  components: ComponentDefinition[];
  workspace: {
    nodes: Record<string, WorkspaceNode>;
    wires: Record<string, WireConnection>;
  };
  settings: ProjectSettings;
}

export interface ProjectSettings {
  framework: 'react' | 'vue' | 'angular' | 'vanilla';
  buildTool: 'vite' | 'webpack' | 'parcel';
  cssFramework: 'tailwind' | 'bootstrap' | 'material-ui' | 'custom';
  outputFormat: 'jsx' | 'tsx' | 'vue' | 'html';
}

// UI State Types
export interface UIState {
  selectedNodeId?: string;
  selectedWireId?: string;
  hoveredNodeId?: string;
  isDragging: boolean;
  isWiring: boolean;
  mode: 'design' | 'code' | 'preview';
  zoom: number;
  pan: { x: number; y: number };
}

// Action Types
export interface Action {
  type: string;
  payload: any;
}

// Customization Types
export interface CustomizationOption {
  type: 'color' | 'text' | 'size' | 'spacing' | 'border' | 'shadow';
  property: string;
  label: string;
  value: any;
  options?: any[];
}

// Parameter Types
export interface Parameter {
  id: string;
  name: string;
  type: 'input' | 'output' | 'api' | 'database' | 'websocket';
  dataType: 'string' | 'number' | 'boolean' | 'object' | 'array';
  defaultValue?: any;
  required: boolean;
  description?: string;
  endpoint?: string;
  headers?: Record<string, string>;
}
