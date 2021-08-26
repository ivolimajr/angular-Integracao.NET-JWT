import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FuseMediaWatcherService} from '@fuse/services/media-watcher';
import {UserService} from '../../shared/services/usuario/user.service';
import {EdrivingService} from '../../shared/services/http/edriving.service';
import {EdrivingUsuario} from '../../shared/models/edriving.module';
import {Usuario} from '../../shared/models/usuario.model';

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerfilComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;

    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'dadosPessoais';

    usuarioStorage: Usuario;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    usuarioEdriving$: Observable<EdrivingUsuario>;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _userService: UserService,
        private _edrivingServices: EdrivingService
    ) {

    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.preparaUsuario();
        // Setup available panels
        this.panels = [
            {
                id: 'dadosPessoais',
                icon: 'heroicons_outline:user-circle',
                title: 'Dados Pessoais',
                description: 'Gerencie seus dados pessoais'
            },
            {
                id: 'seguranca',
                icon: 'heroicons_outline:lock-closed',
                title: 'Segurança',
                description: 'Mantenha sua conta protegida.'
            },
            {
                id: 'endereco',
                icon: 'heroicons_outline:home',
                title: 'Endereço',
                description: 'Mantenha seu endereço sempre atualizado'
            },
        ];

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }


    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Navigate to the panel
     *
     * @param panel
     */
    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    getPanelInfo(id: string): any {
        return this.panels.find(panel => panel.id === id);
    }

    preparaUsuario(): void {
        this.usuarioStorage = this._userService.getUserStorage();
        if (this.usuarioStorage.nivelAcesso >= 10 && this.usuarioStorage.nivelAcesso < 20) {
            this.buscaUsuario(this.usuarioStorage.id);
        }

    }

    private buscaUsuario(id: number): void {
        this.usuarioEdriving$ = this._edrivingServices.getOne(id);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
