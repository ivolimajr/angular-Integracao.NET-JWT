import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {UserService} from 'app/shared/services/usuario/user.service';
import {LocalStorageService} from '../storage/localStorage.service';
import {environment} from '../../../../environments/environment';
import {Usuario, UsuarioLogin} from '../../models/usuario.model';
import {TokenResult} from 'app/shared/models/token.module';

const API_TOKEN_URL = `${environment.apiUrl}/Auth/getToken`;
const API_LOGIN_URL = `${environment.apiUrl}/Usuario/Login`;
const USERNAME = environment.auth.clientId;
const PASSWORD = environment.auth.clientSecret;

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;
    private userLogin = new UsuarioLogin();
    private usuario: Usuario;

    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private storageServices: LocalStorageService
    ) {
    }

    /**
     * retorna o token do storage
     * Se não tiver um token no storage é retornado uma string vazio
     * @public
     * @param somente o access token em formato de string (cláro né)
     * return: void
     */
    set accessToken(token: string) {
        this.storageServices.setValueFromLocalStorage(environment.tokenStorage, token);
    }

    /**
     * retorna o token do storage
     * Se não tiver um token no storage é retornado uma string vazio
     * @public
     * return: string
     */
    get accessToken(): string {
        return this.storageServices.getValueFromLocalStorage(environment.tokenStorage) ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * @return usuário
     * @param credentials que vem da tela de login
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        //Verifica se o usuário já está autenticado
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(API_LOGIN_URL, credentials).pipe(
            switchMap((response: any) => {
                //Define os atributos de login e senha para salvar no Storage para verificações.
                this.userLogin.email = credentials.email;
                this.userLogin.password = credentials.password;

                //Salva os dados no storage
                this.storageServices.setValueFromLocalStorage(environment.dataStorage, this.userLogin);
                this.storageServices.setValueFromLocalStorage(environment.authStorage, response);

                //Define autenticado
                this._authenticated = true;

                //Definie o userState
                this._userService.user = response.user;

                // Retorna um novo observable com a resposta
                return of(response);
            }),
            catchError((e) => {
                return of(e)
            })
        );
    }

    /**
     * Método responsável por deslogar o usuário
     * Remove o usuário do storage para desautenticar
     * Mantem os dados de acesso para login futuro.
     * Mantem o token de acesso no storage
     * @return boolean
     */
    signOut(): Observable<boolean> {
        this.storageServices.removeFromStorage(environment.dataStorage);
        this.storageServices.removeFromStorage(environment.authStorage);
        this._authenticated = false;

        return of(true);
    }

    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this._userService.getUserStorage()) {
            return of(false);
        }
        if (!this.storageServices.getValueFromLocalStorage(environment.dataStorage)) {
            return of(false);
        }
        this.usuario = this.storageServices.getValueFromLocalStorage(environment.authStorage)
        if (this.usuario) {
            this._userService.user = this.usuario
            return of(true);
        }
        return of(false);
    }

    /***
     *Método responsável por buscar o token de autenticação na API
     * @return consome a API e retorna o Observable do TokenResult
     */
    getToken(): Observable<TokenResult> {
        return this._httpClient.post<TokenResult>(`${API_TOKEN_URL}`, {USERNAME, PASSWORD});
    }
}
