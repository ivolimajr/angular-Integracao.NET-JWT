import {NgModule} from '@angular/core';
import {EdrivingComponent} from './edriving/edriving.component';
import {RouterModule} from '@angular/router';
import {UsersRouting} from './users.routing';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SharedModule} from '../../../shared/shared.module';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FuseCardModule} from '../../../../@fuse/components/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDividerModule} from '@angular/material/divider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { EdrivingFormModalComponent } from './edriving/edriving-form-modal/edriving-form-modal.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from "@angular/material/sort";


@NgModule({
    declarations: [
        EdrivingComponent,
        EdrivingFormModalComponent
    ],
    imports: [
        RouterModule.forChild(UsersRouting),
        MatButtonModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatTooltipModule,
        FuseCardModule,
        MatIconModule,
        SharedModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule
    ]
})
export class UsersModule {
}