import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../Provider/Authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public phoneNumber: string = '';
  public countrycode: string = '';
  public password: string = '';
  public otp: string = '';
  colors = '#38ad48';
  constructor(private _authService: AuthenticationService, private _router: Router, 
) { }

  ngOnInit() {
  }
  loading:boolean =false
  Login() {
   
    this.loading = true;
    let objPayload = {
      phone_number: this.phoneNumber,
      password: this.password
    };
    console.log('OnSubmit', this.otp);
    if (this.phoneNumber == '' && this.password == '') {
      console.log('1', this.phoneNumber + this.password);
      alert("Please Enter The Required Details");
    }
    else if (this.phoneNumber == '' || this.password == '') {
      console.log('2', this.phoneNumber + this.password);
      alert("Please Enter The Required Details");
    }
    else if ((this.phoneNumber != '') && (this.password != '')) {
      console.log('3', this.phoneNumber + this.password);
      this._authService.GetConnected(objPayload).subscribe(
        (response: any) => {
          console.log('LoginSucess', response);
          if (response.token != null) {
            // this.token = response.token 
            localStorage.setItem('jwtToken_CRM', response.token);
            console.log(response.message)
            localStorage.setItem('Auth', response.message);
            this._authService.getUser(response.message).subscribe(
              (response)=>
              {
                const res = response
                console.log(res.message)
                localStorage.setItem('user', res.message);
                localStorage.setItem('startLead','start')
                localStorage.setItem('startOp','start')
                localStorage.setItem('startPr','start')
                
              }
            )
            this.otp = '';
            this.phoneNumber = '';
            this._router.navigate(['customdashboard']);
           this.loading = false
          }
          else {
            alert("You Entered Invalid password");
            this.loading = false
           
          }
        },
        (error) => {
          alert("Please Enter Correct password");
          console.log(error);
          this.loading = false
          
        });
    }
  }
  token:any

}
