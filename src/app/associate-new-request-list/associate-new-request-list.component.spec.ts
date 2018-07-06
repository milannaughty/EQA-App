import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateNewRequestListComponent } from './associate-new-request-list.component';

describe('AssociateNewRequestListComponent', () => {
  let component: AssociateNewRequestListComponent;
  let fixture: ComponentFixture<AssociateNewRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateNewRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateNewRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
