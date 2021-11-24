import { Pipe, PipeTransform } from '@angular/core';



@Pipe({ name: 'CurrentStatus' })

export class CurrentStatus implements PipeTransform {
    transform(value: string): string {
        let Status = "";
        if (value == '1') {
            Status = "Qualified";
        } else if (value == '2') {
            Status = "Discussion";
        } else if (value == '3') {
            Status = "InvitedForProposal";
        } else if (value == '4') {
            Status = "ProposalSubmitted";
        } else if (value == '5') {
            Status = "Won";
        } else if (value == '6') {
            Status = "Lost";
        } else if (value == '7') {
            Status = "Suspended";
        } else if (value == '8') {
            Status = "Abandonded";
        } else if (value == '9') {
            Status = "Demo";
        } 
        
        return Status;
    }
}  
 