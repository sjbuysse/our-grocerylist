import { State } from 'features/user/statemanagement/state';
import { Actions, SET_AUTH_META_DATA, SET_USER } from './actions';

export default function reducer(state: State = {}, action: Actions): State {
    switch (action.type) {
        case SET_AUTH_META_DATA:
            return { ...state, authMetaData: action.authMetaData};
        case SET_USER:
            return { ...state, user: action.user};

        default:
            return state;
    }
}
