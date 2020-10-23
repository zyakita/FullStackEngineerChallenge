import React from 'react';
import { connect } from 'react-redux';

import EmployeesAddForm from '../components/employees/employee.add';
import EmployeesList from '../components/employees/employees.list';

class EmployeesPage extends React.Component {
  render() {
    return (
      <div>
        <div className="pb-2 mt-4 mb-2 border-bottom">
          <h2>Employees Management</h2>
        </div>
        {this.props.message && (
          <div className="alert alert-info" role="alert">
            {this.props.message}
          </div>
        )}
        <EmployeesAddForm />
        <EmployeesList />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state.auth;
  const { message } = state.message;
  return {
    user,
    message,
  };
};

export default connect(mapStateToProps)(EmployeesPage);
