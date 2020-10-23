import React from 'react';
import validator from 'validator';

const EmployeeEditModal = ({
  modalInfoNotice,
  handleCloseModal,
  editingEmployee,
  handleChangeEditingEmployee,
  handleSaveEditingEmployee,
}) => (
  <div className="card card-container p-4">
    <h3>Update Employee</h3>
    {modalInfoNotice && (
      <div className="alert alert-primary" role="alert">
        {modalInfoNotice}
      </div>
    )}
    <div className="form-group">
      <label htmlFor="name">Name</label>
      <input
        type="text"
        className="form-control"
        name="name"
        value={editingEmployee.name}
        onChange={(e) => handleChangeEditingEmployee('name', e.target.value)}
      />
    </div>
    <div className="form-group">
      <label htmlFor="email">Email</label>
      <input
        type="text"
        className="form-control"
        name="email"
        value={editingEmployee.email}
        onChange={(e) => handleChangeEditingEmployee('email', e.target.value)}
      />
    </div>
    <div className="form-group">
      <label htmlFor="password">Password</label>
      <input
        type="text"
        className="form-control"
        name="password"
        placeholder="Leave blank if you don't want to change it"
        onChange={(e) =>
          handleChangeEditingEmployee('password', e.target.value)
        }
      />
    </div>
    <div className="mt-4 text-right">
      <button onClick={handleCloseModal} type="button" className="btn btn-link">
        Close
      </button>
      <button
        disabled={
          !editingEmployee.name ||
          !editingEmployee.email ||
          !validator.isEmail(editingEmployee.email)
        }
        onClick={handleSaveEditingEmployee}
        type="button"
        className="btn btn-primary">
        Save
      </button>
    </div>
  </div>
);

export default EmployeeEditModal;
