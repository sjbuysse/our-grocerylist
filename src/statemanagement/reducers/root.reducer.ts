import { combineReducers } from 'redux';
import dataReducer from './data/data.reducer';

export default combineReducers({
    data: dataReducer
})