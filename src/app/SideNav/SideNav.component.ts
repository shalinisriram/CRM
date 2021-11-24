import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-SideNav',
  templateUrl: './SideNav.component.html',
  styleUrls: ['./SideNav.component.css']
})
export class SideNavComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  logOut() {
    sessionStorage.clear();
  }

}
   