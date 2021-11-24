import { Component, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { environment } from 'src/environments/environment';
import { ProjectDashboardComponent } from '../projectDashboard/projectDashboard.component';
import { LeadDashboardService } from 'src/app/Provider/leadDashboard.service';
import { ProjectDashboardService } from 'src/app/Provider/ProjectDashboard.service';
import { OpportunityDashboardService } from 'src/app/Provider/OpportunityDashboard.service';

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_kelly);
am4core.useTheme(am4themes_animated);
// Themes end
// Themes end
am4core.addLicense(environment.licence);
@Component({
  selector: 'app-alldashboard',
  templateUrl: './alldashboard.component.html',
  styleUrls: ['./alldashboard.component.css']
})
export class AlldashboardComponent implements OnInit {
  public currentOwnerId = +localStorage.getItem("Auth");
  

  constructor(private _projectDashboardService:ProjectDashboardService,
    private _leadDashboardService:LeadDashboardService,
    private _opportunityDashboardService:OpportunityDashboardService) { 
      this.getLeadsByStatus();
      this.getOpportunitiesByStatus();
      this.getProjectByStatus();
    
      this.leadCount =  Number.parseInt(localStorage.getItem("NumberOfLeads"))
      this.OppCount = Number.parseInt(localStorage.getItem("NumberOfOpportunities"))
      this.ProjectCount = Number.parseInt(localStorage.getItem("NumberOfProjects"))
  }
  leadCount:any
  ProjectCount:any
  OppCount:any
  ngOnInit(): void {
  }

  LeadsBySourceChart() {
    // Create chart instance
    let chart = am4core.create("leaddiv", am4charts.PieChart);
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "Value";
    pieSeries.dataFields.category = "Content";
    // Let's cut a hole in our Pie chart the size of 30% the radius
    chart.innerRadius = am4core.percent(40);
    // Put a thick white border around each Slice
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template
      // change the cursor on hover to make it apparent the object can be interacted with
      .cursorOverStyle = [
        {
          "property": "cursor",
          "value": "pointer"
        }
      ];
    pieSeries.alignLabels = false;
    pieSeries.labels.template.bent = true;
    pieSeries.labels.template.disabled = true;

    pieSeries.labels.template.radius = 3;
    pieSeries.labels.template.padding(0, 0, 0, 0);
    pieSeries.ticks.template.disabled = true;
    // Create a base filter effect (as if it's not there) for the hover to return to
    let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
    shadow.opacity = 0;
    // Create hover state
    let hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists 
    // Slightly shift the shadow and make it more prominent on hover
    let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
    hoverShadow.opacity = 0.7;
    hoverShadow.blur = 5;
    // Add a legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = "right";
    chart.data = this.Leadchartdata;
  }

  OpprtunityBySourceChart() {
    // Create chart instance
    let chart = am4core.create("oppdiv", am4charts.PieChart);
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "Value";
    pieSeries.dataFields.category = "Content";
    // Let's cut a hole in our Pie chart the size of 30% the radius
    chart.innerRadius = am4core.percent(40);
    // Put a thick white border around each Slice
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template
      // change the cursor on hover to make it apparent the object can be interacted with
      .cursorOverStyle = [
        {
          "property": "cursor",
          "value": "pointer"
        }
      ];
    pieSeries.alignLabels = false;
    pieSeries.labels.template.bent = true;
    pieSeries.labels.template.disabled = true;

    pieSeries.labels.template.radius = 3;
    pieSeries.labels.template.padding(0, 0, 0, 0);
    pieSeries.ticks.template.disabled = true;
    // Create a base filter effect (as if it's not there) for the hover to return to
    let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
    shadow.opacity = 0;
    // Create hover state
    let hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists 
    // Slightly shift the shadow and make it more prominent on hover
    let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
    hoverShadow.opacity = 0.7;
    hoverShadow.blur = 5;
    // Add a legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = "right";
    chart.data = this.Opportunitychartdata;
  }

