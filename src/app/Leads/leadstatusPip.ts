import { Pipe, PipeTransform } from '@angular/core';



@Pipe({ name: 'LeadStatus' })

export class LeadStatusPipe implements PipeTransform {
    transform(value: string): string {
        let Status = "";
        if (value == '1') {
          Status = "NAStarted";
        } else if (value== '2')  {
          Status = "Completed";
        }else if (value == '3')  {
          Status = "InPogress";
        }
        return Status;
      } 
  }
 