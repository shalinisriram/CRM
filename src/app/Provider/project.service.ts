import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const authUrl = environment.authUrl + 'Project/';
// const authUrl = environment.authUrl + 'LeadOpprtunityProject/';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient: HttpClient) {

  }

  GetAllProjectLeads(obj) {
    console.log(authUrl + 'allProjects')
    return this.httpClient.post(authUrl + 'allProjects', obj);
  }

  public addProject(obj) {
    console.log('Check Backend Connection AddLead', obj)
    return this.httpClient.post(authUrl + 'addProject', obj);
  }


  public GetAllProjectsByDates(obj: any) {
    // return this.httpClient.post(authUrl + 'ProjectByDates', obj);
     return this.httpClient.post(authUrl + 'ProjectsByDates', obj);
  }

  public EditProject(obj) {
    console.log('Check Backend Connection EditLead', obj)
    return this.httpClient.post(authUrl + 'editProject', obj);
  }
  

  public Delete(obj)
  {
    return this.httpClient.post(authUrl + 'deleteProject', obj);
  }
}
