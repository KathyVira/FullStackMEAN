import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {
  MaterialService,
  MaterialInstance,
} from '../shared/classes/material.service';
import { OrderService } from './order.service';
import { OrderPosition, Order } from '../shared/interfaces';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService],
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal') modaleRef: ElementRef;
  modal: MaterialInstance;
  oSub: Subscription;
  isRoot: boolean;
  pending = false;

  constructor(
    private router: Router,
    public order: OrderService,
    private ordersService: OrdersService
  ) {}

  ngOnInit() {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    });
  }

  ngOnDestroy() {
    this.modal.destroy();
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }
  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modaleRef);
  }

  removePosition(orderPosition: OrderPosition) {
    this.order.remove(orderPosition);
  }
  open() {
    this.modal.open();
  }
  cancel() {
    this.modal.close();
  }
  submit() {
    this.pending = true;

    const order: Order = {
      list: this.order.list.map((item) => {
        delete item._id;
        return item;
      }),
    };
    this.oSub = this.ordersService.create(order).subscribe(
      (newOrder) => {
        MaterialService.toast(`Order N${newOrder.order} was added`);
        this.order.clear();
      },
      (error) => MaterialService.toast(error.error.mesage),
      () => {
        this.modal.close();
        this.pending = false;
      }
    );
  }
}
