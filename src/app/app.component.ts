import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  Scales,
  Axes,
  Plots,
  Dataset,
  Components,
  Interactions
} from 'plottable';
import { SamplesApiService } from './services';
import { Sample } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('plottablejs') private svgEl: ElementRef;
  title = 'app';

  constructor(private api: SamplesApiService) {}

  ngOnInit() {
    this.api.getAll().subscribe(samples => {
      this.makeBasicChart(samples);
    });
  }

  makeBasicChart(data: Sample[]) {
    const xScale = new Scales.Time();
    const yScale = new Scales.Linear();

    const xAxis = new Axes.Time(xScale, 'bottom');
    const yAxis = new Axes.Numeric(yScale, 'left');

    const plot = new Plots.Line();
    plot.x((d: Sample) => {
      return d.dateTime;
    }, xScale);
    plot
      .y((d: Sample, _index: number, dataset: Dataset) => {
        return d[dataset.metadata().fieldKey];
      }, yScale)
      .attr('stroke', function(_d, _i, ds) {
        return colorScale.scale(ds.metadata().fieldKey);
        // return ds.metadata().color;
      });

    const tempDataset = new Dataset(data, {
      fieldKey: 'temperature',
      color: '#34b24c'
    });
    plot.addDataset(tempDataset);
    const moistDataset = new Dataset(data, {
      fieldKey: 'moisture',
      color: '#ffa500'
    });
    plot.addDataset(moistDataset);
    const humDataset = new Dataset(data, {
      fieldKey: 'humidity',
      color: '#551a8b'
    });
    plot.addDataset(humDataset);

    const colorScale = new Scales.Color();
    const legend = new Components.Legend(colorScale).maxEntriesPerRow(3);

    const chart = new Components.Table([
      [null, legend],
      [yAxis, plot],
      [null, xAxis]
    ]);

    const pzi = new Interactions.PanZoom();
    pzi.addXScale(xScale);
    pzi.addYScale(yScale);
    pzi.attachTo(plot);
    pzi.enabled(true);

    chart.renderTo(this.svgEl.nativeElement);
  }
}
