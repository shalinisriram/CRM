import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from 'src/environments/environment';
const authUrl = environment.authUrl + 'Authentication/';

const jwtHelper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  constructor(private httpClient: HttpClient) {
  }

  public CheckUserAuthentication(obj: any) {
    console.log('Check User Authentication' + authUrl + 'authenticateUser', obj);
    return this.httpClient.post<Itemresponse>(authUrl + 'authenticateUser', obj);
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('jwtToken_CRM');
    // Check whether the token is expired and return
    // true or false
    // console.log("Token", token)
    return !jwtHelper.isTokenExpired(token);
  }

  public GetConnected(objPayload) {
    return this.httpClient.post<Itemresponse>(authUrl + 'login', objPayload);
  }

  public getUser(id)
  {
    return this.httpClient.get<Itemresponse>(authUrl + 'user?id='+id);

  }
}

export interface Itemresponse {
  status: '';
  token: '';
  data: '';
  message: '';
}

