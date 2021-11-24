/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProjectDashboardService } from './ProjectDashboard.service';

describe('Service: ProjectDashboard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectDashboardService]
    });
  });

  it('should ...', inject([ProjectDashboardService], (service: ProjectDashboardService) => {
    expect(service).toBeTruthy();
  }));
});
