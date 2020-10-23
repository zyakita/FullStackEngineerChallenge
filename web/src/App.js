import React from 'react';
import { connect } from 'react-redux';
import { Router, Switch, Route, Link } from 'react-router-dom';
import { logout } from './actions/auth.action';
import { clearMessage } from './actions/message.action';
import { history } from './helpers/history';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';

import PrivateRoute from './components/private-route';

import HomePage from './pages/home.page';
import LoginPage from './pages/login.page';
import EmployeesPage from './pages/employees.page';
import PerformanceReviewPage from './pages/performance-review.page';
import MyPerformanceReviewsPage from './pages/my-performance-reviews.page';
import MyFeedbackRequestsPage from './pages/my-feedback-request.page';
import FeedbackPage from './pages/feedback.page';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
      isAdmin: false,
    };

    history.listen((location) => {
      // clear message when location change
      props.dispatch(clearMessage());
      // scroll to top
      window.scrollTo(0, 0);
    });
  }

  logOut = () => {
    this.props.dispatch(logout());
  };

  componentDidMount() {
    const user = this.props.user;

    if (user) {
      this.setState({
        currentUser: user,
        isAdmin: user.role === 'admin',
      });
    }
  }

  render() {
    const { currentUser, isAdmin } = this.state;
    return (
      <Router history={history}>
        <div>
          <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
            <h5 className="my-0 mr-md-auto font-weight-normal">
              <a href="/" className="p-2 text-dark">
                CompanyName
              </a>
            </h5>
            <nav className="my-2 my-md-0 mr-md-3">
              {/* home, public */}
              <a href="/home" className="p-2 text-dark">
                Home
              </a>
              {/* my performance reviews, logged && !admin */}
              {currentUser && !isAdmin && (
                <a href="/my-performance-reviews" className="p-2 text-dark">
                  My Performance
                </a>
              )}
              {/* my performance feedbacks, logged && !admin */}
              {currentUser && !isAdmin && (
                <a href="/my-feedback-requests" className="p-2 text-dark">
                  My Feedback Requests
                </a>
              )}
              {/* manage employees, logged && admin */}
              {currentUser && isAdmin && (
                <a href="/employees" className="p-2 text-dark">
                  Employees
                </a>
              )}

              {/* logout, logged */}
              {currentUser && (
                <a
                  href="/login"
                  className="p-2 text-dark"
                  onClick={() => this.logOut()}>
                  LogOut
                </a>
              )}
            </nav>
            {/* login button */}
            {!currentUser && (
              <Link to={'/login'} className="btn btn-outline-primary">
                Login
              </Link>
            )}
          </div>
          <div className="container mt-3">
            <Switch>
              <Route exact path={['/', '/home']} component={HomePage} />
              <Route exact path={'/login'} component={LoginPage} />

              <PrivateRoute
                path={'/employees/:page'}
                component={EmployeesPage}
              />
              <PrivateRoute path={'/employees'} component={EmployeesPage} />

              <PrivateRoute
                path={'/performance-review/:prId'}
                component={PerformanceReviewPage}
              />

              <PrivateRoute
                exact
                path={'/my-performance-reviews'}
                component={MyPerformanceReviewsPage}
              />

              <PrivateRoute
                exact
                path={'/my-feedback-requests'}
                component={MyFeedbackRequestsPage}
              />

              <PrivateRoute path={'/feedback/:fbId'} component={FeedbackPage} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state.auth;
  return {
    user,
  };
};

export default connect(mapStateToProps)(App);
