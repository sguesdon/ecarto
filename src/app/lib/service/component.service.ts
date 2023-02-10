import {Injectable} from '@angular/core';
import {DataEdge, DataNode, DataNodeType} from '../schema/component.types';
import {nodes, nodeTypes} from '../schema/data';
import * as TreeModel from 'tree-model';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  public getNodes() : Promise<DataNode> {
    return Promise.resolve(nodes);
  }

  public static parse(nodes: DataNode): TreeModel.Node<DataNode[]> {
    const tree = new TreeModel();
    return tree.parse(nodes);
  }
}
