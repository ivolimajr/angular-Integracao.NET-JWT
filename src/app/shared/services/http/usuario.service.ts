import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';


const URL_USUARIO = `${environment.apiUrl}/Usuario`;

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    constructor(private _httpClient: HttpClient) {
    }

    deleteTelefone(id: number): Observable<boolean> {
        if (id === 0 || id == null) return of(false);
        return this._httpClient.delete(URL_USUARIO + '/telefone/' + id).pipe(
            switchMap((response: any) => of(response)),
            catchError((e) => {
                console.log(e.error);
                return of(e.error);
            })
        );

    }
}
