import {
  EMPLOYEES_ADD_SUCCESS,
  EMPLOYEES_EDIT_SUCCESS,
  EMPLOYEES_DELETE_SUCCESS,
  EMPLOYEES_REQUEST_SUCCESS,
} from '../actions/types';

const initialState = {
  paginations: {},
  itemCount: 0,
  pageCount: 0,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case EMPLOYEES_REQUEST_SUCCESS:
      return {
        paginations: {
          ...state.paginations,
          [payload.page]: payload.employees,
        },
        itemCount: payload.itemCount,
        pageCount: payload.pageCount,
      };

    case EMPLOYEES_ADD_SUCCESS:
      let pageOneList = state.paginations[1] || [];
      pageOneList.unshift(payload.user);
      return {
        ...state,
        paginations: {
          ...state.paginations,
          1: pageOneList,
        },
        itemCount: parseInt(state.itemCount) + 1,
      };

    case EMPLOYEES_EDIT_SUCCESS:
      return {
        ...state,
        paginations: {
          ...state.paginations,
          [payload.page]: state.paginations[payload.page].map((user) => {
            if (user.id === payload.userId) {
              return payload.updateData;
            }
            return user;
          }),
        },
      };

    case EMPLOYEES_DELETE_SUCCESS:
      return {
        ...state,
        paginations: {
          ...state.paginations,
          [payload.page]: state.paginations[payload.page].filter(
            (user) => user.id !== payload.userId
          ),
        },
        itemCount: parseInt(state.itemCount) - 1,
      };

    default:
      return state;
  }
}
