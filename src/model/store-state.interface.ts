import { AuthMetaData } from './auth-meta-data.interface';
import { UserData } from './user-data.interface';

export interface StoreState {
    data: DataState;
}

export interface DataState {
    authMetaData?: AuthMetaData;
    user?: UserData;
}
