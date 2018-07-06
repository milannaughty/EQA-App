import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateRequestListComponent } from './associate-request-list.component';

describe('AssociateRequestListComponent', () => {
  let component: AssociateRequestListComponent;
  let fixture: ComponentFixture<AssociateRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
