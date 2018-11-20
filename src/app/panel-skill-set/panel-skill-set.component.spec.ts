import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSkillSetComponent } from './panel-skill-set.component';

describe('PanelSkillSetComponent', () => {
  let component: PanelSkillSetComponent;
  let fixture: ComponentFixture<PanelSkillSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelSkillSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelSkillSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
