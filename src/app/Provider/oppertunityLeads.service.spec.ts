/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OppertunityLeadsService } from './oppertunityLeads.service';

describe('Service: OppertunityLeads', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OppertunityLeadsService]
    });
  });

  it('should ...', inject([OppertunityLeadsService], (service: OppertunityLeadsService) => {
    expect(service).toBeTruthy();
  }));
});
