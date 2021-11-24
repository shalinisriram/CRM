/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LeadService } from './lead.service';

describe('Service: Lead', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeadService]
    });
  });

  it('should ...', inject([LeadService], (service: LeadService) => {
    expect(service).toBeTruthy();
  }));
});
