import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../Provider/Authentication.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  public UserId: any;
  public TokenCode: any;

  constructor(private router: Router, private route: ActivatedRoute, private _auth: AuthenticationService) { }

  ngOnInit() {
    // this.GetLoginDeatilsFromURL();
    // this.CheckAuthentication();
  }


  GetLoginDeatilsFromURL() {
    this.UserId = this.route.snapshot.queryParamMap.get('user').toString();
    this.TokenCode = this.route.snapshot.queryParamMap.get('code').toString();
    console.log("User Id", this.UserId);
    console.log("TokenCode", this.TokenCode);
  }

  CheckAuthentication() {
    let userObj = {
      userId: this.UserId,
      code: this.TokenCode,
    }
    this._auth.CheckUserAuthentication(userObj).subscribe(
      (data) => {
        console.log('LoginSucess', data);
        localStorage.setItem('jwtToken', data.token);
        this.router.navigate(['dashboard']);
        sessionStorage.setItem('Auth', this.UserId);
      },
      (error) => {
        console.log('Log the error here: ', error);
        this.router.navigate(['/unAuth']);
      }
    );
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('Back button pressed');
    localStorage.removeItem('jwtToken');
    sessionStorage.removeItem('Auth');
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    localStorage.removeItem('jwtToken');
    sessionStorage.removeItem('Auth');
  }

}
