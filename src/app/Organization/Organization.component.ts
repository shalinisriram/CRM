import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { LeadService } from '../Provider/lead.service';

@Component({
  selector: 'app-Organization',
  templateUrl: './Organization.component.html',
  styleUrls: ['./Organization.component.css']
})
export class OrganizationComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  persons: any;
  dtTrigger: any = new Subject();

  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  public currentOwnerId: any;
  public Organizations: any;
  constructor(private _authLeadService: LeadService) {
    this.currentOwnerId = parseInt(localStorage.getItem("Auth"));
  }
  sum:any=0
  config:any
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 6
    };
    this.GetOrganizations();
    

  }
  FilterByName(ind, pre) {
    console.log(ind.target.value)
    // Declare variables**************************** */ 
    var input, filter, table, tr, td, i, txtValue;
    //********************************************** */
    console.log(ind.target.value.length)
    
    this.config = {
      itemsPerPage: this.Organizations.length,
      currentPage: 1,
      totalItems: this.Organizations.count
    };
    if(ind.target.value.length== 0)
    {
      this.config = {
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: this.Organizations.count
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
          totalItems: this.Organizations.count
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
  Datalist:any
  GetOrganizations() {
    let obj = {
      id: this.currentOwnerId
    }
    this._authLeadService.GetAllOrganizations(obj).subscribe(
      (data) => {
        console.log('Get All Organizations Response', data)
        this.Organizations = data;
        this.Datalist=this.Organizations
        
          this.dtTrigger.next();
        this.config = {
          itemsPerPage: 10,
          currentPage: 1,
          totalItems: this.Organizations.count
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
          $('input', this.footer()).on('keyup change', function () {
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
