import { combineReducers } from 'redux';
import auth from './auth.reducer';
import message from './message.reducer';
import employees from './employees.reducer';

export default combineReducers({
  auth,
  message,
  employees,
});
