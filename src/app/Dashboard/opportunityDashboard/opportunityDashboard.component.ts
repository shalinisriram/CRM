import { Component, OnInit } from '@angular/core';
import { OpportunityDashboardService } from 'src/app/Provider/OpportunityDashboard.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { environment } from 'src/environments/environment';

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_kelly);
am4core.useTheme(am4themes_animated);
// Themes end
// Themes end
am4core.addLicense(environment.licence);

@Component({
  selector: 'app-opportunityDashboard',
  templateUrl: './opportunityDashboard.component.html',
  styleUrls: ['./opportunityDashboard.component.css']
})
export class OpportunityDashboardComponent implements OnInit {

  Opportunitychartdata: any[];
  OpportunitySourceData: any;
  OpportunityStatusByMonthData: any;
  NumberOfOpportunities: any;


  public currentOwnerId = +localStorage.getItem("Auth");
  constructor(private _opportunityDashboardService: OpportunityDashboardService) { }

  ngOnInit() {
    this.Opportunitychartdata = [];
    this.getOpportunitiesByStatus();
    this.getOpportunitiesBySource();
    this.getOpportunitiesStatusByMonth();
  }

  getOpportunitiesByStatus() {
    let obj: any = {
      id: this.currentOwnerId
    }
    this._opportunityDashboardService.GetOpportunitiesCountByStatus(obj).subscribe(
      (data) => {
        this.Opportunitychartdata.push(data);
        this.generateOpportunitiesByStatusChart();
        this.NumberOfOpportunities = this.Opportunitychartdata[0].TotalCount;
        localStorage.setItem("NumberOfOpportunities",this.NumberOfOpportunities)
        console.log('Opportunitychartdata From BackEnd ', this.NumberOfOpportunities);
        console.log('Opportunitychartdata', this.Opportunitychartdata);
      },
      (error) => {
        console.log('Log the error here: ', error);
      }
    )
  }

  getOpportunitiesBySource() {
    let obj: any = {
      id: this.currentOwnerId
    }
    this._opportunityDashboardService.GetOpportunitiesCountBySource(obj).subscribe(
      (data) => {
        this.OpportunitySourceData = data;
        console.log('getLeadBySource From BackEnd ', this.OpportunitySourceData);
        this.generateOpportunitiesBySourceChart();
      },
      (error) => {
        console.log('Log the error here: ', error);
      }
    )
  }

  getOpportunitiesStatusByMonth() {
    let obj: any = {
      id: this.currentOwnerId
    }
    this._opportunityDashboardService.GetOpportunitiesStatusByMonth(obj).subscribe(
      (data) => {
        this.OpportunityStatusByMonthData = data;
        console.log('getLeadStatusByMonth From BackEnd ', this.OpportunityStatusByMonthData);
        this.generateOpportunitiesStatusByMonthChart();
      },
      (error) => {
        console.log('Log the error here: ', error);
      }
    )
  }

