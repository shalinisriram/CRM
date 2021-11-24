import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-newUsers',
  templateUrl: './newUsers.component.html',
  styleUrls: ['./newUsers.component.css']
})
export class NewUsersComponent implements OnInit {
  public organizations: any[];
  constructor() { }

  ngOnInit() {
  }

}
