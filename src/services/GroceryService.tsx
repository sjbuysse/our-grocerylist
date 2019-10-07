import { Grocery } from '../model/grocery.interface';
import firebase from 'firebase/app';
import 'firebase/firestore';
import fire from 'fire';
import { Observable } from 'rxjs/index';
import { Observer } from 'firebase';
import { map } from 'rxjs/internal/operators';

const db: firebase.firestore.Firestore = fire.firestore();

const getGroceryListRef = (groceryListId: string) => db.collection('groceryLists').doc(groceryListId)
    .collection('groceries');

const getGroceryListSortedByTimeRef = (groceryListId: string) => getGroceryListRef(groceryListId).orderBy('createdAt', 'asc');

const getGroceryRef = (groceryListId: string, groceryId: string) => getGroceryListRef(groceryListId).doc(groceryId);

export const getAll = (groceryListId: string): Observable<Grocery[]> =>
    Observable.create((observer: Observer<firebase.firestore.QuerySnapshot>) =>
        getGroceryListSortedByTimeRef(groceryListId).onSnapshot({}, observer)).pipe(map((snapshot: firebase.firestore.QuerySnapshot) =>
        snapshot.docs.map(doc => doc.data())));

export const add = (groceryListId: string, grocery: Grocery): Promise<any> =>
    getGroceryListRef(groceryListId).doc(grocery.id).set(grocery);

export const update = (groceryListId: string, grocery: Grocery): Promise<any> =>
    getGroceryListRef(groceryListId).doc(grocery.id).set(grocery);

export const remove = (groceryListId: string, id: string): Promise<any> =>
    getGroceryListRef(groceryListId).doc(id).delete();

export const removeBatch = (groceryListId: string, groceryIds: string[]): Promise<any> => {
    const batch = db.batch();
    groceryIds.forEach(id => {
        const groceryRef = getGroceryRef(groceryListId, id);
        batch.delete(groceryRef);
    });
    return batch.commit();
}

export const toggleAll = (groceryListId: string, groceryIds: string[], checked: boolean): Promise<any> => {
    const batch = db.batch();
    groceryIds.forEach(id => {
        const groceryRef = getGroceryRef(groceryListId, id);
        batch.update(groceryRef, {completed: checked})
    });
    return batch.commit();
}
