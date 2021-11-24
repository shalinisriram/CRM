import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const authUrl = environment.authUrl + 'Opportunity/';
// const authUrl = environment.authUrl + 'LeadOpprtunityProject/';

@Injectable({
  providedIn: 'root'
})
export class OppertunityLeadsService {

  constructor(private httpClient: HttpClient) {

  }

  GetAllOpertunityLeads(obj) {
    console.log(authUrl + 'allOpportunities')
    return this.httpClient.post(authUrl + 'allOpportunities',obj);
  }

  public addOppurtunityLead(obj) {
    console.log('Check Backend Connection AddLead', obj)
    return this.httpClient.post(authUrl + 'addOpportunities', obj);
    // return this.httpClient.post(authUrl + 'addOpprtunity', obj);
  }

  public EditOppurtunityLead(obj) {
    console.log('Check Backend Connection EditLead', obj)
    return this.httpClient.post(authUrl + 'editOpportunityLead', obj);
  }

  public GetAllOppurtunityByDates(obj: any) {
    return this.httpClient.post(authUrl + 'OppurtunitiesByDates', obj);
    // return this.httpClient.post(authUrl + 'OpprtunityByDates', obj);
  }

  public DeleteOppurtunityById(obj: any) {
    return this.httpClient.post(authUrl + 'deleteOpportunity', obj);
  }
 

}
