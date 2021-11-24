import { Component, OnInit, ViewChild } from '@angular/core';
import { Project } from './Project';
import { EditProject } from './EditProject';
import { Opportunity } from '../Opportunities/Opportunity';
import { ProjectService } from './../Provider/project.service';
import { SearchDate } from '../Utility/SearchDate';
import { CustomDropDownData } from '../Utility/CustomDropDownData';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  public value: any;
  public Projects: any = [];
  public Project: Project;
  public month: number = new Date().getMonth();
  public fullYear: number = new Date().getFullYear();
  public Day: number = new Date().getDate();
  public CurrentProjectEdit: any;
  public UtilityData: CustomDropDownData
  collection = { count: 0, data: [] };
  config: any;
  public currentOwnerId: any;
  Username:any
  dtOptions: DataTables.Settings = {};
  persons: any;
  dtTrigger: any = new Subject();

  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  constructor(private _authLeadService: ProjectService) {
    this.value = [new Date(this.fullYear, this.month , this.Day-7), new Date(this.fullYear, this.month, this.Day)];
    var isTue = localStorage.getItem("startPr")
    if(isTue != null)
    {
      localStorage.setItem("startDatePr",this.value[0])
      localStorage.setItem("endDatePr",this.value[1])
    }
    this.currentOwnerId = parseInt(localStorage.getItem("Auth"));
    this.Username = localStorage.getItem("user")
    let obj: any = {
      id: this.currentOwnerId
    }
    // this._authLeadService.GetAllProjectLeads(obj).subscribe(
    //   (data) => {
    //     console.log('Result ', data);
    //     this.Projects = data;
    //     this.collection.count = this.Projects.length
    //     for (var i = 0; i < this.collection.count; i++) {
    //       this.collection.data.push(
    //         {
    //           id: i + 1,
    //           value: this.Projects[i]
    //         }
    //       );
    //     }
    //   },
    //   (error) => {
    //     console.log('Log the error here: ', error);
    //   }
    // );
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.collection.count
    };
    this.dtOptions = {
      destroy: true,
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.GetDataOnSelectedDates();
  }

  dateUpdate()
  {
    localStorage.removeItem("startPr")
    localStorage.removeItem("startDatePr")
    localStorage.removeItem("endDatePr")
    localStorage.setItem("startDatePr",this.value[0])
    localStorage.setItem("endDatePr",this.value[1])
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


  pageChanged(event) {
    console.log(event)
    this.config.currentPage = event;
  }

  ngOnInit() {

    this.Project = new Project;
    this.UtilityData = new CustomDropDownData();
    this.Project.Status = '0';   // By Default it will be  Lead Closed-Converted
    this.CurrentProjectEdit = new EditProject();
    this.dtOptions = {
      destroy: true,
      pagingType: 'full_numbers',
      pageLength: 6
    };
  }


  AddOppertunity() {
    this.Project.OwnerId = this.currentOwnerId.toString();
    
    console.log('Oppurtunity Lead', this.Project);
    this._authLeadService.addProject(this.Project).subscribe(
      (data) => {
        console.log('Result ', data);
        if (data === true) {
          this.GetDataOnSelectedDates();
          alert("Project Added");
          
        } else {
          alert("Failed To Add Project due to Email address already exist");
        }
      },
      (error) => {
        console.log('Log the error here: ', error);
      }
    );
  }
  AddEditOpportunityLead() {
  
    let EditedLead = this.GetEditedLead(this.CurrentProjectEdit);
    console.log("Edited Lead Send", EditedLead);
    this._authLeadService.EditProject(EditedLead).subscribe(
      (data) => {
        console.log('Result ', data);
        if (data === true) {
          alert("Project Updated");
          this.GetDataOnSelectedDates();
          
        } else {
          alert("Failed To Update Opportunity");
        }
      },
      (error) => {
        console.log('Log the error here: ', error);
      }
    );
  }

  editOpportunity(opportunity: any) {
    // this.lead.EditId = lead.Id;  
    this.CurrentProjectEdit = { ...opportunity.value };
    this.CurrentProjectEdit.Quantiy= opportunity.value.quantiy;
    this.CurrentProjectEdit.UnitPrice= opportunity.value.unitPrice;
    this.CurrentProjectEdit.PaymentMode = opportunity.value.paymentMode
    console.log('Edit Lead Clone', this.CurrentProjectEdit);
  }
  PaymentMode:any=['Invoice Raised','Proforma  Invoice Raised','Payment Received']
  UpdateLeadTable() {
    let obj: any = {
      id: this.currentOwnerId
    }
    this._authLeadService.GetAllProjectLeads(obj).subscribe(
      (data) => {
        console.log('Result ', data);
        this.Projects = data;
      },
      (error) => {
        console.log('Log the error here: ', error);
      }
    );
  }
  loading:boolean = false
  Datalist:any
  isDtInitialized:boolean=false
  GetDataOnSelectedDates() {
    this.value[0]=new Date(localStorage.getItem("startDatePr"))
    this.value[1]=new Date(localStorage.getItem("endDatePr"))
    console.log(this.value);
    if (this.value != null) {
      this.loading = true
      let startDate: SearchDate = new SearchDate();
      startDate.Date = this.value[0].getDate();
      startDate.Month = this.value[0].getMonth() + 1;
      startDate.Year = this.value[0].getFullYear();
      let endDate: SearchDate = new SearchDate();
      endDate.Date = this.value[1].getDate();
      endDate.Month = this.value[1].getMonth() + 1;
      endDate.Year = this.value[1].getFullYear();
      let obj: any = { startDate, endDate, UserId: this.currentOwnerId };
      console.log("Object", obj);
      this._authLeadService.GetAllProjectsByDates(obj).subscribe(
        (data) => {
          this.collection.data = [];
          console.log('Result from Backend ', data);
          if (data != null) {
            console.log('Result ', data);
            this.Projects = data;
            this.collection.count = this.Projects.length
        for (var i = 0; i < this.collection.count; i++) {
          this.collection.data.push(
            {
              id: i + 1,
              value: this.Projects[i]
            }
          );
        }
        
      this.Datalist=this.collection.data
      if (this.isDtInitialized) {
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    } else {
        this.isDtInitialized = true;
        this.dtTrigger.next();
    }
        
        this.loading = false
          } else {
            alert("Failed To Update");
            this.loading = false
          }
        },
        (error) => {
          console.log('Log the error here: ', error);
          this.loading = false
        }
      );
    }
    else {
      
    }
  }


  GetEditedLead(currentSelectedLead: any) {
    let TempLead: Project = new Project;
    console.log('Converted Lead Enter', TempLead);
    TempLead.EditId = currentSelectedLead.id.toString();
    TempLead.Address1 = currentSelectedLead.address1;
    TempLead.Name = currentSelectedLead.name;
    TempLead.LastName = currentSelectedLead.lastName;
    TempLead.Title = currentSelectedLead.title;
    TempLead.Organization = currentSelectedLead.organization;
    TempLead.Status = currentSelectedLead.status.toString();
    if(currentSelectedLead.opportunityInpState != null)
    {
      TempLead.OpportunityInpState = currentSelectedLead.opportunityInpState.toString();
    }
    else{
      TempLead.OpportunityInpState = currentSelectedLead.opportunityInpState

    }
    TempLead.CurrentState = currentSelectedLead.currentState.toString();
    TempLead.EmailAddress = currentSelectedLead.emailAddress;
    TempLead.Phone = currentSelectedLead.phone;
    TempLead.MobilePhone = currentSelectedLead.mobilePhone;
    TempLead.Fax = currentSelectedLead.fax;
    TempLead.WebSite = currentSelectedLead.webSite;
    TempLead.Industry = currentSelectedLead.industry;
    TempLead.NumberOfEmployees = currentSelectedLead.numberOfEmployees.toString();
    TempLead.ForecastedValue = currentSelectedLead.forecastedValue.toString();
    TempLead.LeadSource = currentSelectedLead.leadSource.toString();
    TempLead.City = currentSelectedLead.city;
    TempLead.State = currentSelectedLead.state;
    TempLead.PostalCode = currentSelectedLead.postalCode.toString();
    TempLead.Country = currentSelectedLead.country;
    TempLead.Description = currentSelectedLead.description;
    TempLead.TagList = currentSelectedLead.tagList;
    TempLead.OwnerId = currentSelectedLead.ownerId.toString();
    TempLead.Visiblity = currentSelectedLead.visiblity.toString();
    TempLead.Geo = currentSelectedLead.geo.toString();
    TempLead.ServiceLines = currentSelectedLead.serviceLines.toString();
    TempLead.SalesType = currentSelectedLead.salesType.toString();
    TempLead.SalesTypeNature = currentSelectedLead.salesTypeNature.toString();
    TempLead.BusinessType = currentSelectedLead.businessType.toString();
    TempLead.DigitalAndInnovation = currentSelectedLead.digitalAndInnovation.toString();
    TempLead.DI_Products = currentSelectedLead.diProducts.toString();
    TempLead.DI_ServiceLines = currentSelectedLead.dI_ServiceLines.toString();
    TempLead.EnggServiceLines = currentSelectedLead.enggServiceLines.toString();
    TempLead.UnitPrice = currentSelectedLead.UnitPrice.toString();
    TempLead.Quantiy = currentSelectedLead.Quantiy
    console.log('Converted Lead', TempLead);

    return TempLead;
  }
Unity:number
qty:number
  onPercentChange(event:any)
  {
      this.Project.ForecastedValue = (this.Project.UnitPrice*this.Project.Quantiy).toString();
      this.CurrentProjectEdit.forecastedValue=(this.CurrentProjectEdit.UnitPrice*this.CurrentProjectEdit.Quantiy).toString();
  }

  deleteDelete(opportunity: any) {
    console.log(opportunity);
    let opperutnityId: any = {
      id: opportunity.value.id
    };
    if(confirm("Are you sure delete the Project ?")){

      this._authLeadService.Delete(opperutnityId).subscribe(
        (data) => {
          console.log('Result ', data);
          if (data === true) {
            alert('Deleted Sucessfully')
            this.GetDataOnSelectedDates();
            
          } else {
            alert("Failed To Delete Opportunity");
          }
        },
        (error) => {
          console.log('Log the error here: ', error);
        }
      );
    }
  }

  FilterByName(ind, pre) {

    if(pre!=1)
{
  (<HTMLInputElement>document.getElementById("myText1")).value=''
}if(pre!=2)
{
  (<HTMLInputElement>document.getElementById("myText2")).value=''
}if(pre!=3)
{
  (<HTMLInputElement>document.getElementById("myText3")).value=''
}if(pre!=4)
{
  (<HTMLInputElement>document.getElementById("myText4")).value=''
}if(pre!=5)
{
  (<HTMLInputElement>document.getElementById("myText5")).value=''
}if(pre!=6)
{
  (<HTMLInputElement>document.getElementById("myText6")).value=''
}if(pre!=7)
{
  (<HTMLInputElement>document.getElementById("myText7")).value=''
}if(pre!=8)
{
  (<HTMLInputElement>document.getElementById("myText8")).value=''
}
if(pre!=9)
{
  (<HTMLInputElement>document.getElementById("myText9")).value=''
}if(pre!=10)
{
  (<HTMLInputElement>document.getElementById("myText10")).value=''
}
    // Declare variables**************************** */ 
    var input, filter, table, tr, td, i, txtValue;
    //********************************************** */
    this.config = {
      itemsPerPage: this.collection.count,
      currentPage: 1,
      totalItems: this.collection.count
    };
    if(ind.target.value.length== 0)
    {
      this.config = {
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: this.collection.count
      }; 
    }
    // console.log(ind)
    input = ind.target.value;
    filter = input.toUpperCase();
    table = document.getElementById("ProjectTable");
    tr = table.getElementsByTagName("tr");
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      if(tr.length == i) {
        console.log("j");
        tr[i].style.display = "none";
        this.config = {
          itemsPerPage: 10,
          currentPage: 1,
          totalItems: this.collection.count
        };
      }
      td = tr[i].getElementsByTagName("td")[pre];
      // console.log(td);
      if (td) {
        txtValue = td.textContent || td.innerText;
        // console.log(txtValue);
        if (txtValue.toUpperCase().indexOf(filter) == 0) {
          console.log('index', txtValue.toUpperCase().indexOf(filter));
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }

  }



}
