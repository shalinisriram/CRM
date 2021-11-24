import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlldashboardComponent } from './alldashboard.component';

describe('AlldashboardComponent', () => {
  let component: AlldashboardComponent;
  let fixture: ComponentFixture<AlldashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlldashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlldashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
