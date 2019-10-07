import { AuthMetaData } from 'model/auth-meta-data.interface';
import { UserData } from 'model/user-data.interface';

export const SET_AUTH_META_DATA = 'SET_AUTH_META_DATA';
export type SET_AUTH_META_DATA = typeof SET_AUTH_META_DATA;

export const SET_USER = 'SET_USER';
export type SET_USER = typeof SET_USER;

export interface SetAuthMetaData {
    type: SET_AUTH_META_DATA;
    authMetaData: AuthMetaData | undefined
}

export interface SetUser {
    type: SET_USER;
    user: UserData | undefined;
}

export const setAuthMetaData = (authMetaData: AuthMetaData | undefined): SetAuthMetaData => ({
    type: SET_AUTH_META_DATA,
    authMetaData
});

export const setUser = (user: UserData | undefined): SetUser => ({
    type: SET_USER,
    user
});

export type DataActions = SetAuthMetaData | SetUser
