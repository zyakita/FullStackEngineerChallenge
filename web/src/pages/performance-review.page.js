import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import ApiService from '../services/api.service';

class PerformanceReviewPage extends React.Component {
  state = {
    prId: undefined,
    prDetail: undefined,
    feedbacks: [],
    requestUserQuery: '',
    requestError: '',
  };

  getPrIdQuery = () => {
    const {
      match: { params },
    } = this.props;
    return parseInt(params.prId) || undefined;
  };

  componentDidMount() {
    const prId = this.getPrIdQuery();
    this.setState({ prId: prId, prDetail: undefined }, () =>
      this.getPrDetail()
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const prId = this.getPrIdQuery();
    if (prId !== prevState.prId) {
      this.setState({ prId: prId, prDetail: undefined }, () =>
        this.getPrDetail()
      );
    }
  }

  getPrDetail = () => {
    if (this.state.prId) {
      ApiService.get(`api/performance-review/${this.state.prId}`).then(
        (res) => {
          this.setState(
            {
              prDetail: res.data,
            },
            () => {
              this.getFeedbacks();
            }
          );
        }
      );
    }
  };

  getFeedbacks = () => {
    if (this.state.prId) {
      ApiService.get(
        `api/performance-review/${this.state.prId}/feedbacks`
      ).then((res) => {
        this.setState({
          feedbacks: res.data,
        });
      });
    }
  };

  handleRequestFeedback = () => {
    if (this.state.requestUserQuery) {
      ApiService.post(`api/performance-review/${this.state.prId}/feedback`, {
        query: this.state.requestUserQuery,
      })
        .then(() => {
          this.setState(
            {
              requestUserQuery: '',
              requestError: '',
            },
            () => {
              this.getFeedbacks();
            }
          );
        })
        .catch((err) =>
          this.setState({ requestError: err.response.data.message })
        );
    }
  };

  render() {
    const { prId, prDetail, feedbacks } = this.state;
    const { user } = this.props;
    return (
      <div>
        <div className="pb-2 mt-4 mb-2 border-bottom">
          <h2>Performance Review</h2>
        </div>
        {this.props.message && (
          <div className="alert alert-info" role="alert">
            {this.props.message}
          </div>
        )}

        {prId && prDetail && (
          <div>
            <p>
              <b>Employee:</b> {prDetail.User.name} ({prDetail.User.email})
            </p>
            <p>
              <b>Title:</b> {prDetail.title}
            </p>
            <p>
              <b>Description:</b> {prDetail.description}
            </p>
            <p>
              <b>Feedbacks:</b>
            </p>
            {user.role === 'admin' && (
              <div className="row">
                <div className="col-md-3 form-group">
                  <label>Enter Employee ID or Email</label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.requestUserQuery}
                    onChange={(e) =>
                      this.setState({ requestUserQuery: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-3 form-group">
                  <label>&nbsp;</label>
                  <button
                    disabled={!this.state.requestUserQuery}
                    onClick={this.handleRequestFeedback}
                    type="button"
                    className="btn btn-primary form-control">
                    Request Feedback
                  </button>
                </div>
              </div>
            )}
            {this.state.requestError && (
              <div className="alert alert-danger" role="alert">
                {this.state.requestError}
              </div>
            )}
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">By</th>
                  <th scope="col">Feedback</th>
                  <th scope="col">Status</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((fb) => (
                  <tr key={fb.id}>
                    <td>{fb.id}</td>
                    <td>{fb.User.name}</td>
                    <td>{fb.content}</td>
                    <td>{fb.status}</td>
                    <td>{moment(fb.createdAt).format('MMMM Do YYYY')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

export default connect(mapStateToProps)(withRouter(PerformanceReviewPage));
