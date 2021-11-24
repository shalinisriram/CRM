import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DaTmProjects'
})
export class DaTmProjectsPipe implements PipeTransform {

  transform(value: string): string {
    let Status = "";
    if (value == '1') {
      Status = "IOT/IIOT";
    } else if (value == '2') {
      Status = "Enterprise Solutions";
    } else if (value == '3') {
      Status = "AR VR Solutions";
    } else if (value == '4') {
      Status = "Intelligent Automation"; 
    } else if (value == '5') {
      Status = "Analytics";
    } else if (value == '6') {
      Status = "LAB";
    } else if (value == '7') {
      Status = "Others";
    }
    return Status;
  }

}
