import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../actions/auth.action';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      loading: false,
    };
  }

  handleLogin = () => {
    this.setState({
      loading: true,
    });

    if (!this.state.email || !this.state.password) {
      return;
    }

    const { dispatch, history } = this.props;
    dispatch(login(this.state.email, this.state.password))
      .then(() => {
        history.push('/');
        window.location.reload();
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    const { isLoggedIn, message } = this.props;

    if (isLoggedIn) {
      return <Redirect to="/" />;
    }

    return (
      <div className="row pt-4">
        <div className="col-md-4"></div>
        <div className="col-md-4">
          <div className="card card-container p-4">
            <img
              src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
              alt="profile-img"
              className="profile-img-card"
            />

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                className="form-control"
                name="email"
                placeholder="admin@example.com"
                value={this.state.email}
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="123456"
                value={this.state.password}
                onChange={(e) => this.setState({ password: e.target.value })}
              />
            </div>

            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
                disabled={
                  this.state.loading ||
                  !this.state.email ||
                  !this.state.password
                }
                onClick={() => this.handleLogin()}>
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>

            {message && (
              <div className="form-group text-center">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-4"></div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.auth;
  const { message } = state.message;
  return {
    isLoggedIn,
    message,
  };
}

export default connect(mapStateToProps)(LoginPage);
