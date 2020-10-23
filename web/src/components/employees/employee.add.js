import React from 'react';
import { connect } from 'react-redux';
import validator from 'validator';
import { add } from '../../actions/employees.action';
import { setMessage } from '../../actions/message.action';

const initialState = {
  name: '',
  email: '',
  password: '',
};
class EmployeesAddForm extends React.Component {
  state = initialState;

  handleAddEmployee = () => {
    this.props.addEmployee(this.state).then(() => {
      this.props.setMessage('Add new employee sucessfuly');
      this.setState(initialState);
    });
  };
  render() {
    return (
      <div className="row">
        <div className="col-md-3 form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={this.state.name}
            onChange={(e) => this.setState({ name: e.target.value })}
          />
        </div>
        <div className="col-md-3 form-group">
          <label>Email</label>
          <input
            type="text"
            className="form-control"
            value={this.state.email}
            onChange={(e) => this.setState({ email: e.target.value })}
          />
        </div>
        <div className="col-md-3 form-group">
          <label>Password</label>
          <input
            type="text"
            className="form-control"
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value })}
          />
        </div>
        <div className="col-md-3 form-group">
          <label>&nbsp;</label>
          <button
            disabled={
              !this.state.name ||
              !this.state.email ||
              !this.state.password ||
              !validator.isEmail(this.state.email)
            }
            onClick={this.handleAddEmployee}
            type="button"
            className="btn btn-primary form-control">
            Add new employee
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { employees } = state;
  return {
    employees,
  };
}

const mapDispatchToProps = {
  addEmployee: add,
  setMessage: setMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeesAddForm);
