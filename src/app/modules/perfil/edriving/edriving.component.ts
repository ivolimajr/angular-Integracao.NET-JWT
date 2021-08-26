import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EdrivingPost, EdrivingUsuario} from '../../../shared/models/edriving.module';
import {UserService} from '../../../shared/services/http/user.service';
import {EdrivingService} from '../../../shared/services/http/edriving.service';
import {fuseAnimations} from '@fuse/animations';
import {FuseAlertType} from '@fuse/components/alert';
import {Usuario} from '../../../shared/models/usuario.model';
import {AuthService} from '../../../shared/services/auth/auth.service';
import {LocalStorageService} from "../../../shared/services/storage/localStorage.service";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-edriving',
    templateUrl: './edriving.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class EdrivingComponent implements OnInit {
    @Input() usuarioEdriving: EdrivingUsuario;
    alert: { type: FuseAlertType; message: string } = {
        type: 'error',
        message: ''
    };

    accountForm: FormGroup;
    user: Usuario;
    showAlert: boolean = false;
    private usuarioEdrivingPost = new EdrivingPost();

    constructor(
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _authServices: AuthService,
        private _edrivingServices: EdrivingService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _usuarioServices: UserService,
        private _storageService: LocalStorageService
    ) {

    }

    ngOnInit(): void {
        this.preparaFormulario();
    }

    atualizar(): void {
        if (this.preparaEnvioFormulario() === false) {
            return null;
        }

        this._edrivingServices.update(this.usuarioEdrivingPost).subscribe((res) => {

            this.usuarioEdriving = res;

            this.user = this._authServices.getUserInfoFromStorage();
            this.user.nome = res.nome;
            this.user.email = res.email;
            this._storageService.setValueFromLocalStorage(environment.authStorage, this.user);

            const last = res.telefones[res.telefones.length - 1];
            const phoneNumberFormGroup = this._formBuilder.group({
                id: [last.id],
                telefone: [last.telefone]
            });

            // Adiciona o formGroup ao array de telefones
            (this.accountForm.get('telefones') as FormArray).push(phoneNumberFormGroup);
            this.alert.type = 'success';
            this.alert.message = 'Atualizado.';
            this.showAlert = true;
            this._changeDetectorRef.markForCheck();
        });
    }

    addPhoneNumberField(): void {

        // Cria um novo formGroup vazio
        const phoneNumberFormGroup = this._formBuilder.group({
            id: [0],
            telefone: ['']
        });

        // Adiciona o formGroup ao array de telefones
        (this.accountForm.get('telefones') as FormArray).push(phoneNumberFormGroup);

        // Marca as alterações
        this._changeDetectorRef.markForCheck();
    }

    removePhoneNumber(id: number, index: number): void {
        this._usuarioServices.removePhonenumber(id)
            .subscribe((res) => {
                if (!res) {
                    this.alert.type = 'error';
                    this.alert.message = 'Telefone já em uso';
                    this.showAlert = true;
                }
                const phoneNumbersFormArray = this.accountForm.get('telefones') as FormArray;
                // Remove the phone number field
                phoneNumbersFormArray.removeAt(index);
                this._changeDetectorRef.markForCheck();
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private preparaFormulario(): void {
        this.accountForm = this._formBuilder.group({
            nome: [this.usuarioEdriving.nome,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(100)]
                )],
            cpf: [this.usuarioEdriving.cpf,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(11),
                    Validators.maxLength(11)])],
            email: [this.usuarioEdriving.email,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(70)])],
            telefones: this._formBuilder.array([], Validators.compose([
                Validators.required,
                Validators.nullValidator
            ])),
        });

        // Setup the phone numbers form array
        const phoneNumbersFormGroups = [];

        if (this.usuarioEdriving.telefones.length > 0) {
            // Iterate through them
            this.usuarioEdriving.telefones.forEach((phoneNumber) => {

                // Create an email form group
                phoneNumbersFormGroups.push(
                    this._formBuilder.group({
                        id: [phoneNumber.id],
                        telefone: [phoneNumber.telefone]
                    })
                );
            });
        } else {
            // Create a phone number form group
            phoneNumbersFormGroups.push(
                this._formBuilder.group({
                    id: [0],
                    telefone: ['']
                })
            );
        }

        // Add the phone numbers form groups to the phone numbers form array
        phoneNumbersFormGroups.forEach((phoneNumbersFormGroup) => {
            (this.accountForm.get('telefones') as FormArray).push(phoneNumbersFormGroup);
        });

        this.usuarioEdrivingPost.id = this.usuarioEdriving.id;
        this._changeDetectorRef.markForCheck();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    private preparaEnvioFormulario(): boolean {

        if (this.accountForm.invalid) {
            this.alert.type = 'error';
            this.alert.message = 'Dados Inválidos.';
            this.showAlert = true;
            const formData = this.accountForm.value;
            console.log(formData.telefones);
            formData.telefones.forEach((res) => {
                console.log(res.telefone.length);
            });

            return false;
        }

        const formData = this.accountForm.value;
        this.usuarioEdrivingPost.nome = formData.nome;
        this.usuarioEdrivingPost.email = formData.email;
        this.usuarioEdrivingPost.cpf = formData.cpf;
        this.usuarioEdrivingPost.telefones = formData.telefones;

        return true;
    }
}
