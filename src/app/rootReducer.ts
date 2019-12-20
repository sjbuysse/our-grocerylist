import { combineReducers } from 'redux';
import * as auth from '../features/user';

export default combineReducers({
    [auth.constants.NAME]: auth.reducer,
});
