import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {EdrivingFormModalComponent} from './edriving-form-modal/edriving-form-modal.component';
import {EdrivingService} from '../../../../shared/services/http/edriving.service';
import {Observable} from 'rxjs';
import {EdrivingGetAll, EdrivingUsuario} from '../../../../shared/models/edriving.module';
import {FormControl} from '@angular/forms';

/*
const ELEMENT_DATA: EdrivingUsuario[] = [
    {id: 1, nome: 'Hydrogen', email: 'email@email.com',cpf: '',usuarioId: 1,usuario: null,cargo: null,cargoId: 0,telefones: null}
];
*/

const ELEMENT_DATA: EdrivingUsuario[] = [];
@Component({
    selector: 'app-edriving',
    templateUrl: './edriving.component.html',
    styleUrls: ['./edriving.component.scss']
})

export class EdrivingComponent implements AfterViewInit {

    displayedColumns: string[] = ['nome', 'email'];
    dataSource = new MatTableDataSource<EdrivingUsuario>(ELEMENT_DATA);

    @ViewChild(MatSort) sort: MatSort;

    constructor(
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _edrivingServices: EdrivingService
    ) {
    }

    ngAfterViewInit(): void{
        this.dataSource.sort = this.sort;
        this.getUsers();
    }

    creteUser(): void {
        const dialogRef = this.dialog.open(EdrivingFormModalComponent);

        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);
        });
    }

    private getUsers(): void {
        this._edrivingServices.getAll().subscribe((items: EdrivingUsuario[])=>{
            this.dataSource.data = items;
            this._changeDetectorRef.markForCheck();
            console.log(this.dataSource.data);
        });
    }

    private loadUser(): void {
        this._edrivingServices.getAll();
    }
}
