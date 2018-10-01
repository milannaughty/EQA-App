import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAreaAddComponent } from './admin-area-add.component';

describe('AdminAreaAddComponent', () => {
  let component: AdminAreaAddComponent;
  let fixture: ComponentFixture<AdminAreaAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAreaAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAreaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
