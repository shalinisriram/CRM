import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'EnggTmProjects'
})
export class EnggTmProjectsPipe implements PipeTransform {

  transform(value: string): string {
    let Status = "";
    if (value == '1') {
      Status = "RnD";
    } else if (value == '2') {
      Status = "Product System PartDesign";
    } else if (value == '3') {
      Status = "Design Verification Analysis";
    } else if (value == '4') {
      Status = "Product DevelopmentBoM"; 
    } else if (value == '5') {
      Status = "Design Support";
    } else if (value == '6') {
      Status = "Electrical Design";
    } else if (value == '7') {
      Status = "Manufacturing Engineering";
    } else if (value == '8') {
      Status = "Production";
    }else if (value == '9') {
      Status = "Integration";
    }else if (value == '10') {
      Status = "Testing Certification";
    }else if (value == '11') {
      Status = "Integrated Logistics Support";
    }else if (value == '12') {
      Status = "After Market Services";
    }else if (value == '13') {
      Status = "Technical Publication";
    }else if (value == '14') {
      Status = "Simulators";
    }else if (value == '15') {
      Status = "PlantEngineering";
    }else if (value == '16') {
      Status = "Others";
    }
    return Status;
  }

}
