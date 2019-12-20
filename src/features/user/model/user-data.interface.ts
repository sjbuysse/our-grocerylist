import { AuthMetaData } from './auth-meta-data.interface';

export interface UserData {
    id: string;
    groceryListId: string;
    displayName: string;
}

export const createUserData = (authMetaData: AuthMetaData, groceryListId: string): UserData => ({
    id: authMetaData.uid,
    groceryListId,
    displayName: !!authMetaData.displayName ? authMetaData.displayName : ''
});
