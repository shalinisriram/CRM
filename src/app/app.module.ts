import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideNavComponent } from './SideNav/SideNav.component';
import { LeadsComponent } from './Leads/Leads.component';
import { FormsModule } from '@angular/forms';
import { MainpageComponent } from './mainpage/mainpage.component';
import { HttpClientModule } from '@angular/common/http';
import { NewUsersComponent } from './newUsers/newUsers.component';
import { OpportunitiesComponent } from './Opportunities/Opportunities.component';
import { StatusPipe } from './Leads/StatusPipe';
import { LoginComponent } from './login/login.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LeadDashboardComponent } from './Dashboard/leadDashboard/leadDashboard.component';
import { LeadSbDashboardComponent } from './Dashboard/leadSbDashboard/leadSbDashboard.component';
import { GeoPipe } from './Leads/geoPipe';
import { ServicePipe } from './Leads/servicePipe';
import { OpportunityStatus } from './Opportunities/opportunityStatus';
import { ProjectComponent } from './project/project.component';
import { CurrentStatus } from './project/CurrentStatus';
import { CurrencyPipe } from './Leads/currencyPipe';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { OfferingPipe } from './Utility/offeringPipe';
import { BusinessPipe } from './Utility/businessPipe';
import { OpportunityStatusPipe } from './Utility/OpportunityStatusPipe';
import { DAProductsPipe } from './Utility/DAProducts.pipe';
import { DaTmProjectsPipe } from './Utility/DaTmProjects.pipe';
import { EnggTmProjectsPipe } from './Utility/EnggTmProjects.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { UnAuthorizedComponent } from './UnAuthorized/UnAuthorized.component';
import { AuthenticationService } from './Provider/Authentication.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ContactsComponent } from './contacts/contacts.component';
import { OrganizationComponent } from './Organization/Organization.component';
import { OpportunityDashboardComponent } from './Dashboard/opportunityDashboard/opportunityDashboard.component';
import { SpinnersAngularModule } from 'spinners-angular';
import { SpinnerCircularModule } from 'spinners-angular/spinner-circular';
import { LeadStatusPipe } from './Leads/leadstatusPip';
import { ProjectDashboardComponent } from './Dashboard/projectDashboard/projectDashboard.component';
import { DataTablesModule } from 'angular-datatables';
import { AlldashboardComponent } from './Dashboard/alldashboard/alldashboard.component';
import { FiledetailesComponent } from './filedetailes/filedetailes.component';


@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    LeadsComponent,
    MainpageComponent,
    NewUsersComponent,
    OpportunitiesComponent,
    StatusPipe,
    GeoPipe,
    ServicePipe,
    CurrencyPipe,
    OfferingPipe,
    LeadStatusPipe,
    BusinessPipe,
    OpportunityStatusPipe,
    DAProductsPipe,
    DaTmProjectsPipe,
    EnggTmProjectsPipe,
    LoginComponent,
    OpportunityStatus,
    CurrentStatus,
    LeadDashboardComponent,
    LeadSbDashboardComponent,
    ProjectDashboardComponent,
    ProjectComponent,
    UnAuthorizedComponent,
    ContactsComponent,
    OrganizationComponent,
    OpportunityDashboardComponent,
    AlldashboardComponent,
    FiledetailesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DateRangePickerModule,
    DataTablesModule,
    FormsModule ,
    SpinnersAngularModule ,
    SpinnerCircularModule ,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    NgxPaginationModule,
  ],
  providers: [AuthenticationService, JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
