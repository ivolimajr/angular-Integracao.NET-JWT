import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, ReplaySubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {LocalStorageService} from "../storage/localStorage.service";
import {environment} from "../../../../environments/environment";
import {Usuario} from "../../models/usuario.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _user: ReplaySubject<Usuario> = new ReplaySubject<Usuario>(1);
    private usuario: Usuario;

    constructor(
        private _httpClient: HttpClient,
        private storageService: LocalStorageService) {
    }

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: Usuario) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<Usuario> {
        return this._user.asObservable();
    }

    getUserStorage() {
        return this.usuario = this.storageService.getValueFromLocalStorage(environment.authStorage);
    }

    getDataFromStorage() {
        return this.usuario = this.storageService.getValueFromLocalStorage(environment.dataStorage);
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: Usuario): Observable<any> {
        return this._httpClient.patch<Usuario>('api/common/user', {user}).pipe(
            map((response) => {
                // Execute the observable
                this._user.next(response);
            })
        );
    }
}
