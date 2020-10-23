import {
  EMPLOYEES_ADD_SUCCESS,
  EMPLOYEES_ADD_FAIL,
  EMPLOYEES_EDIT_SUCCESS,
  EMPLOYEES_EDIT_FAIL,
  EMPLOYEES_DELETE_FAIL,
  EMPLOYEES_DELETE_SUCCESS,
  EMPLOYEES_REQUEST_FAIL,
  EMPLOYEES_REQUEST_SUCCESS,
  EMPLOYEES_REVIEW_SUCCESS,
  EMPLOYEES_REVIEW_FAIL,
  SET_MESSAGE,
} from './types';

import ApiService from '../services/api.service';

export const get = (page = 1) => (dispatch) => {
  return ApiService.get(`api/users?page=${page}`).then(
    (response) => {
      dispatch({
        type: EMPLOYEES_REQUEST_SUCCESS,
        payload: {
          page: page,
          employees: response.data.users,
          pageCount: response.data.pageCount,
          itemCount: response.data.itemCount,
        },
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: EMPLOYEES_REQUEST_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const update = (page, updateData) => (dispatch) => {
  return ApiService.put(`api/user/${updateData.id}`, updateData).then(
    (response) => {
      dispatch({
        type: EMPLOYEES_EDIT_SUCCESS,
        payload: {
          page: page,
          userId: updateData.id,
          updateData: response.data,
        },
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: EMPLOYEES_EDIT_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const destroy = (userId, page) => (dispatch) => {
  return ApiService.delete(`api/user/${userId}`).then(
    (response) => {
      dispatch({
        type: EMPLOYEES_DELETE_SUCCESS,
        payload: {
          page: page,
          userId: userId,
        },
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: EMPLOYEES_DELETE_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const add = (user) => (dispatch) => {
  return ApiService.post(`api/user`, user).then(
    (response) => {
      dispatch({
        type: EMPLOYEES_ADD_SUCCESS,
        payload: {
          user: response.data,
        },
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: EMPLOYEES_ADD_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const review = (pr) => (dispatch) => {
  return ApiService.post(`api/performance-review`, pr).then(
    (response) => {
      dispatch({
        type: EMPLOYEES_REVIEW_SUCCESS,
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: EMPLOYEES_REVIEW_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};
