import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiledetailesComponent } from './filedetailes.component';

describe('FiledetailesComponent', () => {
  let component: FiledetailesComponent;
  let fixture: ComponentFixture<FiledetailesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiledetailesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiledetailesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
