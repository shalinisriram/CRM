import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const authUrl = environment.authUrl + 'LeadDashoard/';

@Injectable({
  providedIn: 'root'
})
export class LeadDashboardService {

  constructor(private httpClient: HttpClient) {

  }

  public Checkconnection() {
    console.log('Check Backend Connection')
    return this.httpClient.get(authUrl).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log('Log the error here: ', error);
      }
    );
  }


  public GetLeadsCountByStatus(obj : any){
    return this.httpClient.post(authUrl+"LeadsByStatus",obj);
  }

  public GetLeadsCountBySource(obj : any){
    return this.httpClient.post(authUrl+"LeadsBySource",obj);
  }
  public GetLeadsCount(obj : any){
    return this.httpClient.post(authUrl+"Leadsstatus",obj);
  }
  public GetLeadsStatusByMonth(obj : any){
    return this.httpClient.post(authUrl+"LeadsStatusByMonth",obj);
  }

}
