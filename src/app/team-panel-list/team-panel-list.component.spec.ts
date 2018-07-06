import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPanelListComponent } from './team-panel-list.component';

describe('TeamPanelListComponent', () => {
  let component: TeamPanelListComponent;
  let fixture: ComponentFixture<TeamPanelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamPanelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPanelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
