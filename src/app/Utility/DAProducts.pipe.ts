import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DAProducts'
})
export class DAProductsPipe implements PipeTransform {
 
  public transform(value: string): string {
    let Status = "";
    if (value == '1') {
      Status = "WeCareEST";
    }   
    return Status;
  } 

}
