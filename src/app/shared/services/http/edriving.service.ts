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

    getOne(id: number): Observable<EdrivingUsuario> {

        return this._httpClient.get<EdrivingUsuario>(URL_EDRIVING_URL + '/' + id).pipe(
            switchMap((response: any) => of(response)),
            catchError((e) => {
                console.log(e);
                return of(e);
            })
        );
    }

    update(data: EdrivingPost): Observable<EdrivingUsuario> {
        if (data.id === 0 || data.id == null) {
            return of(null);
        }

        return this._httpClient.put(URL_EDRIVING_URL, data).pipe(
            switchMap((response: any) => of(response)),
            catchError((e) => {
                console.log(e.error);
                return of(e);
            })
        );
    }
}
