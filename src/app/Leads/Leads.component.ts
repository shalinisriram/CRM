import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Lead } from './Lead';
import { User } from './User';
import { LeadService } from './../Provider/lead.service';
import { EditLead } from './EditLead';
import { Pipe } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { SearchDate } from '../Utility/SearchDate';
import { CustomDropDownData } from '../Utility/CustomDropDownData';
import { range, Subject } from 'rxjs';
import { number, string } from '@amcharts/amcharts4/core';
import { DataTableDirective } from 'angular-datatables';
import { Console } from 'console';
import Swal from 'sweetalert2';
import { threadId } from 'worker_threads';
import * as FileSaver from 'file-saver';
import { LeadOpprtunitiesProject } from './LeadOpprtunitiesProject';



@Component({
  selector: 'app-Leads',
  templateUrl: './Leads.component.html',
  styleUrls: ['./Leads.component.css']
})

export class LeadsComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  persons: any;
  dtTrigger: any = new Subject();
  isDtInitialized: boolean = false
  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  faCoffee = faCoffee;
  public leads: any = [];
  public CurrentLead: any;
  public value: any;
  public users = [];
  public lead: Lead;
  Unit:any = Number;
  qty:any
  // public modalRef: BsModalRef;
  public EditedLead: Lead;
  private tempUser1: User;
  private customRadioInline1: any;
  public CurrentLeadEdit: any;
  public UtilityData: CustomDropDownData
  public currentOwnerId: any;
  collection = { count: 0, data: [] };
  config: any
  public month: number = new Date().getMonth();
  public fullYear: number = new Date().getFullYear();
  public Day: number = new Date().getDate();
  public UserName: any
  public Datalist: any

  constructor(private _authLeadService: LeadService) {
    this.lead = new Lead;
    this.currentOwnerId = +localStorage.getItem("Auth");
    this.UserName = localStorage.getItem("user");
    console.log("A")
    console.log("Current Owner Id", this.currentOwnerId);
    let obj = {
      id: this.currentOwnerId
    }
    // this._authLeadService.GetAllLeads(obj).subscribe(
    //   (data) => {
    //     this.leads = data;
    //     this.collection.count = this.leads.length
    //     for (var i = 0; i < this.collection.count; i++) {
    //       this.collection.data.push(
    //         {
    //           id: i + 1,
    //           value: this.leads[i]
    //         }
    //       );
    //       console.log(this.leads[i])
    //     }
    //   },
    //   (error) => {
    //     console.log('Log the error here: ', error);
    //   }
    // );
    this.value = [new Date(this.fullYear, this.month, this.Day - 7), new Date(this.fullYear, this.month, this.Day)];
    var isTue = localStorage.getItem("startLead")
    if(isTue != null)
    {
      localStorage.setItem("startDateLead",this.value[0])
      localStorage.setItem("endDateLead",this.value[1])
    }
    this.dtOptions = {
      destroy: true,
      ordering: true,
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.collection.count
    };
    this.GetDataOnSelectedDates();

  }
  selectedpdf:any
  onFileChanged(event) {
    this.selectedpdf = event.target.files;

  }
  saverange()
  {
    
  }
  dateUpdate()
  {
    localStorage.removeItem("startLead")
    localStorage.removeItem("startDateLead")
    localStorage.removeItem("endDateLead")
    localStorage.setItem("startDateLead",this.value[0])
    localStorage.setItem("endDateLead",this.value[1])
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

  loading: boolean = false
  ngOnInit() {
    this.tempUser1 = new User;
    this.CurrentLeadEdit = new EditLead();
    this.lead = new Lead;
    this.UtilityData = new CustomDropDownData();
  }
  pageChanged(event) {
    console.log(event);
    this.config.currentPage = event;
  }
 
  GetDataOnSelectedDates() {
    this.value[0]=new Date(localStorage.getItem("startDateLead"))
    this.value[1]=new Date(localStorage.getItem("endDateLead"))
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
      this._authLeadService.GetAllLeadsByDates(obj).subscribe(
        (data) => {
          this.collection.data = []
          console.log('Result from Backend ', data);
          if (data != null) {
            console.log('Result ', data);
            this.leads = data;
            this.collection.count = this.leads.length
            for (var i = 0; i < this.collection.count; i++) {
              this.collection.data.push(
                {
                  id: i + 1,
                  value: this.leads[i]
                }
              );
              this.Datalist = {};
            
             
             
              // console.log(this.leads[i]);
            }
            this.Datalist = [...this.collection.data];
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
          }
          else {
            alert("Failed To Update");
            this.loading = false
            this.leads = []
          }
        },
        (error) => {
          console.log('Log the error here: ', error);
          this.loading = false
        }
      );
    }
    else {
      this.UpdateLeadTable();
    }
  }

  AddLeads: boolean = false
  Datalist1=[{
    "filename":"a",
  
  }]

  onPercentChange(eventName:any)
  { 
    this.CurrentLeadEdit.forecastedValue =(this.CurrentLeadEdit.UnitPrice*this.CurrentLeadEdit.Quantiy).toString();
    

  }
  AddLead() {
    this.AddLeads = true;
    const uploadData = new FormData();
    this.lead.UnitPrice = this.CurrentLeadEdit.UnitPrice
    this.lead.Quantiy = this.CurrentLeadEdit.Quantiy

    this.lead.Forecastedvalue = (this.lead.UnitPrice*this.lead.Quantiy).toString();
    this.lead.OwnerId = this.currentOwnerId.toString();
    this._authLeadService.addLead(this.lead).subscribe(
      (data) => {

        console.log('Result from Backend ', data);
        if (data != 0) {
          if(this.selectedpdf.length > 0)
          {

            for (let i = 0; i < this.selectedpdf.length; i++) {
              // this.progressvalue =  Math.round((100/this.selectedImages.length) *i)
              // this.progressMessage = "Uploading " + this.selectedImages.length +" Images...."+ this.progressvalue +"%";
              
              uploadData.append('File', this.selectedpdf[i]);
              }
              uploadData.append(data.toString(),data.toString())
              const res =  this._authLeadService.imageUpload(uploadData)
              alert("Image Uploaded");
           }
            
         
          alert("Lead Added");
          this.selectedpdf.clear();
          this.GetDataOnSelectedDates();
          this.AddLeads = false;
          this.UpdateLeadTable();
        } else {
          alert("Failed To Add Lead due to Email address already exist");
          this.AddLeads = false;
        }
      },
      (error) => {
        console.log('Log the error here: ', error);
        this.AddLeads = false;
      }
    );
  }
  Saveloading: boolean = false
  AddEditLead() {
    this.Saveloading = true;
     let EditedLead = this.GetEditedLead(this.CurrentLeadEdit);
    console.log("Edited Lead Send", EditedLead);
    this._authLeadService.EditLead(EditedLead).subscribe(
      (data) => {
        console.log('Result ', data);
        if (data === true) {
          this.GetDataOnSelectedDates();
          this.Saveloading = false;
          alert("Lead Updated");
          this.UpdateLeadTable();
        } else {
          alert("Failed To Update Lead")
          this.Saveloading = false;;
        }
      },
      (error) => {
        console.log('Log the error here: ', error);
        this.Saveloading = false;
      }
    );
  }

  editLead(lead: any) {
    // this.lead.EditId = lead.Id;  
    this.CurrentLeadEdit = { ...lead.value };
    this.CurrentLeadEdit.Quantiy= lead.value.quantiy;
    this.CurrentLeadEdit.UnitPrice= lead.value.unitPrice;


    console.log('Edit Lead Clone', this.CurrentLeadEdit);
  }

  deletedfile(person)
  {
    
    let obj={
      'Id':person.id
    }
    confirm("Do you want to delete this file")
    {
      this._authLeadService.deletefile(obj).subscribe(
        (data)=>
        {
          if(data === true)
          {
            alert("Successfully deleted")
            this.getFiles(obj);
          }
          else{
            alert("Failed to deleted")
          }
        }
      )
    }
  }