  ProjectBySourceChart() {
    // Create chart instance
    let chart = am4core.create("projdiv", am4charts.PieChart);
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "Value";
    pieSeries.dataFields.category = "Content";
    // Let's cut a hole in our Pie chart the size of 30% the radius
    chart.innerRadius = am4core.percent(40);
    // Put a thick white border around each Slice
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;

    pieSeries.slices.template
      // change the cursor on hover to make it apparent the object can be interacted with
      .cursorOverStyle = [
        {
          "property": "cursor",
          "value": "pointer"
        }
      ];
    pieSeries.alignLabels = false;
    pieSeries.labels.template.bent = true;
    pieSeries.labels.template.radius = 3;
    pieSeries.labels.template.disabled = true;
    pieSeries.labels.template.padding(0, 0, 0, 0);
    pieSeries.ticks.template.disabled = true;
    
    // Create a base filter effect (as if it's not there) for the hover to return to
    let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
    shadow.opacity = 0;
    // Create hover state
    let hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists 
    // Slightly shift the shadow and make it more prominent on hover
    let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
    hoverShadow.opacity = 0.7;
    hoverShadow.blur = 5;
    // Add a legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = "right";
    
    chart.data = this.Projectchartdata;
  }
  Leadchartdata:any
  NumberOfLeads:any
  getLeadsByStatus() {
    let obj: any = {
      id: this.currentOwnerId
    }
    this._leadDashboardService.GetLeadsCount(obj).subscribe(
      (data) => {
      
        this.Leadchartdata = data
        console.log(data)
        this.LeadsBySourceChart();
        this.NumberOfLeads = data[0].TotalCount;
        console.log('From BackEnd ', this.Leadchartdata);
        
      },
      (error) => {
        console.log('Log the error here: ', error);
      }
    )
  }

  Opportunitychartdata:any 
  NumberOfOpportunities:any
  getOpportunitiesByStatus() {
    let obj: any = {
      id: this.currentOwnerId
    }
    this._opportunityDashboardService.GetOpportunitiesCount(obj).subscribe(
      (data) => {
        this.Opportunitychartdata=data;
        console.log(data)
        this.OpprtunityBySourceChart();
        this.NumberOfOpportunities = this.Opportunitychartdata[0].TotalCount;
        console.log('Opportunitychartdata From BackEnd ', this.NumberOfOpportunities);
        console.log('Opportunitychartdata', this.Opportunitychartdata);
      },
      (error) => {
        console.log('Log the error here: ', error);
      }
    )
  }
  Projectchartdata:any
  NumberOfProjects:any
  getProjectByStatus() {
    let obj: any = {
      id: this.currentOwnerId
    }
    this._projectDashboardService.GetProjectCount(obj).subscribe(
      (data) => {
        this.Projectchartdata=data;
        console.log(data)
        this.ProjectBySourceChart();
        this.getFunelChart();
        this.NumberOfProjects = this.Projectchartdata[0].TotalCount;
        console.log('Opportunitychartdata From BackEnd ', this.NumberOfProjects);
        console.log('Opportunitychartdata', this.Projectchartdata);
      },
      (error) => {
        console.log('Log the error here: ', error);
      }
    )
  }
   
  getFunelChart()
  {
    let chart = am4core.create("Funchartdiv", am4charts.SlicedChart);
chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

chart.data = [{
    "name": "Leads",
    "value": this.leadCount
}, {
    "name": "Opportunities",
    "value": this.OppCount
}, {
    "name": "Projects",
    "value": this.ProjectCount
}];

let series = chart.series.push(new am4charts.FunnelSeries());
series.colors.step = 2;
series.dataFields.value = "value";
series.dataFields.category = "name";
series.alignLabels = true;

series.labelsContainer.paddingLeft = 15;
series.labelsContainer.width = 200;

//series.orientation = "horizontal";
//series.bottomRatio = 1;

chart.legend = new am4charts.Legend();
chart.legend.position = "right";
chart.legend.valign = "bottom";
chart.legend.margin(5,5,20,5);


  }
}
