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
    @Input() EdrivingUser: EdrivingUsuario;
    alert: { type: FuseAlertType; message: string } = {
        type: 'error',
        message: ''
    };

    accountForm: FormGroup;
    user: Usuario;
    showAlert: boolean = false;
    private EdrivingUserPost = new EdrivingPost();

    constructor(
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _authServices: AuthService,
        private _edrivingServices: EdrivingService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _userServices: UserService,
        private _storageServices: LocalStorageService
    ) {
    }

    ngOnInit(): void {
        //Prepara o formulário
        this.prepareForm();
    }

    /**
     * Atualiza o usuário do tipo Edriving
     * @return void
     */
    update(): void {
        //Verifica se o formulário é valido
        if (this.checkFormToSend() === false) {
            return null;
        }

        this._edrivingServices.update(this.EdrivingUserPost).subscribe((res) => {
            //Set o edrivingUser com os dados atualizados
            this.EdrivingUser = res;

            //Atualiza os dados do localStorage
            this.user = this._authServices.getUserInfoFromStorage();
            this.user.nome = res.nome;
            this.user.email = res.email;
            this._storageServices.setValueFromLocalStorage(environment.authStorage, this.user);

            //Atualiza o útlimo registro do formulário de contato com o ID do telefone atualizado
            const last = res.telefones[res.telefones.length - 1];
            const phoneNumberFormGroup = this._formBuilder.group({
                id: [last.id],
                telefone: [last.telefone]
            });

            // Adiciona o formGroup ao array de telefones
            (this.accountForm.get('telefones') as FormArray).push(phoneNumberFormGroup);

            //Retorna a mensagem de atualizado
            this.alert.type = 'success';
            this.alert.message = 'Atualizado.';
            this.showAlert = true;
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Adiciona mais um campo no formulário de contato
     * @return void
     */
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

    /**
     * Remove um telefone do formulário de contato e do banco de dados
     * @param id do telefone a ser removido
     * @param index do array de telefones a ser removido
     */
    removePhoneNumber(id: number, index: number): void {
        this._userServices.removePhonenumber(id)
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

    /**
     * monta o formulário com os validadores
     * @return void
     * @private
     */
    private prepareForm(): void {
        this.accountForm = this._formBuilder.group({
            nome: [this.EdrivingUser.nome,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(5),
                    Validators.maxLength(100)]
                )],
            cpf: [this.EdrivingUser.cpf,
                Validators.compose([
                    Validators.required,
                    Validators.nullValidator,
                    Validators.minLength(11),
                    Validators.maxLength(11)])],
            email: [this.EdrivingUser.email,
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

        // cria um array para montar o formBuilder de telefones
        const phoneNumbersFormGroups = [];

        //Só monta o array de telefones se houver telefones de contato cadastrado
        if (this.EdrivingUser.telefones.length > 0) {
            // Iterate through them
            this.EdrivingUser.telefones.forEach((phoneNumber) => {

                //Cria um formGroup de telefone
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

        // Adiciona o array de telefones ao fomrGroup
        phoneNumbersFormGroups.forEach((phoneNumbersFormGroup) => {
            (this.accountForm.get('telefones') as FormArray).push(phoneNumbersFormGroup);
        });

        //Define o ID do usuário Edriving a ser atualizado
        this.EdrivingUserPost.id = this.EdrivingUser.id;
        this._changeDetectorRef.markForCheck();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    /**
     * Valida os dados vindo do formulário antes de enviar para API
     * @private
     * @return um boleano
     */
    private checkFormToSend(): boolean {

        if (this.accountForm.invalid) {
            this.alert.type = 'error';
            this.alert.message = 'Dados Inválidos.';
            this.showAlert = true;
            return false;
        }
        //Se todos os dados forem válidos, monta o objeto para atualizar
        const formData = this.accountForm.value;
        this.EdrivingUserPost.nome = formData.nome;
        this.EdrivingUserPost.email = formData.email;
        this.EdrivingUserPost.cpf = formData.cpf;
        this.EdrivingUserPost.telefones = formData.telefones;

        return true;
    }
}
