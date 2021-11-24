
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LeadService } from '../Provider/lead.service';
import {HttpModule} from '@angular/http';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  persons: any;
  dtTrigger: any = new Subject();

  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  public currentOwnerId: any;
  public Contacts: any;
  config: any
  sum :any =0
  constructor(private _authLeadService: LeadService,private http:HttpClient) {
    this.currentOwnerId = parseInt(localStorage.getItem("Auth"));
 
    
  }
  Datalist:any

  ngOnInit() {
    this.dtOptions = {
      destroy: true,
      pagingType: 'full_numbers',
      pageLength: 6
    };
    this.GetContacts()
    
    // this.http.get<Person>('https://raw.githubusercontent.com/l-lin/angular-datatables/master/demo/src/data/data.json')
    //   .subscribe(persons => {
    //     this.persons = persons;
    //     // Calling the DT trigger to manually render the table
    //     this.Datalist=this.persons.data
    //     this.dtTrigger.next();
    //   });

      this.Datalist=this.Contacts
      console.log(this.Contacts)
        this.dtTrigger.next();
  }

  FilterByName(ind, pre) {
    console.log(ind.target.value)
    // Declare variables**************************** */ 
    var input, filter, table, tr, td, i, txtValue;
    //********************************************** */
    console.log(ind.target.value.length)
    
    this.config = {
      itemsPerPage: this.Contacts.length,
      currentPage: 1,
      totalItems: this.Contacts.count
    };
    if(ind.target.value.length== 0)
    {
      this.config = {
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: this.Contacts.count
      }; 
    }
    console.log(ind)
    input = ind.target.value;
    filter = input.toUpperCase();
    table = document.getElementsByTagName('table')[0];
    console.log(table);
    tr = table.rows;
    // Loop through all table rows, and hide those who don't match the search query
    console.log(tr.length);
    for (i = 0; i < tr.length; i++) {
      if(tr.length == i) {
        console.log("j");
        tr[i].style.display = "none";
        this.config = {
          itemsPerPage: 10,
          currentPage: 1,
          totalItems: this.Contacts.count
        };
      }
      td = tr[i].getElementsByTagName("td")[pre];
      console.log(td);
      if (td) {
       
        console.log( td.textContent)
        console.log( td.innerText)
        console.log( txtValue)

        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) == 0) {
          console.log(i)
          tr[i].style.display = "";
          
        }
        else{
          console.log(i)
          tr[i].style.display = 'None';
          
        }
      
        
      }
    }
    
    
  }
  pageChanged(event) {
    console.log(event);
    this.config.currentPage = event;
  }

  GetContacts() {
    let obj = {
      id: this.currentOwnerId
    }
   
    this._authLeadService.GetAllContacts(obj).subscribe(
      (data) => {
        console.log('Get All Contacts Response', data)
        this.Contacts = data;
        this.Datalist=this.Contacts
      console.log(this.Contacts)
        this.dtTrigger.next();
        this.config = {
          itemsPerPage: 10,
          currentPage: 1,
          totalItems: this.Contacts.count
        };
      },
      (error) => {
        console.log('Log the error here: ', error);
      }
    );
  }
  ngAfterViewInit(): void {
    this.dtTrigger.subscribe(() => {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns().every(function () {
          const that = this;
          $('input', this.header()).on('keyup change', function () {
            if (that.search() !== this['value']) {
              that
                .search(this['value'])
                .draw();
            }
            
          });
        });
        
      });
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

 


}
export interface  Person {
  title: string;
  firstName: string;
  lastName: string;
  address:string;
  contactNumber:string;
  email:string

}