first:any=false
  addFile()
  {
   
    var id = localStorage.getItem("attachmentId")
    const uploadData1 = new FormData();

    for (let i = 0; i < this.selectedpdf.length; i++) {
      // this.progressvalue =  Math.round((100/this.selectedImages.length) *i)
      // this.progressMessage = "Uploading " + this.selectedImages.length +" Images...."+ this.progressvalue +"%";
      
      uploadData1.append('File', this.selectedpdf[i]);
      }
      uploadData1.append(id.toString(),id.toString())
      const res =  this._authLeadService.imageUpload(uploadData1)
      if(res != null)
      {
        alert("Files Uploaded Succesfully");
        let obj={
          'Id':id
        }
        this.getFiles(obj);
      }

    
    
    this.selectedpdf.clear();
  }

  

  Download(person)
  {
    
      this._authLeadService.download(person.id).subscribe(
        (response)=>
        {
  
        }
      )
    
  
  }
  
filesList:any=[]
  getFiles(persons)
  {
    if(this.first != false)
    {
        localStorage.removeItem("attachmentId")
    }
    localStorage.setItem("attachmentId",persons.id)
    this.first =true
    let obj={
      'Id':persons.id
    }
    this._authLeadService.getfile(obj).subscribe(
      (data)=>
      {
        if(data != null)
        {
          this.filesList = data;
        }
        else{
          this.filesList = [];
        }
      }
    )
  }
  deleteLead(lead: any) {
    let leadId: any = {
      id: lead.value.id
    };

      if(confirm("Are you sure delete the lead ?"))
      {
        
        this._authLeadService.DeleteLeadById(leadId).subscribe(
          (data) => {
            console.log('Result ', data);
            if (data === true) {
              alert('Deleted Sucessfully')
              this.GetDataOnSelectedDates();

            } else {
              alert("Failed To Add Lead");
            }
          },
          (error) => {
            console.log('Log the error here: ', error);
          }
        );

      }
    // Swal.fire({
    //   title:"Info",
    //   confirmButtonText:'Yes',
    //   cancelButtonText:'No',
    //   text:"Do you want to delete this lead",
    //   showCloseButton:true,
    //   showConfirmButton:true
    // }).then((result) => {
    //   if (result.value) {
       
    //   }
    // });
  }
    
  

  UpdateLeadTable() {
    let obj: any = {
      id: this.currentOwnerId
    }
    this._authLeadService.GetAllLeads(obj).subscribe(
      (data) => {
        console.log('Result ', data);
        this.leads = data;
      },
      (error) => {
        console.log('Log the error here: ', error);
      }
    );
  }

  // AddParameterModal(template: TemplateRef<any>, lead) {
  //   this.CurrentLead = lead; 
  //   this.EditedLead = new Lead();
  //   this.modalRef = this.bsModal.show(template);
  // }

  // GetEditedLead(currentSelectedLead: any) {
  //   let TempLead: LeadOpprtunitiesProject = new LeadOpprtunitiesProject;
  //   console.log('Current Selected Lead', currentSelectedLead);
  //   TempLead.id = currentSelectedLead.id;
  //   TempLead.address1 = currentSelectedLead.address1;
  //   TempLead.name = currentSelectedLead.name;
  //   TempLead.lastName = currentSelectedLead.lastName;
  //   TempLead.title = currentSelectedLead.title;
  //   TempLead.organization = currentSelectedLead.organization;
  //   TempLead.leadStatus = currentSelectedLead.leadStatus.toString();
  //   TempLead.emailAddress = currentSelectedLead.emailAddress;
  //   TempLead.phone = currentSelectedLead.phone;
  //   TempLead.mobilePhone = currentSelectedLead.mobilePhone;
  //   TempLead.fax = currentSelectedLead.fax;
  //   TempLead.forecastedValue= currentSelectedLead.forecastedValue.toString();
  //   TempLead.forecastedValueCurrency = currentSelectedLead.forecastedValueCurrency.toString();
  //   TempLead.webSite = currentSelectedLead.webSite;
  //   TempLead.industry = currentSelectedLead.industry;
  //   TempLead.numberOfEmployees = currentSelectedLead.numberOfEmployees.toString();
  //   TempLead.leadSource = currentSelectedLead.leadSource.toString();
  //   TempLead.city = currentSelectedLead.city;
  //   TempLead.state = currentSelectedLead.state;
  //   TempLead.postalCode = currentSelectedLead.postalCode.toString();
  //   TempLead.country = currentSelectedLead.country;
  //   TempLead.description = currentSelectedLead.description;
  //   TempLead.tagList = currentSelectedLead.tagList;
  //   TempLead.userId = currentSelectedLead.userId.toString();
  //   TempLead.geo = currentSelectedLead.geo.toString();
  //   TempLead.serviceLines = currentSelectedLead.serviceLines.toString();
  //   TempLead.salesType = currentSelectedLead.salesType.toString();
    
  //   TempLead.businessType = currentSelectedLead.businessType.toString();
  //   TempLead.digitalAndInnovation = currentSelectedLead.digitalAndInnovation.toString();
  //   TempLead.diProducts = currentSelectedLead.diProducts.toString();
  //   TempLead.dI_ServiceLines = currentSelectedLead.dI_ServiceLines.toString();
  //   TempLead.enggServiceLines = currentSelectedLead.enggServiceLines.toString();
  //   TempLead.visiblity = currentSelectedLead.visiblity.toString();
  //   TempLead.UnitPrice = currentSelectedLead.UnitPrice.toString();
  //   TempLead.Quantiy = currentSelectedLead.Quantiy;

  //   TempLead.createdOn =currentSelectedLead.createdOn
  //   TempLead.currentState =currentSelectedLead.currentState.toString()
  //   TempLead.inpState =currentSelectedLead.inpState.toString()
  //   TempLead.isLead  =currentSelectedLead.isLead
  //   TempLead.isOpportunity  =currentSelectedLead.isOpportunity
  //   TempLead.isProject  =currentSelectedLead.isProject
  //   TempLead.leadSalesType  =currentSelectedLead.leadSalesType.toString()
  //   TempLead.leadSalesTypeNature  =currentSelectedLead.leadSalesTypeNature.toString()
  //   TempLead.modifiedOn  =currentSelectedLead.modifiedOn.toString()
  //   TempLead.opportunitySalesType  =currentSelectedLead.opportunitySalesType.toString()
  //   TempLead.opportunitySalesTypeNature  =currentSelectedLead.opportunitySalesTypeNature.toString()
  //   TempLead.paymentMode  =currentSelectedLead.paymentMode.toString()
  //   TempLead.projectSalesType  =currentSelectedLead.projectSalesType.toString()
  //   TempLead.projectSalesTypeNature  =currentSelectedLead.projectSalesTypeNature.toString()
  //   TempLead.status  =currentSelectedLead.status.toString()
   
  //   TempLead.quantity  =currentSelectedLead.quantiy


    
  //   return TempLead;
  // }

  GetEditedLead(currentSelectedLead: any) {
    let TempLead: Lead = new Lead;
    console.log('Current Selected Lead', currentSelectedLead);
    TempLead.EditId = currentSelectedLead.id.toString();
    TempLead.Address1 = currentSelectedLead.address1;
    TempLead.Name = currentSelectedLead.name;
    TempLead.LastName = currentSelectedLead.lastName;
    TempLead.Title = currentSelectedLead.title;
    TempLead.Organization = currentSelectedLead.organization;
    TempLead.LeadStatus = currentSelectedLead.leadStatus.toString();
    TempLead.EmailAddress = currentSelectedLead.emailAddress;
    TempLead.Phone = currentSelectedLead.phone;
    TempLead.MobilePhone = currentSelectedLead.mobilePhone;
    TempLead.Fax = currentSelectedLead.fax;
    TempLead.Forecastedvalue = currentSelectedLead.forecastedValue.toString();
    TempLead.ForecastedValueCurrency = currentSelectedLead.forecastedValueCurrency.toString();
    TempLead.WebSite = currentSelectedLead.webSite;
    TempLead.Industry = currentSelectedLead.industry;
    TempLead.NumberOfEmployees = currentSelectedLead.numberOfEmployees.toString();
    TempLead.LeadSource = currentSelectedLead.leadSource.toString();
    TempLead.City = currentSelectedLead.city;
    TempLead.State = currentSelectedLead.state;
    TempLead.PostalCode = currentSelectedLead.postalCode.toString();
    TempLead.Country = currentSelectedLead.country;
    TempLead.Description = currentSelectedLead.description;
    TempLead.TagList = currentSelectedLead.tagList;
    TempLead.OwnerId = currentSelectedLead.ownerId.toString();
    TempLead.Geo = currentSelectedLead.geo.toString();
    TempLead.ServiceLines = currentSelectedLead.serviceLines.toString();
    TempLead.SalesType = currentSelectedLead.salesType.toString();
    TempLead.OpportunityId = currentSelectedLead.opportunityId.toString();
    TempLead.BusinessType = currentSelectedLead.businessType.toString();
    TempLead.DigitalAndInnovation = currentSelectedLead.digitalAndInnovation.toString();
    TempLead.DI_Products = currentSelectedLead.diProducts.toString();
    TempLead.DI_ServiceLines = currentSelectedLead.dI_ServiceLines.toString();
    TempLead.EnggServiceLines = currentSelectedLead.enggServiceLines.toString();
    TempLead.Visiblity = currentSelectedLead.visiblity.toString();
    TempLead.UnitPrice = currentSelectedLead.UnitPrice
    TempLead.Quantiy = currentSelectedLead.Quantiy
    console.log('Converted Lead', TempLead);
    return TempLead;
  }

  // j:any=0
  //   FilterByName(ind, pre) {

  // if(pre!=1)
  //   {
  //     (<HTMLInputElement>document.getElementById("myText1")).value=''
  //     this.j=0
  //   }if(pre!=2)
  //   {
  //     (<HTMLInputElement>document.getElementById("myText2")).value=''
  //     this.j=0
  //   }if(pre!=3)
  //   {
  //     (<HTMLInputElement>document.getElementById("myText3")).value=''
  //     this.j=0
  //   }if(pre!=4)
  //   {
  //     (<HTMLInputElement>document.getElementById("myText4")).value=''
  //     this.j=0
  //   }if(pre!=5)
  //   {
  //     (<HTMLInputElement>document.getElementById("myText5")).value=''
  //     this.j=0
  //   }if(pre!=6)
  //   {
  //     (<HTMLInputElement>document.getElementById("myText6")).value=''
  //     this.j=0
  //   }if(pre!=7)
  //   {
  //     (<HTMLInputElement>document.getElementById("myText7")).value=''
  //     this.j=0
  //   }if(pre!=8)
  //   {
  //     (<HTMLInputElement>document.getElementById("myText8")).value=''
  //     this.j=0
  //   }
  //   if(pre!=9)
  //   {
  //     (<HTMLInputElement>document.getElementById("myText9")).value=''
  //     this.j=0
  //   }if(pre!=10)
  //   {
  //     (<HTMLInputElement>document.getElementById("myText10")).value=''
  //     this.j=0
  //   }if(pre!=11)
  //   {
  //     (<HTMLInputElement>document.getElementById("myText11")).value=''
  //     this.j=0
  //   }


  //     // Declare variables**************************** */ 
  //     var input, filter, table, tr, td, i, txtValue;
  //     //********************************************** */
  //     console.log(ind.target.value.length)

  //     this.config = {
  //       itemsPerPage: this.leads.length,
  //       currentPage: 1,
  //       totalItems: this.collection.count
  //     };

  //     if(ind.target.value.length== 0)
  //     {
  //       this.config = {
  //         itemsPerPage: 10,
  //         currentPage: 1,
  //         totalItems: this.collection.count
  //       }; 
  //     }
  //     console.log(ind)
  //     input = ind.target.value;
  //     filter = input.toUpperCase();
  //     table = document.getElementsByTagName('table')[0];
  //     console.log(table);
  //     tr = table.rows;
  //     // Loop through all table rows, and hide those who don't match the search query
  //     console.log(tr.length);
  //     for (i = 0; i < tr.length; i++) {
  //       if(tr.length == i) {
  //         console.log("j");
  //         tr[i].style.display = "none";


  //       }
  //       td = tr[i].getElementsByTagName("td")[pre];
  //       console.log(td);
  //       if (td) {

  //         console.log( td.textContent)
  //         console.log( td.innerText)

  //         txtValue = td.textContent || td.innerText;
  //         console.log( txtValue.toUpperCase().indexOf(filter))
  //         if (txtValue.toUpperCase().indexOf(filter) == (0)) {
  //           console.log(i)

  //           tr[i].style.display = "";
  //           // this.j=this.j+1
  //           // if(this.j>10)
  //           // {
  //           //   this.config = {
  //           //     itemsPerPage: 10,
  //           //     currentPage: 1,
  //           //     totalItems: this.j.count
  //           //   };
  //           // }


  //         }
  //         else if(pre == 10 || pre == 11)
  //         {

  //           if (txtValue.toUpperCase().indexOf(filter) == (1)) {
  //             console.log(i)

  //             tr[i].style.display = "";


  //           }
  //           else{
  //             console.log(i)
  //             tr[i].style.display = 'None';

  //           }
  //         }
  //         else{
  //           console.log(i)
  //           tr[i].style.display = 'None';

  //         }


  //       }
  //     }


  //   }

}
