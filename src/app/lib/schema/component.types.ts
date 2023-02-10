export interface DataNode {
  id?: string;
  nodeTypeId: string;
  label: string;
  children: DataNode[];
}

export interface DataNodeType {
  id?: string;
  label: string;
  icon: string;
}

export interface DataEdge {
  id?: string;
  label: string;
  source: string;
  target: string;
}

