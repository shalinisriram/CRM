
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ServicePipe' })


export class ServicePipe implements PipeTransform {
    transform(value: string): string {
        let Status = "";
        if (value == '0') {
            Status = "IOT";
        } else if (value == '1') {
            Status = "ES";
        } else if (value == '2') {
            Status = "ANALYTICS";
        } else if (value == '3') {
            Status = "LAB";
        } else if (value == '4') {
            Status = "MISC";
        }
        return Status;
    }
} 