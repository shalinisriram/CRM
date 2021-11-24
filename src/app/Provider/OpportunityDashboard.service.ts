import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const authUrl = environment.authUrl + 'OpportunityDashboard/';

@Injectable({
  providedIn: 'root'
})
export class OpportunityDashboardService {

  constructor(private httpClient: HttpClient) { }

  public GetOpportunitiesCountByStatus(obj: any) {
    return this.httpClient.post(authUrl + "OpportunitiesByStatus", obj);
  }

  public GetOpportunitiesCountBySource(obj: any) {
    return this.httpClient.post(authUrl + "OpportunitiesBySource", obj);
  }

  public GetOpportunitiesCount(obj: any) {
    return this.httpClient.post(authUrl + "OpportunitiesStatus", obj);
  }

  public GetOpportunitiesStatusByMonth(obj: any) {
    return this.httpClient.post(authUrl + "OpportunitiesStatusByMonth", obj);
  }
}
