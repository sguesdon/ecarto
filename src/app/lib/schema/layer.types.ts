import {DataEdge} from './component.types';

export interface Layer {
  id?: string;
  label: string;
  defaultMode: 'show' | 'hide';
  nodes: Omit<Node, 'nodes' & 'edges'>[];
  edges: DataEdge[];
}
