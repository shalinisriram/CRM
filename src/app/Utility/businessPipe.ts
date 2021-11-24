import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'BusinessPipe' })

export class BusinessPipe implements PipeTransform {
    transform(value: string): string {
        let Status = "";
        if (value == '1') {
            Status = "Digital And Innovation";
        } else if (value == '2') {
            Status = "Engineering Services";
        } 
        return Status;
    }
} 
 