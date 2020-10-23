import React from 'react';
import { connect } from 'react-redux';

const HomePage = ({ user }) => (
  <header className="jumbotron">
    {!user ? (
      <Intro />
    ) : (
      <div className="text-center">
        {user.name && <span>Welcome {user.name}</span>}
      </div>
    )}
  </header>
);

const Intro = () => (
  <div>
    <p>Please use follwing credentials to login:</p>

    <h5>Administrator:</h5>
    <code>
      <p>admin@example.com / 123456</p>
    </code>
    <h5>Employee:</h5>
    <code>
      <p>user50@example.com / 123456</p>
      <p>user49@example.com / 123456</p>
      <p>user48@example.com / 123456</p>
      <p>...</p>
      <p>user2@example.com / 123456</p>
    </code>
  </div>
);

const mapStateToProps = (state) => {
  const { user } = state.auth;
  return {
    user,
  };
};

export default connect(mapStateToProps)(HomePage);
