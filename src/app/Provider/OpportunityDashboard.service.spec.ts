/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OpportunityDashboardService } from './OpportunityDashboard.service';

describe('Service: OpportunityDashboard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpportunityDashboardService]
    });
  });

  it('should ...', inject([OpportunityDashboardService], (service: OpportunityDashboardService) => {
    expect(service).toBeTruthy();
  }));
});
