import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {fuseAnimations} from '@fuse/animations';
import {FuseAlertType} from '@fuse/components/alert';
import {AuthService} from 'app/shared/services/auth/auth.service';
import {Usuario} from 'app/shared/models/usuario.model';
import {UserService} from "../../../shared/services/usuario/user.service";

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'error',
        message: ''
    };

    loginForm: FormGroup;
    showAlert: boolean = false;
    private userStorage: Usuario;

    constructor(
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _userService: UserService,
        private _router: Router
    ) {
    }

    ngOnInit(): void {
        this.prepareForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Formulário de login
    // -----------------------------------------------------------------------------------------------------

    /**
     * Prepara o formulário de login com validadores básicos
     * @private
     */
    private prepareForm(): void {
        this.userStorage = this._userService.getDataFromStorage();
        //Se tiver um usuário no storage já é setado o email
        if (this.userStorage) {
            this.loginForm = this._formBuilder.group({
                email: [this.userStorage.email,
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(5),
                        Validators.maxLength(70)]
                    )],
                password: ['Pay@2021',
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(5),
                        Validators.maxLength(70)])],
                rememberMe: ['']
            });
        } else {
            this.loginForm = this._formBuilder.group({
                email: ['ivo@edriving.com',
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(5),
                        Validators.maxLength(70)]
                    )],
                password: ['Pay@2021',
                    Validators.compose([
                        Validators.required,
                        Validators.nullValidator,
                        Validators.minLength(5),
                        Validators.maxLength(70)])],
                rememberMe: ['']
            });
        }
    }

    /**
     *Valida os dados novamente para enviar para API
     * @private
     */
    private prepareCustomer(): boolean {
        const formData = this.loginForm.value;
        if (formData.email == '') {
            this.alert.type = 'error';
            this.alert.message = 'Dados inválidos'
            this.showAlert = true;
            return false;
        }
        if (formData.password == '') {
            this.alert.type = 'error';
            this.alert.message = 'Dados inválidos'
            this.showAlert = true;
            return false;
        }
        if (formData.password != '' && formData.password.length < 5) {
            this.alert.type = 'error';
            this.alert.message = 'Dados inválidos'
            this.showAlert = true;
            return false;
        }
        return true;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Método de Login
    // -----------------------------------------------------------------------------------------------------

    /**
     * Método para fazer Login na plataforma
     * Sign in
     */
    signIn(): void {
        //Nem vai pra API se os dados forem inválidos
        if (!this.prepareCustomer()) {
            return;
        }

        //Desabilita o form
        this.loginForm.disable();

        //Remove o alerta
        this.showAlert = false;

        //Faz Login
        this._authService.signIn(this.loginForm.value)
            .subscribe(
                () => {
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                    this._router.navigateByUrl(redirectURL);
                },
                (response) => {

                    //Reativa o formulário
                    this.loginForm.enable();

                    //Emite um alerta
                    this.alert = {
                        type: 'error',
                        message: 'Wrong email or password'
                    };
                    this.showAlert = true;
                }
            );
    }
}
