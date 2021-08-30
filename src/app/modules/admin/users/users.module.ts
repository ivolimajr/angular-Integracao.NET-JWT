import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EdrivingComponent} from './edriving/edriving.component';
import {RouterModule} from "@angular/router";
import {UsersRouting} from "./users.routing";
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SharedModule} from "../../../shared/shared.module";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {FuseCardModule} from "../../../../@fuse/components/card";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatMenuModule} from "@angular/material/menu";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDividerModule} from "@angular/material/divider";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { EdrivinFormModalComponent } from './edriving/edrivin-form-modal/edrivin-form-modal.component';


@NgModule({
    declarations: [
        EdrivingComponent,
        EdrivinFormModalComponent
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
        MatTableModule,
        MatIconModule,
        SharedModule
    ]
})
export class UsersModule {
}
