import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';


const URL_USER_API = `${environment.apiUrl}/Usuario`;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private _httpClient: HttpClient) {
    }

    /**
     * Remove um telefone de qualquer usuário
     *
     * @param id do telefone a ser removido
     * @return retorna um booleano ou error
     */
    removePhonenumber(id: number): Observable<boolean> {
        if (id === 0 || id == null) {return of(false);}
        return this._httpClient.delete(URL_USER_API + '/telefone/' + id).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e.error))
        );
    }
}
