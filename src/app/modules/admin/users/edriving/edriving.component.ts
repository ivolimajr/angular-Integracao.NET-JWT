import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {EdrivingFormModalComponent} from './edriving-form-modal/edriving-form-modal.component';
import {EdrivingService} from '../../../../shared/services/http/edriving.service';
import {EdrivingUsuario} from '../../../../shared/models/edriving.module';
import {SelectionModel} from "@angular/cdk/collections";

const ELEMENT_DATA: EdrivingUsuario[] = [];

@Component({
    selector: 'app-edriving',
    templateUrl: './edriving.component.html',
    styleUrls: ['./edriving.component.scss']
})

export class EdrivingComponent implements AfterViewInit, OnInit {

    displayedColumns: string[] = ['nome', 'email'];
    dataSource = new MatTableDataSource<EdrivingUsuario>(ELEMENT_DATA);
    loading: boolean = true;
    _users$ = this._edrivingServices.getAll();

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _edrivingServices: EdrivingService
    ) {
    }
    ngOnInit(): void{
    }

    ngAfterViewInit(): void{
        this.dataSource.paginator = this.paginator;
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
        this._users$.subscribe((items: EdrivingUsuario[])=>{
            this.dataSource.data = items;
            this.loading = false;
        });
    }
}
