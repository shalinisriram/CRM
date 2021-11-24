import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const authUrl = environment.authUrl + 'ProjectDashboard/';
@Injectable({
  providedIn: 'root'
})
export class ProjectDashboardService {

  constructor(private httpClient: HttpClient) { }

  public GetProjectCountByStatus(obj: any) {
    return this.httpClient.post(authUrl + "ProjectsByStatus", obj);
  }

  public GetProjectCountBySource(obj: any) {
    return this.httpClient.post(authUrl + "ProjectsBySource", obj);
  }
  public GetProjectCount(obj: any) {
    return this.httpClient.post(authUrl + "projectstatus", obj);
  }
  public GetProjectStatusByMonth(obj: any) {
    return this.httpClient.post(authUrl + "ProjectsStatusByMonth", obj);
  }

  public status(obj:any)
  {
    return this.httpClient.post(authUrl+"ProjectsByStatus",obj)
  }

}
