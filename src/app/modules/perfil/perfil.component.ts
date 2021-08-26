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
import {EdrivingService} from '../../shared/services/http/edriving.service';
import {EdrivingUsuario} from '../../shared/models/edriving.module';
import {AuthService} from '../../shared/services/auth/auth.service';

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

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    edrivingUser$: Observable<EdrivingUsuario>;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _authService: AuthService,
        private _edrivingServices: EdrivingService
    ) {
    }

    ngOnInit(): void {
        this.loadUser();
        this.loadPanel();
        this.mediaChanges();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // Usuario
    // -----------------------------------------------------------------------------------------------------

    /**
     * Carrega o usuário para edição dos dados
     * É um condicional para exibir o formulário, dependendo do nível de acesso é renderizado um componente.
     *
     * @private
     */
    private loadUser(): void {
        this._authService.user$.subscribe((res) => {
            if (res.nivelAcesso >= 10 && res.nivelAcesso < 20) {
                this.edrivingUser$ = this._edrivingServices.getOne(res.id);
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // Comportamento do painel
    // -----------------------------------------------------------------------------------------------------

    //Carrega os dados do painel
    loadPanel(): void {
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
    }

    //Altera entre a sobreposição do painel esquerdo com direito, sobrepoe ou escurece.
    mediaChanges(): void {
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
     * Navega entre os paineis
     *
     * @param id do painel
     */
    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    /**
     * Busca as informações do Painel
     *
     * @param id do painel
     */
    getPanelInfo(id: string): any {
        return this.panels.find(panel => panel.id === id);
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
