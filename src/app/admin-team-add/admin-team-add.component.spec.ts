import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTeamAddComponent } from './admin-team-add.component';

describe('AdminTeamAddComponent', () => {
  let component: AdminTeamAddComponent;
  let fixture: ComponentFixture<AdminTeamAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTeamAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTeamAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
