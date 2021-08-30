import {Component, ViewChild} from '@angular/core';
import {MatTable} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {EdrivinFormModalComponent} from "./edrivin-form-modal/edrivin-form-modal.component";

export interface PeriodicElement {
    name: string;
    weight: number;
    symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {name: 'Helium', weight: 4.0026, symbol: 'He'},
    {name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {name: 'Boron', weight: 10.811, symbol: 'B'},
    {name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
    selector: 'app-edriving',
    templateUrl: './edriving.component.html',
    styleUrls: ['./edriving.component.scss']
})
export class EdrivingComponent {
    displayedColumns: string[] = ['name', 'weight', 'symbol'];
    dataSource = [...ELEMENT_DATA];

    @ViewChild(MatTable) table: MatTable<PeriodicElement>;

    constructor(public dialog: MatDialog) {
    }

    createContact() {
        const dialogRef = this.dialog.open(EdrivinFormModalComponent);

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    removeData() {
        this.dataSource.pop();
        this.table.renderRows();
    }

}
