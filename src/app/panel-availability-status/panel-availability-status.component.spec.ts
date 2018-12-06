import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAvailabilityStatusComponent } from './panel-availability-status.component';

describe('PanelAvailabilityStatusComponent', () => {
  let component: PanelAvailabilityStatusComponent;
  let fixture: ComponentFixture<PanelAvailabilityStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelAvailabilityStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelAvailabilityStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
