import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
 const authUrl = environment.authUrl + 'Lead/';
// const authUrl = environment.authUrl + 'LeadOpprtunityProject/';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
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

  public addLead(obj) {
    console.log('Check Backend Connection AddLead', obj)
    return this.httpClient.post(authUrl + 'addLead', obj);
  }

  
  imageUpload(images){
    
    return this.httpClient.post(authUrl + 'Uploadpdf', images).toPromise();
}

  public EditLead(obj) {
    console.log('Check Backend Connection EditLead', obj)
    return this.httpClient.post(authUrl + 'editLead', obj);
    // return this.httpClient.post(authUrl + 'editLeadOpprtunityProject', obj);
  }

  public getfile(obj)
  {
    console.log(obj)
    return this.httpClient.post(authUrl + 'filesGet', obj);

  }

  public deletefile(obj)
  {
    return this.httpClient.post(authUrl + 'Delete', obj);

  }

  public download(id)
  {
    return this.httpClient.get(authUrl + 'DownloadFile?Id='+id);

  }

  public GetAllLeads(obj: any) {
    return this.httpClient.post(authUrl + 'allLeads', obj);
  }

  public GetAllOrganizations(obj: any) {
    return this.httpClient.post(authUrl + 'allOrganizations', obj);
  }

  public GetAllContacts(obj: any) {
    return this.httpClient.post(authUrl + 'allContacts', obj);
  }

  public GetAllLeadsByDates(obj: any) {
    return this.httpClient.post(authUrl + 'leadsByDates', obj);
  }

  public DeleteLeadById(obj: any) {
    return this.httpClient.post(authUrl + 'deleteLead', obj);
  }

}
