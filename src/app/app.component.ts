import {Component, OnInit} from '@angular/core';
import {EdgeConfig, Graph, GraphData, GraphOptions, IEdge, INode, NodeConfig} from '@antv/g6';
import {Layer} from './lib/schema/layer.types';
import {layers, links} from './lib/schema/data';
import {ComponentService} from './lib/service/component.service';
import G6 from '@antv/g6';
import TreeModel from 'tree-model';
import {DataEdge, DataNode} from './lib/schema/component.types';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'poc';
  uniqueEdges: boolean = true;
  menuMode: string = 'overlay';

  layers: Layer[] = layers;
  selectedLayers: Layer[] = [];

  globalNodes: DataNode[] = [];
  selectedNodes!: DataNode;

  tree?: TreeModel.Node<DataNode[]>;

  allNodes?: DataNode;
  data?: GraphData;
  config?: GraphOptions;

  constructor(private componentService: ComponentService) {}

  ngOnInit(): void {
    this.config = {
      container: '',
      fitViewPadding: 100,
      layout: {
        type: 'dagre',
        rankdir: 'LR',
        nodesep: 50,
        ranksep: 100,
        controlPoints: false,
      },
      defaultCombo: {
        type: 'rect',
        style: {
          fill: '#dceaff',
          stroke: '#c0daff',
          lineWidth: 1,
          radius: 5
        },
        labelCfg: {
          style: {
            fontFamily: 'Arial'
          }
        }
      },
      defaultNode: {
        type: 'modelRect',
        stateIcon: {
          show: false
        },
        color: '#ddd',
        style: {
          fill: '#efefef',
          lineWidth: 1,
        },
        labelCfg: {
          style: {
            fontFamily: 'Arial',
            fill: '#000',
            fontSize: 13,
          },
        },
        anchorPoints: [
          [0, 0.5],
          [0.5, 0],
          [1, 0.5],
          [0.5, 1]
        ]
      },
      defaultEdge: {
        type: 'polyline',
        style: {
          offset: 25,
          lineWidth: 1,
          stroke: '#666'
        },
      },
      modes: {
        default: [
          {
            type: 'drag-node',
            enableDelegate: false,
            shouldBegin: (e): boolean => {
              return !e.item?.getModel().comboId;
            },
          },
          {
            type:'zoom-canvas',
            enableOptimize: true
          },
          {
            type: 'drag-canvas',
            enableOptimize: true
          },
          {
            type: 'brush-select'
          },
          {
            type: 'drag-combo'
          },
          {
            type: 'collapse-expand-combo',
            relayout: false
          }
        ],
      },
    } as GraphOptions;

    /**
    this.graph.on('edge:dblclick', () => {
      //this.uniqueEdges = !this.uniqueEdges;
      //[... graph.getEdges()].forEach((e: any) => graph.removeItem(e));
      //this.buildData().edges.forEach(e => graph.addItem('edge', e));
    });

     */

    this.initData();

  }

  async initData() {
    this.allNodes = await this.componentService.getNodes();
    this.tree  = ComponentService.parse(this.allNodes);
    this.globalNodes = this.allNodes.children;
  }

  onTreeSelectionChange(node: DataNode) {

    if(!node) {
      return;
    }

    const selectedNode : TreeModel.Node<DataNode[]> = this.tree!.first((a) => a.model.id === node.id)!;

    if(!selectedNode) {
      return;
    }

    this.data = this.buildDataChart(selectedNode);
  }

  buildDataChart(baseNode : TreeModel.Node<DataNode[]>): GraphData {

    const depth: number = baseNode.getPath().indexOf(baseNode);
    const subNodes: TreeModel.Node<DataNode[]>[] = baseNode.children;
    const depNodes: TreeModel.Node<DataNode[]>[] = [];
    const edges: EdgeConfig[] = [];

    for(const sn of subNodes) {

      const targetNodes: TreeModel.Node<DataNode[]>[] = this.findAllEdgesByNode(sn)
        .map((e) => this.findSecondNodeByEdge(this.tree!, sn, e))
        .map((e) => this.findSubNodesOrNodeWithDepth(subNodes, e, depth));

      for(const targetNode of [... new Set(targetNodes)]) {

        if(depNodes.findIndex((n) => n.model.id === targetNode.model.id) < 0) {
          depNodes.push(targetNode);
        }

        if(!this.edgeExist(edges, targetNode, sn) && sn.model.id !== targetNode.model.id) {
          edges.push({
            source: sn.model.id,
            target: targetNode.model.id,
            label: ''
          });
        }
      }
    }

    const data: GraphData = {
      nodes: [
        ... subNodes.map((n) => this.mapNodeToNodeConfig(n, 'this')),
        ... depNodes.map((n) => this.mapNodeToNodeConfig(n))
      ],
      edges,
      combos: [{
        id: 'this',
        label: baseNode.model.label
      }]
    };

    return data;
  }

  private mapNodeToNodeConfig(node: TreeModel.Node<DataNode[]>, comboId?: string): NodeConfig {
    const nodeConfig: NodeConfig = { id : node.model.id, label: node.model.label };
    if(comboId) {
      nodeConfig.comboId = comboId;
    }
    return nodeConfig;
  }

  private edgeExist(edges: EdgeConfig[], source: TreeModel.Node<DataNode[]>, target: TreeModel.Node<DataNode[]>): boolean {
    return edges.findIndex((e) => target.model.id === e.target && source.model.id === e.source) > -1;
  }

  private findSubNodesOrNodeWithDepth(
    subNodes: TreeModel.Node<DataNode[]>[],
    node: TreeModel.Node<DataNode[]>,
    depth: number
  ) : TreeModel.Node<DataNode[]> {
    const items : TreeModel.Node<DataNode[]>[] = node.getPath();
    const item : TreeModel.Node<DataNode[]> | undefined = items.find((item) => subNodes.includes(item));
    return item || items[depth];
  }

  private findSecondNodeByEdge(
    treeNode: TreeModel.Node<DataNode[]>,
    unwantedNode: TreeModel.Node<DataNode[]>,
    dataEdge: DataEdge
  ): TreeModel.Node<DataNode[]> {
    const id : string = dataEdge.source === unwantedNode.model.id ? dataEdge.target : dataEdge.source;
    return treeNode.first((n) => n.model.id === id)!;
  }

  private findAllEdgesByNode(node : TreeModel.Node<DataNode[]>): DataEdge[] {
    const dataEdges: DataEdge[] = [];
    node.walk((n) : boolean => {
      dataEdges.push(... this.findEdgesByNode(links, n));
      return true;
    });
    return dataEdges;
  }

  private findEdgesByNode(links: DataEdge[], node: TreeModel.Node<DataNode[]>): DataEdge[] {
    return links.filter((l) => [l.source, l.target].includes(node.model.id));
  }

  renderTreeSelection(selectedNodes: DataNode) {

    if(!this.tree || !selectedNodes) {
      return '&nbsp;';
    }

    const node : TreeModel.Node<DataNode[]> = this.tree.first((n) => n.model.id === selectedNodes.id)!;
    const path : TreeModel.Node<DataNode[]>[] = node.getPath();
    return path.splice(1, path.indexOf(node) + 1).map((n) => n.model.label).join(' / ');
  }
}
