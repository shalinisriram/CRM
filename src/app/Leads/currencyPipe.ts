 
import { Pipe, PipeTransform } from '@angular/core';



@Pipe({ name: 'CurrencyPipe' })

export class CurrencyPipe implements PipeTransform {
    transform(value: string): string {
        let Status = "";
        if (value == '1') {
          Status = "INR";
        } else if (value== '2')  {
          Status = "EUR";
        }else if (value == '3')  {
          Status = "USD";
        }else if (value == '4')  {
          Status = "SGD";
        } 
        return Status;
      } 
  }
 