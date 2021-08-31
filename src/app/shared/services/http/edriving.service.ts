import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EdrivingPost, EdrivingUsuario} from '../../models/edriving.module';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, switchMap} from 'rxjs/operators';


const URL_EDRIVING_URL = `${environment.apiUrl}/Edriving`;

@Injectable({
    providedIn: 'root'
})
export class EdrivingService {

    constructor(private _httpClient: HttpClient) {
    }

    /**
     * Recupera um usuário do Edriving
     *
     * @param id do usuário a ser consultado
     * @return retorna um usuário ou o error
     */
    getOne(id: number): Observable<EdrivingUsuario> {

        return this._httpClient.get<EdrivingUsuario>(URL_EDRIVING_URL + '/' + id).pipe(
            switchMap((response: any) => of(response)),
            catchError((e) => {
                console.log(e);
                return of(e);
            })
        );
    }

    /**
     * @return o array de items contendo todos os usuários do tipo Edriving
     */
    getAll(): Observable<EdrivingUsuario[]> {
        return this._httpClient.get<EdrivingUsuario[]>(URL_EDRIVING_URL).pipe(
            switchMap((response: EdrivingUsuario[]) => of(response['items'])),
            catchError(e => of(e))
        );
    }

    /**
     * Atualiza um usuário do edriving
     * Verifica se o id a ser passao é zero, se for, retorna error.
     *
     * @param data model do usuario
     * @return retorna o usuário atualizado ou error
     */
    update(data: EdrivingPost): Observable<EdrivingUsuario> {
        if (data.id === 0 || data.id == null) {
            return of(null);
        }

        return this._httpClient.put(URL_EDRIVING_URL, data).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }

    /**
     * Atualiza um usuário do edriving
     * Verifica se o id a ser passao é zero, se for, retorna error.
     *
     * @param data model do usuario
     * @return retorna o usuário atualizado ou error
     */
    delete(id: number): Observable<boolean> {
        if (id === 0 || id == null) {
            return of(null);
        }

        return this._httpClient.delete(URL_EDRIVING_URL + '/' + id).pipe(
            switchMap((response: any) => of(response)),
            catchError(e => of(e))
        );
    }
}
