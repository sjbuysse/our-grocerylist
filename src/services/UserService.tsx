import { createUserData, UserData } from '../features/user/model/user-data.interface';
import { from, Observable, of } from 'rxjs/index';
import firebase from 'firebase/app';
import 'firebase/firestore';
import fire from 'fire';
import { uuid } from '../utils';
import { AuthMetaData } from '../features/user/model/auth-meta-data.interface';
import { filter, first, map, merge, shareReplay, switchMap } from 'rxjs/internal/operators';
import { isNullOrUndefined } from 'util';

const db: firebase.firestore.Firestore = fire.firestore();

export const getUserData$ = (userId: string): Observable<UserData | undefined> =>
    from(db.collection('users').doc(userId).get().then(doc => doc.data())).pipe(
        map((userDocumentData: firebase.firestore.DocumentData | undefined) =>
            !!userDocumentData
                ? userDocumentData as UserData
                : undefined),
        shareReplay(1));

export const addUserDataWithNewGroceryListId = (authMetaData: AuthMetaData): Observable<UserData> => {
    const newUserData = createUserData(authMetaData, uuid());
    return from(db.collection('users').doc(authMetaData.uid).set(newUserData).then(() => newUserData));
};

export const addGroceryListIdToUserData = (authMetaData: AuthMetaData, groceryListId: string): Observable<UserData> => {
    const newUserData = createUserData(authMetaData, groceryListId);
    return from(db.collection('users').doc(authMetaData.uid).set(newUserData).then(() => {
        return newUserData;
    }));
};

export const getUsersByGroceryListId = (groceryListId: string): Observable<UserData[] | undefined> => {
    return from(db.collection('users').where('groceryListId', '==', groceryListId)
        .get().then((querySnapshot: firebase.firestore.QuerySnapshot) =>
            querySnapshot.docs.map((documentSnapshot: firebase.firestore.DocumentSnapshot) => documentSnapshot.data() as UserData))
    );
}

export const getUserDataOrCreateIfUndefined$ = (authMetaData: AuthMetaData): Observable<UserData> => {
    const defineUserIfUndefined$ = getUserData$(authMetaData.uid).pipe(
        first(),
        filter(userData => isNullOrUndefined(userData)),
        switchMap(() => addUserDataWithNewGroceryListId(authMetaData)));
    const getDefinedUser$ = getUserData$(authMetaData.uid).pipe(
        first(),
        filter(userData => !isNullOrUndefined(userData)));
    return defineUserIfUndefined$.pipe(merge(getDefinedUser$), map(userData => userData!));
};
