import { NAME } from '../constants';
import { State } from './state';
import { createSelector } from 'reselect';

const getAuthState = (rootState: any) => rootState[NAME];

export const getUser = createSelector(
    getAuthState, (state: State) => state.user
);

export const getAuthMetaData = createSelector(
    getAuthState, (state: State) => state.authMetaData
);
