import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import G6, {Graph, GraphData, GraphOptions} from '@antv/g6';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges, AfterViewInit {

  private graph?: Graph;

  @Input()
  public selector: string = '';

  @Input()
  public options?: GraphOptions = {} as GraphOptions;

  @Input()
  public data?: GraphData = { nodes: [], edges: [] } as GraphData;

  @Input()
  public id: string = Math.abs(Math.random()).toString().replace('.', '');

  ngOnChanges(changes: SimpleChanges): void {

    if(!this.graph) {
      return;
    }

    if(changes.hasOwnProperty('data')) {
      this.graph.clear();
      this.graph.data(changes.data.currentValue);
      this.graph.render();
    }
  }

  ngAfterViewInit(): void {

    this.graph = new G6.Graph(Object.assign(
      {},
      this.options,
      { container: this.id, fitView: true}
    ));

    if(this.data) {
      this.graph.data(this.data);
      this.graph.render();
    }
  }
}
