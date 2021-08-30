import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-edrivin-form-modal',
    templateUrl: './edriving-form-modal.component.html',
    styleUrls: ['./edriving-form-modal.component.scss']
})
export class EdrivingFormModalComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<EdrivingFormModalComponent>) {
    }

    ngOnInit(): void {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
