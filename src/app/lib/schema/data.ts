import { Layer } from './layer.types';
import {DataNodeType, DataNode, DataEdge} from './component.types';

export const layers: Layer[] = [
  {
    id: 'layer1',
    label: 'layer1',
    defaultMode: 'show',
    nodes: [],
    edges: []
  },
  {
    id: 'layer2',
    label: 'layer2',
    defaultMode: 'show',
    nodes: [],
    edges: []
  }
]

export const nodeTypes: DataNodeType[] = [
  {
    id: 'org',
    label: 'Organization',
    icon: 'home'
  },
  {
    id: 'department',
    label: 'Department',
    icon: 'table'
  },
  {
    id: 'application',
    label: 'Application',
    icon: 'th-large'
  },
  {
    id: 'component',
    label: 'Component',
    icon: ''
  }
];

export const nodes: DataNode = {
    id: 'root',
    label: 'root',
    nodeTypeId: 'org',
    children: [
      {
        id: 'hm',
        label: 'HM',
        nodeTypeId: 'org',
        children: [
          {
            id: 'dec',
            label: 'DEC',
            nodeTypeId: 'department',
            children: [
              {
                id: 'datahub',
                label: 'Datahub',
                nodeTypeId: 'application',
                children: [
                  {
                    id: 'api_client',
                    label: 'api client',
                    nodeTypeId: 'component',
                    children: []
                  },
                  {
                    id: 'api_interactions',
                    label: 'api intéractions',
                    nodeTypeId: 'component',
                    children: []
                  }
                ]
              }
            ]
          },
          {
            id: 'dgm',
            label: 'DGM',
            nodeTypeId: 'department',
            children: [
              {
                id: 'interactions',
                label: 'Intéractions',
                nodeTypeId: 'application',
                children: [
                  {
                    id: 'jms-interactions',
                    label: 'Jms intéractions',
                    nodeTypeId: 'component',
                    children: []
                  },
                  {
                    id: 'batch-interactions',
                    label: 'Batch intéractions',
                    nodeTypeId: 'component',
                    children: []
                  }
                ]
              },
              {
                id: 'hmdrive',
                label: 'HMDRIVE',
                nodeTypeId: 'application',
                children: [
                  {
                    id: 'hmdrive_api_injection',
                    label: 'api injection',
                    nodeTypeId: 'component',
                    children: []
                  },
                  {
                    id: 'hmdrive_api_consultation',
                    label: 'api consultation',
                    nodeTypeId: 'component',
                    children: []
                  },
                  {
                    id: 'hmdrive_api_recherche',
                    label: 'api recherche',
                    nodeTypeId: 'component',
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'jouve',
        label: 'Jouve',
        nodeTypeId: 'org',
        children: []
      }
    ]
  };

export const links: DataEdge[] = [
  {
    id: 'jms-interactions-hmdrive',
    label: 'évènements hmdrive',
    source: 'hmdrive_api_injection',
    target: 'jms-interactions'
  },
  {
    id: 'jms-interactions-interactions',
    label: 'acquittements intéractions',
    source: 'api_interactions',
    target: 'jms-interactions'
  },
  {
    id: 'jms-interactions-client',
    label: 'api client',
    target: 'api_client',
    source: 'jms-interactions'
  },
  {
    id: 'jms-interactions-consultation-hmdrive',
    label: 'api consultation hmdrive',
    target: 'hmdrive_api_consultation',
    source: 'jms-interactions'
  },
  {
    id: 'batch-interactions-client',
    label: 'api client',
    target: 'api_client',
    source: 'batch-interactions'
  },
  {
    id: 'batch-interactions-consultation-hmdrive',
    label: 'api consultation hmdrive',
    target: 'hmdrive_api_consultation',
    source: 'batch-interactions'
  },
  {
    id: 'batch-interactions-interactions',
    label: 'émission intéractions',
    target: 'api_interactions',
    source: 'batch-interactions'
  }
];
