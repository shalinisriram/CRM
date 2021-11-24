import { Component, OnInit, PipeTransform, ViewChild } from '@angular/core';
import { EditLead } from '../Leads/EditLead';
import { Lead } from '../Leads/Lead';
import { LeadService } from '../Provider/lead.service';
import { OppertunityLeadsService } from '../Provider/oppertunityLeads.service';
import { Opportunity } from './Opportunity';
import { EditOpportunity } from './EditOpportunity';
import { SearchDate } from '../Utility/SearchDate';
import { CustomDropDownData } from '../Utility/CustomDropDownData';
import { jsPDF } from "jspdf";
import html2canvas from 'Html2Canvas';
import { DAProductsPipe } from './../Utility/DAProducts.pipe';
import { Quote } from '../Utility/Quote';
import { Key } from 'protractor';
import { Console } from 'console';
import { CurrencyPipe } from '@angular/common';
import { ProformaInvoice } from '../Utility/ProformaInvoice';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-Opportunities',
  templateUrl: './Opportunities.component.html',
  styleUrls: ['./Opportunities.component.css']
})
export class OpportunitiesComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  persons: any;
  dtTrigger: any = new Subject();

  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;

  public Opportunites: any = [];
  public value: any;
  public Opportunity: Opportunity;
  public CurrentLeadEdit: any;
  public UtilityData: CustomDropDownData;
  public QuoteOffering: any;
  public productnamepipe: DAProductsPipe;
  public DeviceQuantity: any;
  public PerformaDeviceQuantity: any;
  public CommentsRemarks: string;
  public PerformaCommentsRemarks: string;
  public currentOwnerId: any;
  collection = { count: 0, data: [] };
  PaymentMode:any=['Invoice Raised','Proforma  Invoice Raised','Payment Received']

  public config: any;
  loading:boolean = false
  UserName:any
  Unity:any
  qty:any
  public month: number = new Date().getMonth();
  public fullYear: number = new Date().getFullYear();
  public Day: number = new Date().getDate();
  constructor(private _authLeadService: OppertunityLeadsService) {
    this.value = [new Date(this.fullYear, this.month , this.Day-7), new Date(this.fullYear, this.month, this.Day)];
    var isTue = localStorage.getItem("startOp")
    if(isTue != null)
    {
      localStorage.setItem("startDateOp",this.value[0])
      localStorage.setItem("endDateOp",this.value[1])
    }
    this.currentOwnerId = +localStorage.getItem("Auth");
    this.UserName = localStorage.getItem("user");
    let obj: any = {
      id: this.currentOwnerId
    }
    // this._authLeadService.GetAllOpertunityLeads(obj).subscribe(
    //   (data) => {
    //     console.log('Result ', data);
    //     this.Opportunites = data;
    //     this.collection.count = this.Opportunites.length
    //     for (var i = 0; i < this.collection.count; i++) {
    //       this.collection.data.push(
    //         {
    //           id: i + 1,
    //           value: this.Opportunites[i]
    //         }
    //       );
    //     }
    //   },
    //   (error) => {
    //     console.log('Log the error here: ', error);
    //   }
    // );

    this.dtOptions = {
      destroy: true,
      ordering: true,
      pagingType: 'full_numbers',
      pageLength: 6
    };
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.collection.count
    };
    this.GetDataOnSelectedDates();
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
  
  onPercentChange(nt:any)
  {
    this.Opportunity.ForecastedValue = (this.Opportunity.UnitPrice*this.Opportunity.Quantiy).toString();
    this.CurrentLeadEdit.forecastedValue=(this.CurrentLeadEdit.UnitPrice*this.CurrentLeadEdit.Quantiy).toString();
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
    
    this.CommentsRemarks = "";
    this.DeviceQuantity = 0;
    this.PerformaCommentsRemarks = "";
    this.Opportunity = new Opportunity;
    this.QuoteOffering = new EditOpportunity;
    this.UtilityData = new CustomDropDownData();
    this.Opportunity.Status = '0';   // By Default it will be  Lead Closed-Converted
    this.CurrentLeadEdit = new EditOpportunity();
    this.currentOwnerId = +localStorage.getItem("Auth");
    let obj: any = {
      id: this.currentOwnerId
    }
    // this._authLeadService.GetAllOpertunityLeads(obj).subscribe(
    //   (data) => {
    //     console.log('Result ', data);
    //     this.Opportunites = data;
    //   },
    //   (error) => {
    //     console.log('Log the error here: ', error);
    //   }
    // );
  }

  AddOpp:boolean=false
  AddOppertunity() {
    this.AddOpp =true
    this.Opportunity.OwnerId = this.currentOwnerId.toString();
    console.log('Oppurtunity Lead', this.Opportunity);
    this._authLeadService.addOppurtunityLead(this.Opportunity).subscribe(
      (data) => {
        console.log('Result ', data);
        if (data === true) {
          alert("Oppurtunity Added");
          this.GetDataOnSelectedDates();
          this.AddOpp =false
          this.UpdateLeadTable();
        } else {
          alert("Failed To Add Oppurtunity due to Email address already exist");
          this.AddOpp =false
        }
      },
      (error) => {
        console.log('Log the error here: ', error);
        this.AddOpp =false
      }
    );
  }
  Saveloading:boolean =false
  Datalist:any
  AddEditOpportunityLead() {
    this.Saveloading = true
    let EditedLead = this.GetEditedLead(this.CurrentLeadEdit);
    console.log("Edited Lead Send", EditedLead);
    this._authLeadService.EditOppurtunityLead(EditedLead).subscribe(
      (data) => {
        console.log('Result ', data);
        if (data === true) {
          this.Saveloading =false;
          this.GetDataOnSelectedDates();
          alert("Opportunity Updated");
          this.UpdateLeadTable();
        } else {
          alert("Failed To Update Opportunity");
          this.Saveloading =false;
        }
      },
      (error) => {
        console.log('Log the error here: ', error);
        this.Saveloading =false;
      }
    );
  }

  editOpportunity(opportunity: any) {
    // this.lead.EditId = lead.Id;  
    this.CurrentLeadEdit = { ...opportunity.value }
    this.CurrentLeadEdit.Quantiy= opportunity.value.quantiy;
    this.CurrentLeadEdit.UnitPrice= opportunity.value.unitPrice;

    this.CurrentLeadEdit.PaymentMode = opportunity.value.paymentMode
    
  }

  UpdateLeadTable() {
    let obj: any = {
      id: this.currentOwnerId
    }
    this._authLeadService.GetAllOpertunityLeads(obj).subscribe(
      (data) => {
        console.log('Result ', data);
        this.Opportunites = data;
      },
      (error) => {
        console.log('Log the error here: ', error);
      }
    );
  }
  isDtInitialized:boolean=false
  GetDataOnSelectedDates() {
    this.value[0]=new Date(localStorage.getItem("startDateOp"))
    this.value[1]=new Date(localStorage.getItem("endDateOp"))
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
      this._authLeadService.GetAllOppurtunityByDates(obj).subscribe(
        (data) => {
          this.collection.data=[]
          console.log('Result from Backend ', data);
          if (data != null) {
            console.log('Result ', data);
            this.Opportunites = data;
            this.collection.count = this.Opportunites.length
        for (var i = 0; i < this.collection.count; i++) {
          this.collection.data.push(
            {
              id: i + 1,
              value: this.Opportunites[i]
            }
          );

         

        }
        this.Datalist=[...this.collection.data]
          
        if (this.isDtInitialized) {
          console.log("hi")
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
      this.UpdateLeadTable();
    }
  }

  dateUpdate()
  {
    localStorage.removeItem("startOp")
    localStorage.removeItem("startDateOp")
    localStorage.removeItem("endDateOp")
    localStorage.setItem("startDateOp",this.value[0])
    localStorage.setItem("endDateOp",this.value[1])
  }

  GetEditedLead(currentSelectedLead: any) {
    let TempLead: Opportunity = new Opportunity;
    console.log('Converted Lead Enter', TempLead);
    TempLead.EditId = currentSelectedLead.id.toString();
    TempLead.Address1 = currentSelectedLead.address1;
    TempLead.Name = currentSelectedLead.name;
    TempLead.LastName = currentSelectedLead.lastName;
    TempLead.Title = currentSelectedLead.title;
    TempLead.Organization = currentSelectedLead.organization;
    TempLead.Status = currentSelectedLead.status.toString();
    TempLead.OpportunityInpState = currentSelectedLead.opportunityInpState.toString();
    TempLead.CurrentState = currentSelectedLead.currentState.toString();
    TempLead.EmailAddress = currentSelectedLead.emailAddress;
    TempLead.Phone = currentSelectedLead.phone;
    TempLead.MobilePhone = currentSelectedLead.mobilePhone;
    TempLead.Fax = currentSelectedLead.fax;
    TempLead.WebSite = currentSelectedLead.webSite;
    TempLead.Industry = currentSelectedLead.industry;
    TempLead.NumberOfEmployees = currentSelectedLead.numberOfEmployees.toString();
    TempLead.ForecastedValue = currentSelectedLead.forecastedValue.toString();
    TempLead.ForecastedValueCurrency = currentSelectedLead.forecastedValueCurrency.toString();
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
    TempLead.UnitPrice = currentSelectedLead.UnitPrice;
    TempLead.Quantiy = currentSelectedLead.Quantiy;
    console.log('Converted Lead', TempLead);

    return TempLead;
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
    table = document.getElementById("OppurtunityTable");
    tr = table.getElementsByTagName("tr");
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      if(tr.length == i) {
        
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

  deleteOpportunity(opportunity: any) {
    console.log(opportunity)
    let opperutnityId: any = {
      id: opportunity.id
    };
    console.log('DeleteOppurtunityById ', opperutnityId);
    if(confirm("Are you sure delete the Opportunity ?")){

      this._authLeadService.DeleteOppurtunityById(opperutnityId).subscribe(
        (data) => {
          console.log('Result ', data);
          if (data === true) {
            alert('Deleted Sucessfully')
  
            this.GetDataOnSelectedDates();
            this.UpdateLeadTable();
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

  GenerateQuote(opportunity: any) {
    this.QuoteOffering = opportunity;
    console.log('QuoteOffering', this.QuoteOffering)
    let id = this.QuoteOffering.id;
    if (id != 0) {
      this.QuoteOffering = opportunity.value;
    }
    console.log('QuoteOffering', this.QuoteOffering)
  }

  GenerateProformaInvoice(opportunity: any) {
    this.QuoteOffering = opportunity;
    console.log('QuoteOffering', this.QuoteOffering)
    let id = this.QuoteOffering.id;
    if (id != 0) {
      this.QuoteOffering = opportunity.value;
    }
    console.log('QuoteOffering', this.QuoteOffering)
  }

  DownloadProformaInvoicePdf() {

    console.log("Performa Invoice", this.QuoteOffering)
    console.log("Performa Device Quantity", this.PerformaDeviceQuantity)
    var Performadoc = new jsPDF();

    Performadoc.addImage("./../../assets/AxiscadesWithLogo.png", "png", 15, 15, 50, 10);
    Performadoc.setFont("helvetica", "normal");
    Performadoc.setFontSize(11);
    Performadoc.rect(10, 10, 195, 277);

    Performadoc.setDrawColor(0, 0, 0);
    Performadoc.rect(10, 30, 195, 10, "FD");
    Performadoc.setFontSize(12);
    Performadoc.setFont("times", "bold");
    Performadoc.setTextColor(225, 225, 225);
    Performadoc.text("PROFORMA INVOICE", 105, 35, { align: 'center' });
    Performadoc.setTextColor(0, 0, 0);
    Performadoc.setFontSize(10);
    Performadoc.setFont("times", 'normal');
    Performadoc.text("Company", 12, 50);
    Performadoc.text("Axiscades Technologies Ltd.", 30, 50);
    Performadoc.text("(formerly Axiscades Engineering Technologies Ltd)", 30, 55);
    Performadoc.text("Kirloskar Business Park, Block 'C', 2nd Floor", 30, 60);
    Performadoc.text("Hebbal, Bangalore - 560 024", 30, 65);
    Performadoc.text("Karnataka, India", 30, 70);
    Performadoc.text("GSTIN: 29AAACI2831G1ZR", 30, 75);

    Performadoc.text("Proforma Invoice No.", 119, 50);
    Performadoc.text("PI-BLR2021D2001", 155, 50);
    let date: any = new Date().getDate().toString() + '-' + (new Date().getMonth() + 1).toString() + '-' + new Date().getFullYear().toString();
    Performadoc.text("Proforma Invoice Date", 119, 55);
    Performadoc.text(date, 155, 55);
    Performadoc.text("PO No.", 119, 60);
    Performadoc.text("***********", 155, 60);
    Performadoc.text("PO Date", 119, 65);
    Performadoc.text("***********", 155, 65);

    Performadoc.text("Buyer", 12, 85);
    Performadoc.text(this.QuoteOffering.name + this.QuoteOffering.lastName, 30, 85);
    Performadoc.text(this.QuoteOffering.organization, 30, 90);
    Performadoc.text(this.QuoteOffering.address1, 30, 95);
    Performadoc.text(this.QuoteOffering.city + ' - ' + this.QuoteOffering.postalCode.toString(), 30, 100);
    Performadoc.text(this.QuoteOffering.state + ' ' + this.QuoteOffering.country, 30, 105);
    Performadoc.text("Email: " + this.QuoteOffering.emailAddress, 30, 110);
    Performadoc.text("Phone: " + this.QuoteOffering.mobilePhone, 30, 115);

    Performadoc.text("Place Of Supply", 12, 120);
    Performadoc.text(this.QuoteOffering.city + ", " + this.QuoteOffering.state + ", " + this.QuoteOffering.country, 35, 125);

    Performadoc.text("Currency.", 119, 120);
    var curren = this.UtilityData.CurrencyStamp[this.QuoteOffering.forecastedValueCurrency];
    Performadoc.text(curren.toString(), 155, 125);

    // var performaheaders = this.createHeaders([
    //   { title: "Item", dataKey: "item" },
    //   { title: "Description", dataKey: "description" },
    //   { title: "HSN", dataKey: "hsn" },
    //   { title: "UOM", dataKey: "uom" },
    //   { title: "Qty", dataKey: "qty" },
    //   { title: "Rate", dataKey: "rate" },
    //   { title: "Total_Amount", dataKey: "total_Amount" },
    //   { title: "Tax_Amount", dataKey: "tax_Amount" },
    // ]);
    // var performaheaders = this.createHeaders([
    //   "Item",
    //   "Description",
    //   "HSN",
    //   "UOM",
    //   "Qty",
    //   "Rate",
    //   "Total_Amount",
    //   "Tax_Amount",
    // ]);
    var performaheaders = [];


    // console.log("Performa Device Quantity 1")
    var data: ProformaInvoice = new ProformaInvoice();
    var rate: number = +11972;
    data.Item = '1';
    // console.log("  data.ItemNo", data.ItemNo)
    data.Description = "WeCareEST Device" + '\n' +
      "Mobile App-Complimentary" + '\n' +
      "Web Application - 6 Months Access Complimentary";
    data.HSN = "9025";
    // console.log(" data.HSN", data.HSN)
    data.UOM = "Nos.";
    // console.log(" data.UOM", data.UOM)
    data.Qty = this.PerformaDeviceQuantity.toString();
    // console.log(" data.Quantity", data.Quantity)
    data.Rate = rate.toString();
    // console.log("Rate", data.Rate)
    var totalamount = new Intl.NumberFormat('en-IN').format(this.PerformaDeviceQuantity * rate);
    data.Total_Amount = totalamount.toString();
    // console.log("TotalAmount", data.TotalAmount) 
    var taxableamount: number = (this.PerformaDeviceQuantity * rate) * 0.09;
    data.Tax_Amount = taxableamount.toString();
    // console.log("TaxableAmount", data.TaxableAmount)
    var grandtotal = ((this.PerformaDeviceQuantity * rate)) + ((this.PerformaDeviceQuantity * rate) * 0.09);
    var performaresult = [];
    data.align = "left";
    // performaresult.push(Object.assign({}, data));
    Performadoc.setFontSize(8);

    // console.log("Performa Device Quantity 2", performaresult)

    var table = Performadoc.table(10, 135, performaresult, performaheaders, {
      fontSize: 9, headerBackgroundColor: '#42b4d6', autoSize: false
    });


    // console.log("Performa Device Quantity 3", performaheaders)

    table.cell(10, 135, 15, 10, 'Item', 1, "center");
    table.cell(10, 135, 75, 10, 'Description', 1, "center");
    table.cell(10, 135, 15, 10, 'HSN', 1, "center");
    table.cell(10, 135, 15, 10, 'UOM', 1, "center");
    table.cell(10, 135, 15, 10, 'QTY', 1, "center");
    table.cell(10, 135, 20, 10, 'Rate', 1, "center");
    table.cell(10, 135, 20, 10, 'Total Amount', 1, "center");
    table.cell(10, 135, 20, 10, 'Taxable Amount', 1, "center");

    table.cell(10, 1, 15, 25, '1', 2, "center");
    table.cell(10, 1, 75, 25, "WeCareEST Device" + '\n' +
      "Mobile App-Complimentary" + '\n' +
      "Web Application - 6 Months Access Complimentary"
      , 2, "center");
    table.cell(10, 1, 15, 25, '9025', 2, "center");
    table.cell(10, 1, 15, 25, 'Nos', 2, "center");
    table.cell(10, 1, 15, 25, this.PerformaDeviceQuantity.toString(), 2, "center");
    table.cell(10, 1, 20, 25, rate.toString(), 2, "center");
    table.cell(10, 1, 20, 25, totalamount.toString(), 2, "center");
    table.cell(10, 1, 20, 25, taxableamount.toString(), 2, "center");

    // console.log("Performa Device Quantity 4", performaheaders)

    table.cell(10, 1, 15, 10, '  ', 3, "center");
    table.cell(10, 1, 75, 10, "Sub Total", 3, "center");
    table.cell(10, 1, 15, 10, '  ', 3, "center");
    table.cell(10, 1, 15, 10, '  ', 3, "center");
    table.cell(10, 1, 15, 10, '  ', 3, "center");
    table.cell(10, 1, 20, 10, '  ', 3, "center");
    table.cell(10, 1, 20, 10, totalamount.toString(), 3, "center");
    table.cell(10, 1, 20, 10, taxableamount.toString(), 3, "center");


    table.cell(10, 1, 15, 20, '  ', 4, "center");
    table.cell(10, 1, 75, 20, "CGST" + '\n' + "SGST" + '\n' + "IGST", 4, "center");
    table.cell(10, 1, 15, 20, '  ', 4, "center");
    table.cell(10, 1, 15, 20, '  ', 4, "center");
    table.cell(10, 1, 15, 20, '  ', 4, "center");
    table.cell(10, 1, 20, 20, '  ', 4, "center");
    table.cell(10, 1, 20, 20, "9%" + '\n' + "9%" + '\n' + "18%", 4, "right");
    var sgst = taxableamount / 2;

    // console.log("Performa Device Quantity 5", performaheaders)
    if (this.QuoteOffering.city.toUpperCase() === "BENGALURU") {
      table.cell(10, 1, 20, 20, sgst.toString() + '\n' + sgst.toString() + '\n' + "-", 4, "center");
    }
    else {
      table.cell(10, 1, 20, 20, "-" + '\n' + "-" + '\n' + taxableamount.toString(), 4, "center");
    }


    // console.log("Performa Device Quantity 6", performaheaders)

    table.cell(10, 1, 15, 10, '  ', 5, "center");
    table.cell(10, 1, 75, 10, "Grand Total", 5, "center");
    table.cell(10, 1, 15, 10, '  ', 5, "center");
    table.cell(10, 1, 15, 10, '  ', 5, "center");
    table.cell(10, 1, 15, 10, '  ', 5, "center");
    table.cell(10, 1, 20, 10, '  ', 5, "center");
    table.cell(10, 1, 20, 10, "  ", 5, "right");
    table.cell(10, 1, 20, 10, grandtotal.toString(), 5, "right");




    table.cell(10, 1, 195, 30, "Beneficiary Bank details	" + '\n' +
      "Beneficiary's Name    AXISCADES Technologies Ltd." + '\n' +
      "Bank Name		RBL Bank Ltd." + '\n' +
      "Bank Address		G-13, G-14, G-15 & G-17, Prestige Towers 99 & 100 Residency Road Bangalore - 560 025" + '\n' +
      "A/C No.  409000694615" + '\n' +
      "IFSC     RATN0000156", 6, "left");

    // console.log("Performa Device Quantity 7", performaheaders)

    if (this.PerformaCommentsRemarks != '') {
      // console.log("Performa Device Quantity 7.5", this.PerformaCommentsRemarks)
      Performadoc.text("Remarks:", 12, 245);
      Performadoc.text(this.PerformaCommentsRemarks.toString(), 12, 250);
    }
    // table.cell(10, 1, 155, 8, 'Sub Total', 2, "left");
    // table.cell(155, 1, 20, 8, 'Sub Total', 2, "left");
    // table.cell(175, 1, 20, 8, 'Sub Total', 2, "left");
    // table.cell(10, 1, 195, 8, 'CGST', 2, "left");
    // table.cell(10, 1, 195, 8, 'SGST', 3, "left");
    // table.cell(10, 1, 195, 8, 'IGST', 4, "left");
    // table.cell(10, 1, 195, 8, 'Grand Total', 5, "left");
    // table.cell(10, 1, 10, 20, '1', 1, "left");
    // table.cell(20, 1, 80, 20, "WeCareEST Device" + '\n' +
    //   "Mobile App-Complimentary" + '\n' +
    //   "Web Application - 6 Months Access Complimentary", 1, "left");
    // table.cell(100, 1, 15, 20, '9025', 1, "left");
    // table.cell(120, 1, 15, 20, 'Nos', 1, "left");
    // table.cell(140, 1, 15, 20, this.PerformaDeviceQuantity.toString(), 1, "left");
    // table.cell(160, 1, 15, 20, rate.toString(), 1, "left");
    // table.cell(180, 1, 15, 20, totalamount.toString(), 1, "left");
    // table.cell(200, 1, 18, 20, taxableamount.toString(), 1, "left");
    // table.cell(200, 1, 18, 20, grandtotal.toString(), 1, "left");

    // console.log("Performa Device Quantity 8", performaheaders)
    Performadoc.setTextColor(0, 0, 0);
    Performadoc.setFontSize(12);
    Performadoc.setFont("times", "bold");
    Performadoc.text("AXISCADES Technologies Limited", 105, 265, { align: 'center' });
    Performadoc.setFontSize(10);
    Performadoc.setFont("times", "normal");
    Performadoc.text("(Formerly AXISCADES Engineering Technologies Limited)", 105, 270, { align: 'center' });
    Performadoc.text("CIN No : L72200KA1990PLC084435 PAN : AAACI2831G", 105, 275, { align: 'center' });
    Performadoc.text("Reg. Office: Block C, Second Floor, Kirloskar Business Park, Bengaluru - 560024, Karnataka, INDIA", 105, 280, { align: 'center' });
    Performadoc.text("Ph: +91 80 4193 9000 | Fax: +91 80 4193 9099 | Email: info@axiscades.com | www.axiscades.com", 105, 285, { align: 'center' });

    // console.log("Performa Device Quantity 9", performaheaders)
    Performadoc.setFontSize(10);
    Performadoc.setDrawColor(0);
    Performadoc.setFillColor(20, 135, 177);
    Performadoc.roundedRect(0, 290, 210, 10, 0, 0, "FD");
    Performadoc.text("For more Details http://wecare.axiscades.com/", 105, 295, { align: 'center' });

    // console.log("Performa Device Quantity 10", performaheaders)
    Performadoc.save();
  }



  DownloadPdf() {

    // var element = document.getElementById('getQuote');

    // html2canvas(element).then((Canvas) => {
    //   console.log(Canvas); 
    //   var imageData = Canvas.toDataURL('image/png')
    //   var doc = new jsPDF('landscape');
    //   doc.setFont("helvetica", "bold");
    //   doc.text("This is helvetica bold.", 20, 50);
    //   doc.addImage(imageData, 0, 0, 200, 450);
    //   doc.save();
    // })  
    var doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    var date: Date = new Date();
    var referenceNumber = 'WeCareEST-BLR-' + date.getDate().toString() + (date.getMonth() + 1).toString() + '0121';
    doc.text("Date :" + date, 10, 20);
    doc.text("Ref No :" + referenceNumber, 10, 30);
    doc.setFontSize(16);
    doc.text("Commercial Offering For : WeCareEST", 105, 40, { align: 'center' });


    doc.addImage("./../../assets/AxiscadesWithLogo.png", "png", 150, 10, 50, 10);
    // doc.setDrawColor(20, 135, 177);

    // doc.rect(10, 30, 190, 90);
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, 50, 190, 50, 3, 3, "FD");

    doc.setFont("times", "bold");
    doc.text("To ,", 12, 60);
    doc.setFont("times", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(this.QuoteOffering.name + this.QuoteOffering.lastName, 12, 65);
    console.log('3');
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(this.QuoteOffering.organization, 12, 70);
    doc.text(this.QuoteOffering.address1, 12, 75);
    doc.text(this.QuoteOffering.city + ' - ' + this.QuoteOffering.postalCode, 12, 80);
    doc.text(this.QuoteOffering.state + ' ' + this.QuoteOffering.country, 12, 85);
    doc.text("Email: " + this.QuoteOffering.emailAddress, 12, 90);
    doc.text("Phone: " + this.QuoteOffering.mobilePhone, 12, 95);

    // var headers = this.createHeaders([
    //   "Id",
    //   "Item",
    //   "Qty",
    //   "Rate \n (INR)",
    //   "Amount \n (INR)",
    //   "CGST \n (9%)",
    //   "SGST \n (9%)",
    //   "Total \n (INR)"
    // ]);

    var headers = this.createHeaders([
      "Id",
      "Item",
      "Qty",
      "Rate",
      "Amount",
      "CGST",
      "SGST",
      "Total"
    ]);

    // var rate: number = 10972; //14912 
    // if (this.DeviceQuantity < 20) {
    var rate: number = 11972; //14912 
    // }

    var data: Quote = new Quote();
    data.Id = '1';
    data.Item = "WeCareEST Device" + '\n' +
      "Remote Monitoring Display-Complimentary" + '\n' +
      "Mobile App-Complimentary" + '\n' +
      "Web Application - 6 Months Access Complimentary";
    data.Qty = this.DeviceQuantity.toString();
    data.Rate = new Intl.NumberFormat('en-IN').format(rate).toString();
    data.Amount = new Intl.NumberFormat('en-IN').format((this.DeviceQuantity * rate));
    console.log('currency', '\u20B9' + (this.DeviceQuantity * rate));
    var gstvalue = (this.DeviceQuantity * rate) * 0.09;
    data.CGST = new Intl.NumberFormat('en-IN').format((this.DeviceQuantity * rate) * 0.09).toString();
    data.SGST = new Intl.NumberFormat('en-IN').format((this.DeviceQuantity * rate) * 0.09).toString();
    data.Total = new Intl.NumberFormat('en-IN').format((this.DeviceQuantity * rate) + gstvalue + gstvalue).toString();
    data.align = 'left';
    var result = [];
    var data2: Quote = new Quote();
    result.push(Object.assign({}, data));
    console.log('data', result);
    // console.log('headers', headers);
    doc.setFontSize(10);
    doc.table(10, 110, result, headers, { fontSize: 10, headerBackgroundColor: '#42b4d6' });


    doc.text("(All Prices Are In INR)", 170, 155);

    if (this.CommentsRemarks != '') {
      doc.text("Remarks:", 12, 160);
      doc.text(this.CommentsRemarks, 12, 165);
    }

    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, 190, 190, 35, 0, 0, "FD");

    doc.setTextColor(20, 135, 177);
    doc.setFontSize(14);
    doc.text("Terms and Conditions:", 12, 200);
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("times", "normal");
    doc.text("1.  100% Payment against delivery.", 12, 210);
    doc.text("2.  Estimated Delivery : 1- 2 weeks (STD)", 12, 215);
    doc.text("3.  3 Months warranty on WeCareEST Device for manufacturing defects only", 12, 220);


    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("AXISCADES Technologies Limited", 105, 265, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.text("(Formerly AXISCADES Engineering Technologies Limited)", 105, 270, { align: 'center' });
    doc.text("CIN No : L72200KA1990PLC084435", 105, 275, { align: 'center' });
    doc.text("Reg. Office: Block C, Second Floor, Kirloskar Business Park, Bengaluru - 560024, Karnataka, INDIA", 105, 280, { align: 'center' });
    doc.text("Ph: +91 80 4193 9000 | Fax: +91 80 4193 9099 | Email: info@axiscades.com | www.axiscades.com", 105, 285, { align: 'center' });

    doc.setFontSize(10);
    doc.setDrawColor(0);
    doc.setFillColor(20, 135, 177);
    doc.roundedRect(0, 290, 210, 10, 0, 0, "FD");
    doc.text("For more Details http://wecare.axiscades.com/", 105, 295, { align: 'center' });
    doc.save();
    this.DeviceQuantity = 0;
  }

  createHeaders(keys) {
    var result = [];
    // console.log('Headers', keys);
    for (var i = 0; i < keys.length; i += 1) {
      var obj = {
        Id: keys[i],
        name: keys[i],
        prompt: keys[i],
        width: 22,
        align: "right",
        padding: 0
      }
      if (i === 0) {
        obj.width = 15;
      }
      if (i === 1) {
        obj.width = 110;
        obj.align = 'left';
      }
      result.push(obj);
    }
    // console.log('result', result);
    return result;
  }



}
