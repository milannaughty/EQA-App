import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateRequestDetailComponent } from './associate-request-detail.component';

describe('AssociateRequestDetailComponent', () => {
  let component: AssociateRequestDetailComponent;
  let fixture: ComponentFixture<AssociateRequestDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateRequestDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
