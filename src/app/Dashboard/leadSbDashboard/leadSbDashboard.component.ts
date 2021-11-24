import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LeadDashboardService } from './../../Provider/leadDashboard.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

/* Chart code */
// Themes begin
am4core.useTheme(am4themes_kelly);
am4core.useTheme(am4themes_animated);
// Themes end
// Themes end
am4core.addLicense(environment.licence);

@Component({
  selector: 'app-leadSbDashboard',
  templateUrl: './leadSbDashboard.component.html',
  styleUrls: ['./leadSbDashboard.component.css']
})


export class LeadSbDashboardComponent implements OnInit {
  chart: any;
  NumberOfLeads: string;
  Leadchartdata: any[];
  LeadsSourceData: any;
  LeadsStatusByMonthData: any;
  public currentOwnerId = +localStorage.getItem("Auth");

  constructor(private _leadDashboardService: LeadDashboardService) {

  }

  ngOnInit() {
    this.Leadchartdata = [];
    this.getLeadsByStatus();
    this.getLeadBySource();
    this.getLeadStatusByMonth();
  }

  getLeadsByStatus() {
    let obj: any = {
      id: this.currentOwnerId
    }
    this._leadDashboardService.GetLeadsCountByStatus(obj).subscribe(
      (data) => {
        this.Leadchartdata.push(data);
        this.generateLeadsByStatusChart();
        this.NumberOfLeads = this.Leadchartdata[0].TotalCount;
        localStorage.setItem("NumberOfLeads",this.NumberOfLeads)
        console.log('From BackEnd ', this.Leadchartdata);

      },
      (error) => {
        console.log('Log the error here: ', error);
      }
    )
  }

  getLeadBySource() {
    let obj: any = {
      id: this.currentOwnerId
    }
    this._leadDashboardService.GetLeadsCountBySource(obj).subscribe(
      (data) => {
        this.LeadsSourceData = data;
        console.log('getLeadBySource From BackEnd ', this.Leadchartdata);
        this.generateLeadsBySourceChart();
      },
      (error) => {
        console.log('Log the error here: ', error);
      }
    )
  }

  getLeadStatusByMonth() {
    let obj: any = {
      id: this.currentOwnerId
    }
    this._leadDashboardService.GetLeadsStatusByMonth(obj).subscribe(
      (data) => {
        this.LeadsStatusByMonthData = data;
        console.log('getLeadStatusByMonth From BackEnd ', this.LeadsStatusByMonthData);
        this.generateLeadsStatusByMonthChart();
      },
      (error) => {
        console.log('Log the error here: ', error);
      }
    )
  }

  generateLeadsByStatusChart() {
    let chart = am4core.create("Leadchartdiv", am4charts.XYChart);

    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";
    chart.hiddenState.properties.opacity = 0;
    chart.data = this.Leadchartdata;
    console.log('Chart Data  Preview', chart.data);
    chart.colors.step = 2;
    chart.padding(30, 30, 10, 30);
    chart.legend = new am4charts.Legend();
    chart.legend.position = "right";
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
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
    series1.name = "Open_Contacted";
    series1.dataFields.categoryX = "category";
    series1.dataFields.valueY = "Open_Contacted";
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
    series2.name = "Open_NotContacted";
    series2.dataFields.categoryX = "category";
    series2.dataFields.valueY = "Open_NotContacted";
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
    series3.name = "Closed_Disqualified";
    series3.dataFields.categoryX = "category";
    series3.dataFields.valueY = "Closed_Disqualified";
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
    series4.name = "Closed_Qualified";
    series4.dataFields.categoryX = "category";
    series4.dataFields.valueY = "Closed_Qualified";
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
    series5.name = "Closed_Converted";
    series5.dataFields.categoryX = "category";
    series5.dataFields.valueY = "Closed_Converted";
    series5.dataFields.valueYShow = "totalPercent";
    series5.dataItems.template.locations.categoryX = 0.5;
    series5.stacked = true;
    series5.tooltip.pointerOrientation = "vertical";

    let bullet5 = series5.bullets.push(new am4charts.LabelBullet());
    bullet5.interactionsEnabled = false;
    bullet5.label.text = "{valueY}";
    bullet5.locationY = 0.5;
    bullet5.label.fill = am4core.color("#ffffff");

    chart.scrollbarX = new am4core.Scrollbar();
  } 
  
  generateLeadsBySourceChart() {
    // Create chart instance
    let chart = am4core.create("LeadSourcechartdiv", am4charts.PieChart);
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
    chart.data = this.LeadsSourceData;
  }

  generateLeadsStatusByMonthChart() {
    let chart = am4core.create("LeadchartStatusByMonthdiv", am4charts.XYChart);
    chart.exporting.menu = new am4core.ExportMenu();
    chart.exporting.menu.align = "right";
    chart.exporting.menu.verticalAlign = "top";

    chart.hiddenState.properties.opacity = 0;
    chart.data = this.LeadsStatusByMonthData;
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
    series1.name = "Open_Contacted";
    series1.dataFields.dateX = "Date";
    series1.dataFields.valueY = "Open_Contacted";
    series1.dataFields.valueYShow = "totalPercent";
    series1.dataItems.template.locations.dateX = 0.5;
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
    series2.name = "Open_NotContacted";
    series2.dataFields.dateX = "Date";
    series2.dataFields.valueY = "Open_NotContacted";
    series2.dataFields.valueYShow = "totalPercent";
    series2.dataItems.template.locations.dateX = 0.5;
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
    series3.name = "Closed_Disqualified";
    series3.dataFields.dateX = "Date";
    series3.dataFields.valueY = "Closed_Disqualified";
    series3.dataFields.valueYShow = "totalPercent";
    series3.dataItems.template.locations.dateX = 0.5;
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
    series4.name = "Closed_Qualified";
    series4.dataFields.dateX = "Date";
    series4.dataFields.valueY = "Closed_Qualified";
    series4.dataFields.valueYShow = "totalPercent";
    series4.dataItems.template.locations.dateX = 0.5;
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
    series5.name = "Closed_Converted";
    series5.dataFields.dateX = "Date";
    series5.dataFields.valueY = "Closed_Converted";
    series5.dataFields.valueYShow = "totalPercent";
    series5.dataItems.template.locations.dateX = 0.5;
    series5.stacked = true;
    series5.tooltip.pointerOrientation = "vertical";

    let bullet5 = series5.bullets.push(new am4charts.LabelBullet());
    bullet5.interactionsEnabled = false;
    bullet5.label.text = "{valueY}";
    bullet5.locationY = 0.5;
    bullet5.label.fill = am4core.color("#ffffff");
    chart.scrollbarX = new am4core.Scrollbar();
  }



}