  generateOpportunitiesByStatusChart() {
    let Oppchartchart = am4core.create("Oppchartdiv", am4charts.XYChart);

    Oppchartchart.exporting.menu = new am4core.ExportMenu();
    Oppchartchart.exporting.menu.align = "right";
    Oppchartchart.exporting.menu.verticalAlign = "top";
    Oppchartchart.hiddenState.properties.opacity = 0;
    Oppchartchart.data = this.Opportunitychartdata
    console.log('Chart Data  Preview', Oppchartchart.data);
    Oppchartchart.colors.step = 2;
    Oppchartchart.padding(30, 30, 10, 30);
    Oppchartchart.legend = new am4charts.Legend();
    Oppchartchart.legend.position = "right";
    
    let categoryAxis = Oppchartchart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;

    let valueAxis = Oppchartchart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;
    valueAxis.calculateTotals = true;
    valueAxis.renderer.minWidth = 50;
    valueAxis.setVisibility(false);


    let series1 = Oppchartchart.series.push(new am4charts.ColumnSeries());
    series1.columns.template.width = am4core.percent(90);
    series1.columns.template.tooltipText =
      "{name}: {valueY}";
    series1.name = "Abandonded";
    series1.dataFields.categoryX = "category";
    series1.dataFields.valueY = "Abandonded";
    series1.dataFields.valueYShow = "totalPercent";
    series1.dataItems.template.locations.categoryX = 0.5;
    series1.stacked = true;
    series1.tooltip.pointerOrientation = "vertical";

    let series2 = Oppchartchart.series.push(new am4charts.ColumnSeries());
    series2.columns.template.width = am4core.percent(90);
    series2.columns.template.tooltipText =
      "{name}: {valueY}";
    series2.name = "Discussion";
    series2.dataFields.categoryX = "category";
    series2.dataFields.valueY = "Discussion";
    series2.dataFields.valueYShow = "totalPercent";
    series2.dataItems.template.locations.categoryX = 0.5;
    series2.stacked = true;
    series2.tooltip.pointerOrientation = "vertical";

    let series3 = Oppchartchart.series.push(new am4charts.ColumnSeries());
    series3.columns.template.width = am4core.percent(90);
    series3.columns.template.tooltipText =
      "{name}: {valueY}";
    series3.name = "InvitedForProposal";
    series3.dataFields.categoryX = "category";
    series3.dataFields.valueY = "InvitedForProposal";
    series3.dataFields.valueYShow = "totalPercent";
    series3.dataItems.template.locations.categoryX = 0.5;
    series3.stacked = true;
    series3.tooltip.pointerOrientation = "vertical";

    let series4 = Oppchartchart.series.push(new am4charts.ColumnSeries());
    series4.columns.template.width = am4core.percent(90);
    series4.columns.template.tooltipText =
      "{name}: {valueY}";
    series4.name = "Lost";
    series4.dataFields.categoryX = "category";
    series4.dataFields.valueY = "Lost";
    series4.dataFields.valueYShow = "totalPercent";
    series4.dataItems.template.locations.categoryX = 0.5;
    series4.stacked = true;
    series4.tooltip.pointerOrientation = "vertical";


    let series5 = Oppchartchart.series.push(new am4charts.ColumnSeries());
    series5.columns.template.width = am4core.percent(90);
    series5.columns.template.tooltipText =
      "{name}: {valueY}";
    series5.name = "ProposalSubmitted";
    series5.dataFields.categoryX = "category";
    series5.dataFields.valueY = "ProposalSubmitted";
    series5.dataFields.valueYShow = "totalPercent";
    series5.dataItems.template.locations.categoryX = 0.5;
    series5.stacked = true;
    series5.tooltip.pointerOrientation = "vertical";

    let series6 = Oppchartchart.series.push(new am4charts.ColumnSeries());
    series6.columns.template.width = am4core.percent(90);
    series6.columns.template.tooltipText =
      "{name}: {valueY}";
    series6.name = "Qualified";
    series6.dataFields.categoryX = "category";
    series6.dataFields.valueY = "Qualified";
    series6.dataFields.valueYShow = "totalPercent";
    series6.dataItems.template.locations.categoryX = 0.5;
    series6.stacked = true;
    series6.tooltip.pointerOrientation = "vertical";


    let series7 = Oppchartchart.series.push(new am4charts.ColumnSeries());
    series7.columns.template.width = am4core.percent(90);
    series7.columns.template.tooltipText =
      "{name}: {valueY}";
    series7.name = "Suspended";
    series7.dataFields.categoryX = "category";
    series7.dataFields.valueY = "Suspended";
    series7.dataFields.valueYShow = "totalPercent";
    series7.dataItems.template.locations.categoryX = 0.5;
    series7.stacked = true;
    series7.tooltip.pointerOrientation = "vertical";


    let series8 = Oppchartchart.series.push(new am4charts.ColumnSeries());
    series8.columns.template.width = am4core.percent(90);
    series8.columns.template.tooltipText =
      "{name}: {valueY}";
    series8.name = "Won";
    series8.dataFields.categoryX = "category";
    series8.dataFields.valueY = "Won";
    series8.dataFields.valueYShow = "totalPercent";
    series8.dataItems.template.locations.categoryX = 0.5;
    series8.stacked = true;
    series8.tooltip.pointerOrientation = "vertical";

    Oppchartchart.scrollbarX = new am4core.Scrollbar();

    Oppchartchart.data = this.Opportunitychartdata;
    console.log('Chart Data  Preview', Oppchartchart.data);
  }

