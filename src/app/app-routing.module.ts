import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadDashboardComponent } from './Dashboard/leadDashboard/leadDashboard.component';
import { LeadsComponent } from './Leads/Leads.component';
import { LoginComponent } from './login/login.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { NewUsersComponent } from './newUsers/newUsers.component';
import { OpportunitiesComponent } from './Opportunities/Opportunities.component';
import { ProjectComponent } from './project/project.component';
import { UnAuthorizedComponent } from './UnAuthorized/UnAuthorized.component';
import { AuthGuardService as AuthGuard } from '../app/Provider/auth-guard.service';
import { ContactsComponent } from './contacts/contacts.component';
import { OrganizationComponent } from './Organization/Organization.component';

const routes: Routes = [
  {
    // path: '',
    // component: MainpageComponent,
    // data: { name: '', code: '' }, 
    path: '',
    component: MainpageComponent,
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
      },
      {
        path: 'contacts',
        component: ContactsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'organizations',
        component: OrganizationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        component: MainpageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'leads',
        component: LeadsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'Opportunities',
        component: OpportunitiesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'customdashboard',
        component: LeadDashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'Projects',
        component: ProjectComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        component: NewUsersComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'unAuth',
    component: UnAuthorizedComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
