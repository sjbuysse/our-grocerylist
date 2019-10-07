import { Observable, Observer } from 'rxjs/index';
import firebase from 'fire';
import {AuthMetaData} from 'model/auth-meta-data.interface';
import { shareReplay } from 'rxjs/internal/operators';

export const getAuthMetaData = (): Observable<AuthMetaData> =>
    Observable.create((observer: Observer<AuthMetaData>) =>
        firebase.auth().onAuthStateChanged(observer)).pipe(shareReplay(1));

