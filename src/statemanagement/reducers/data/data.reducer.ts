import { DataState } from 'model/store-state.interface';
import { DataActions, SET_AUTH_META_DATA, SET_USER } from '../../actions/data/data.actions';

export default function dataReducer(state: DataState = {}, action: DataActions): DataState {
    switch (action.type) {
        case SET_AUTH_META_DATA:
            return { ...state, authMetaData: action.authMetaData};
        case SET_USER:
            return { ...state, user: action.user};

        default:
            return state;
    }
}
