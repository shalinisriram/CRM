import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'OfferingPipe' })

export class OfferingPipe implements PipeTransform {
    transform(value: string): string {
        let Status = "";
        if (value == '1') {
            Status = "Services-T&M";
        } else if (value == '2') {
            Status = "Services-Projects";
        } else if (value == '3') {
            Status = "Products";
        }
        return Status;
    }
} 