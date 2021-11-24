import { Pipe, PipeTransform } from '@angular/core';
 
@Pipe({ name: 'GeoPipe' })

export class GeoPipe implements PipeTransform {
    transform(value: string): string {
        let Status = "";
        if (value == '1') {
          Status = "NA";
        } else if (value== '2')  {
          Status = "EUROPE";
        }else if (value == '3')  {
          Status = "INDIA";
        }else if (value == '4')  {
          Status = "ROW";
        }
        return Status;
      } 
  }
 
  
