import { Pipe, PipeTransform } from '@angular/core';



@Pipe({ name: 'Statuspip' })

export class StatusPipe implements PipeTransform {
    transform(value: string): string {
        let Status = "";
        if (value == '1') {
          Status = "Open_Contacted";
        } else if (value== '2')  {
          Status = "Open_NotContacted";
        }else if (value == '3')  {
          Status = "Closed_Disqualified";
        }else if (value == '4')  {
          Status = "Closed_Qualified";
        } 
        return Status;
      } 
  }
 