 

import { Pipe, PipeTransform } from '@angular/core';



@Pipe({ name: 'OpportunityStatus' })

export class OpportunityStatus implements PipeTransform {
    transform(value: string): string {
        let Status = "";
        if (value == '1') {
          Status = "Not Started";
        } else if (value== '2')  {
          Status = "Completed";
        }else if (value == '3')  {
          Status = "InProgress";
        } 
        return Status;
      } 
  }
 