  generateOpportunitiesBySourceChart() {
    // Create chart instance
    let chart = am4core.create("OppSourcechartdiv", am4charts.PieChart);
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
    pieSeries.labels.template.disabled = true;

    pieSeries.labels.template.bent = true;
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
    chart.data = this.OpportunitySourceData;
  }

  generateOpportunitiesStatusByMonthChart() {
    let chart = am4core.create("OppchartStatusByMonthdiv", am4charts.XYChart);
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    chart.hiddenState.properties.opacity = 0;
    chart.data = this.OpportunityStatusByMonthData;
    console.log('Chart Data  generateLeadsStatusByMonthChart', chart.data);
    chart.colors.step = 2;
    chart.padding(30, 30, 10, 30);
    chart.legend = new am4charts.Legend();
    chart.legend.position = "right";

    let categoryAxis = chart.xAxes.push(new am4charts.DateAxis());
    categoryAxis.dateFormats.setKey("day", "MMM dd");
    categoryAxis.renderer.grid.template.location = 0;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;
    valueAxis.calculateTotals = true;
    valueAxis.renderer.minWidth = 50;
    valueAxis.setVisibility(false);

    let series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.columns.template.width = am4core.percent(90);
    series1.columns.template.tooltipText =
      "{name}: {valueY}";
    series1.name = "Qualified";
    series1.dataFields.dateX = "Date";
    series1.dataFields.valueY = "Qualified";
    series1.dataFields.valueYShow = "totalPercent";
    series1.dataItems.template.locations.categoryX = 0.5;
    series1.stacked = true;
    series1.tooltip.pointerOrientation = "vertical";

    let bullet1 = series1.bullets.push(new am4charts.LabelBullet());
    bullet1.interactionsEnabled = false;
    bullet1.label.text = "{valueY}";
    bullet1.label.fill = am4core.color("#ffffff");
    bullet1.locationY = 0.5;

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.columns.template.width = am4core.percent(90);
    series2.columns.template.tooltipText =
      "{name}: {valueY}";
    series2.name = "Discussion";
    series2.dataFields.dateX = "Date";
    series2.dataFields.valueY = "Discussion";
    series2.dataFields.valueYShow = "totalPercent";
    series2.dataItems.template.locations.categoryX = 0.5;
    series2.stacked = true;
    series2.tooltip.pointerOrientation = "vertical";

    let bullet2 = series2.bullets.push(new am4charts.LabelBullet());
    bullet2.interactionsEnabled = false;
    bullet2.label.text = "{valueY}";
    bullet2.locationY = 0.5;
    bullet2.label.fill = am4core.color("#ffffff");

    let series3 = chart.series.push(new am4charts.ColumnSeries());
    series3.columns.template.width = am4core.percent(90);
    series3.columns.template.tooltipText =
      "{name}: {valueY}";
    series3.name = "InvitedForProposal";
    series3.dataFields.dateX = "Date";
    series3.dataFields.valueY = "InvitedForProposal";
    series3.dataFields.valueYShow = "totalPercent";
    series3.dataItems.template.locations.categoryX = 0.5;
    series3.stacked = true;
    series3.tooltip.pointerOrientation = "vertical";

    let bullet3 = series3.bullets.push(new am4charts.LabelBullet());
    bullet3.interactionsEnabled = false;
    bullet3.label.text = "{valueY}";
    bullet3.locationY = 0.5;
    bullet3.label.fill = am4core.color("#ffffff");

    let series4 = chart.series.push(new am4charts.ColumnSeries());
    series4.columns.template.width = am4core.percent(90);
    series4.columns.template.tooltipText =
      "{name}: {valueY}";
    series4.name = "ProposalSubmitted";
    series4.dataFields.dateX = "Date";
    series4.dataFields.valueY = "ProposalSubmitted";
    series4.dataFields.valueYShow = "totalPercent";
    series4.dataItems.template.locations.categoryX = 0.5;
    series4.stacked = true;
    series4.tooltip.pointerOrientation = "vertical";

    let bullet4 = series4.bullets.push(new am4charts.LabelBullet());
    bullet4.interactionsEnabled = false;
    bullet4.label.text = "{valueY}";
    bullet4.locationY = 0.5;
    bullet4.label.fill = am4core.color("#ffffff");

    let series5 = chart.series.push(new am4charts.ColumnSeries());
    series5.columns.template.width = am4core.percent(90);
    series5.columns.template.tooltipText =
      "{name}: {valueY}";
    series5.name = "Won";
    series5.dataFields.dateX = "Date";
    series5.dataFields.valueY = "Won";
    series5.dataFields.valueYShow = "totalPercent";
    series5.dataItems.template.locations.categoryX = 0.5;
    series5.stacked = true;
    series5.tooltip.pointerOrientation = "vertical";

    let bullet5 = series5.bullets.push(new am4charts.LabelBullet());
    bullet5.interactionsEnabled = false;
    bullet5.label.text = "{valueY}";
    bullet5.locationY = 0.5;
    bullet5.label.fill = am4core.color("#ffffff");

    let series6 = chart.series.push(new am4charts.ColumnSeries());
    series6.columns.template.width = am4core.percent(90);
    series6.columns.template.tooltipText =
      "{name}: {valueY}";
    series6.name = "Lost";
    series6.dataFields.dateX = "Date";
    series6.dataFields.valueY = "Lost";
    series6.dataFields.valueYShow = "totalPercent";
    series6.dataItems.template.locations.categoryX = 0.5;
    series6.stacked = true;
    series6.tooltip.pointerOrientation = "vertical";

    let bullet6 = series6.bullets.push(new am4charts.LabelBullet());
    bullet6.interactionsEnabled = false;
    bullet6.label.text = "{valueY}";
    bullet6.locationY = 0.5;
    bullet6.label.fill = am4core.color("#ffffff");

    let series7 = chart.series.push(new am4charts.ColumnSeries());
    series7.columns.template.width = am4core.percent(90);
    series7.columns.template.tooltipText =
      "{name}: {valueY}";
    series7.name = "Suspended";
    series7.dataFields.dateX = "Date";
    series7.dataFields.valueY = "Suspended";
    series7.dataFields.valueYShow = "totalPercent";
    series7.dataItems.template.locations.categoryX = 0.5;
    series7.stacked = true;
    series7.tooltip.pointerOrientation = "vertical";

    let bullet7 = series7.bullets.push(new am4charts.LabelBullet());
    bullet7.interactionsEnabled = false;
    bullet7.label.text = "{valueY}";
    bullet7.locationY = 0.5;
    bullet7.label.fill = am4core.color("#ffffff");

    let series8 = chart.series.push(new am4charts.ColumnSeries());
    series8.columns.template.width = am4core.percent(90);
    series8.columns.template.tooltipText =
      "{name}: {valueY}";
    series8.name = "Abandonded";
    series8.dataFields.dateX = "Date";
    series8.dataFields.valueY = "Abandonded";
    series8.dataFields.valueYShow = "totalPercent";
    series8.dataItems.template.locations.categoryX = 0.5;
    series8.stacked = true;
    series8.tooltip.pointerOrientation = "vertical";

    let bullet8 = series8.bullets.push(new am4charts.LabelBullet());
    bullet8.interactionsEnabled = false;
    bullet8.label.text = "{valueY}";
    bullet8.locationY = 0.5;
    bullet8.label.fill = am4core.color("#ffffff");

    

    chart.scrollbarX = new am4core.Scrollbar();
  }


}
