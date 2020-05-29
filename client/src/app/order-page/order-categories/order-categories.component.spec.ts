import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCategoriesComponent } from './order-categories.component';

describe('OrderCategoriesComponent', () => {
  let component: OrderCategoriesComponent;
  let fixture: ComponentFixture<OrderCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
