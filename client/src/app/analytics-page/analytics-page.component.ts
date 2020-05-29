import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { AnalyticsPage } from '../shared/interfaces';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css'],
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gain') gainRef: ElementRef;
  @ViewChild('order') orderRef: ElementRef;

  average: number;
  pending = true;
  aSub: Subscription;

  constructor(private service: AnalyticsService) {}

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'רווחים',
      color: 'rgb(255,99,132)',
    };

    const orderConfig: any = {
      label: 'הזמנות',
      color: 'rgb(54,162,135)',
    };

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average;

      gainConfig.labels = data.chart.map((item) => item.label);
      gainConfig.data = data.chart.map((item) => item.gain);

      orderConfig.labels = data.chart.map((item) => item.label);
      orderConfig.data = data.chart.map((item) => item.order);

      // ***** Gain ******

      // gainConfig.labels.push('29.05.2020');
      // gainConfig.labels.push('30.05.2020');
      // gainConfig.data.push(1500);
      // gainConfig.data.push(700);

      // // ***** Gain ******

      // // ***** ORDER ******

      // orderConfig.labels.push('29.05.2020');
      // orderConfig.labels.push('30.05.2020');
      // orderConfig.data.push(5);
      // orderConfig.data.push(4);

      // ***** ORDER ******

      const gainCtx = this.gainRef.nativeElement.getContext('2d');
      const orderCtx = this.orderRef.nativeElement.getContext('2d');
      gainCtx.canvas.height = '300px';
      orderCtx.canvas.height = '300px';

      new Chart(gainCtx, createChartConfig(gainConfig));
      new Chart(orderCtx, createChartConfig(orderConfig));
      this.pending = false;
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
}

function createChartConfig({ labels, data, label, color }) {
  return {
    type: 'line',
    options: {
      responsive: true,
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          steppedLine: false,
          fill: false,
        },
      ],
    },
  };
}
