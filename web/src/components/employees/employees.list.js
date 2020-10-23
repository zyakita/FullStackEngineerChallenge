import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Modal from 'react-modal';

import EmployeeEditModal from './modals/employee.edit.modal';
import PerformanceAddModal from './modals/performance.add.modal';
import PerformancesListModal from './modals/performances.list.modal';
import { get, destroy, update, review } from '../../actions/employees.action';

Modal.setAppElement('#root');

class EmployeesList extends React.Component {
  state = {
    loading: false,
    currentPage: 1,
    openModal: false,
    modalInfoNotice: undefined,
    editingEmployee: undefined,
    performanceReview: undefined,
    performanceViewUserId: undefined,
  };

  getPageQuery = () => {
    const {
      match: { params },
    } = this.props;
    return params.page || 1;
  };

  componentDidMount() {
    const page = this.getPageQuery();
    this.getList(page);
  }

  componentDidUpdate(prevProps, prevState) {
    const page = this.getPageQuery();
    if (prevState.currentPage && page !== prevState.currentPage) {
      this.getList(page);
    }
  }

  getList = (page) => {
    this.setState(
      {
        currentPage: page,
        loading: true,
      },
      () => {
        this.props.getEmployees(page).then(() => {
          this.setState({
            loading: false,
          });
        });
      }
    );
  };

  paginationItem = (page) => {
    page = page + 1;
    return (
      <li
        className={
          page === parseInt(this.state.currentPage)
            ? `page-item active`
            : `page-item`
        }
        key={page}>
        <Link className="page-link" to={`/employees/${page}`}>
          {page}
        </Link>
      </li>
    );
  };

  handleUpdate = (employee) => {
    this.setState({ openModal: true, editingEmployee: employee });
  };

  handleChangeEditingEmployee = (key, value) => {
    this.setState({
      editingEmployee: {
        ...this.state.editingEmployee,
        [key]: value,
      },
    });
  };

  handleSaveEditingEmployee = () => {
    const { editingEmployee, currentPage } = this.state;

    this.props.updateEmployee(currentPage, editingEmployee).then(() => {
      this.setState({ modalInfoNotice: 'Update sucessfuly' });
    });
  };

  handleDelete = (userId, userName) => {
    const confirmDelete = window.confirm(`Delete ${userName}?`);
    if (confirmDelete === true) {
      this.props.deleteEmployee(userId, this.state.currentPage);
    }
  };

  handleAddPerformanceReview = (employee) => {
    this.setState({
      openModal: true,
      performanceReview: {
        title: '',
        description: '',
        userId: employee.id,
        userName: employee.name,
      },
    });
  };

  handleChangePerformanceReview = (key, value) => {
    this.setState({
      performanceReview: {
        ...this.state.performanceReview,
        [key]: value,
      },
    });
  };

  handleSavePerformanceReview = () => {
    const { performanceReview } = this.state;
    this.props.reviewEmployee(performanceReview).then(() => {
      this.setState({
        modalInfoNotice: 'Review sucessfuly',
        performanceReview: {
          ...this.state.performanceReview,
          title: '',
          description: '',
        },
      });
    });
  };

  handleViewPerformanceReviews = (employee) => {
    this.setState({
      openModal: true,
      performanceViewUserId: employee.id,
    });
  };

  handleCloseModal = () => {
    this.setState({
      openModal: false,
      editingEmployee: undefined,
      modalInfoNotice: undefined,
      performanceReview: undefined,
      performanceViewUserId: undefined,
    });
  };

  render() {
    const { currentPage } = this.state;
    const { employees } = this.props;

    return (
      <div>
        {/* the list */}
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Performance</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            {employees &&
              employees.paginations[currentPage] &&
              employees.paginations[currentPage].map((employee) => (
                <tr key={employee.id}>
                  <th scope="row">{employee.id}</th>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>
                    <span
                      onClick={() =>
                        this.handleViewPerformanceReviews(employee)
                      }
                      className="handle-icon"
                      aria-label="view"
                      role="img">
                      👀
                    </span>
                    <span
                      onClick={() => this.handleAddPerformanceReview(employee)}
                      className="handle-icon"
                      aria-label="add"
                      role="img">
                      ➕
                    </span>
                  </td>
                  <td>
                    <span
                      onClick={() => this.handleUpdate(employee)}
                      className="handle-icon"
                      aria-label="edit"
                      role="img">
                      🖊
                    </span>
                    <span
                      onClick={() =>
                        this.handleDelete(employee.id, employee.name)
                      }
                      className="handle-icon"
                      aria-label="remove"
                      role="img">
                      ❌
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {/* the navigation */}
        {employees && employees.pageCount > 1 && (
          <nav>
            <ul className="pagination">
              {[...Array(employees.pageCount).keys()].map((page) =>
                this.paginationItem(page)
              )}
            </ul>
          </nav>
        )}
        {/* editing modal */}
        <Modal
          style={modalStyles}
          onRequestClose={this.handleCloseModal}
          isOpen={this.state.openModal}>
          {this.state.editingEmployee && (
            <EmployeeEditModal
              modalInfoNotice={this.state.modalInfoNotice}
              handleCloseModal={this.handleCloseModal}
              editingEmployee={this.state.editingEmployee}
              handleChangeEditingEmployee={this.handleChangeEditingEmployee}
              handleSaveEditingEmployee={this.handleSaveEditingEmployee}
            />
          )}
          {this.state.performanceReview && (
            <PerformanceAddModal
              modalInfoNotice={this.state.modalInfoNotice}
              handleCloseModal={this.handleCloseModal}
              performanceReview={this.state.performanceReview}
              handleChangePerformanceReview={this.handleChangePerformanceReview}
              handleSavePerformanceReview={this.handleSavePerformanceReview}
            />
          )}
          {this.state.performanceViewUserId && (
            <PerformancesListModal
              handleCloseModal={this.handleCloseModal}
              userId={this.state.performanceViewUserId}
            />
          )}
        </Modal>
      </div>
    );
  }
}

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9,
  },
  content: {
    width: 500,
    height: 'auto',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: 600,
    overflowY: 'scroll',
  },
};

function mapStateToProps(state) {
  const { employees } = state;
  return {
    employees,
  };
}

const mapDispatchToProps = {
  getEmployees: get,
  deleteEmployee: destroy,
  updateEmployee: update,
  reviewEmployee: review,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EmployeesList));
