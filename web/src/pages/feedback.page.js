import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import ApiService from '../services/api.service';

class FeedbackPage extends React.Component {
  state = {
    fbId: undefined,
    fbDetail: undefined,
    feedbackContent: '',
    feedbackSucess: false,
    requestError: '',
  };

  getFbIdQuery = () => {
    const {
      match: { params },
    } = this.props;
    return parseInt(params.fbId) || undefined;
  };

  componentDidMount() {
    const fbId = this.getFbIdQuery();
    this.setState({ fbId: fbId, fbDetail: undefined }, () =>
      this.getFbDetail()
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const fbId = this.getFbIdQuery();
    if (fbId !== prevState.fbId) {
      this.setState({ fbId: fbId, fbDetail: undefined }, () =>
        this.getFbDetail()
      );
    }
  }

  getFbDetail = () => {
    if (this.state.fbId) {
      ApiService.get(
        `api/performance-reviews/feedback/${this.state.fbId}`
      ).then((res) => {
        this.setState({
          fbDetail: res.data,
        });
      });
    }
  };

  handleSubmitFeedback = () => {
    if (!this.state.feedbackContent || !this.state.fbDetail) {
      return false;
    }
    const { fbDetail, feedbackContent } = this.state;
    ApiService.put(
      `api/performance-review/${fbDetail.PerformanceReview.id}/feedback/${fbDetail.id}`,
      { content: feedbackContent }
    ).then((res) => {
      this.setState({
        feedbackSucess: true,
      });
    });
  };

  render() {
    const { fbId, fbDetail, feedbackSucess } = this.state;
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

        {fbId && fbDetail && (
          <div>
            <p>
              <b>Employee:</b> {fbDetail.PerformanceReview.User.name} (
              {fbDetail.PerformanceReview.User.email})
            </p>
            <p>
              <b>Title:</b> {fbDetail.PerformanceReview.title}
            </p>
            <p>
              <b>Description:</b> {fbDetail.PerformanceReview.description}
            </p>
            <p>
              <b>My Feedback:</b>
            </p>
            {fbDetail.status === 'submitted' ? (
              <p>{fbDetail.content}</p>
            ) : (
              <div className="">
                <div className="form-group">
                  <textarea
                    rows={8}
                    disabled={this.state.feedbackSucess}
                    className="form-control"
                    value={this.state.feedbackContent}
                    onChange={(e) =>
                      this.setState({ feedbackContent: e.target.value })
                    }
                  />
                  <div className="form-group mt-2">
                    <button
                      disabled={
                        !this.state.feedbackContent || this.state.feedbackSucess
                      }
                      type="button"
                      onClick={this.handleSubmitFeedback}
                      className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}

            {feedbackSucess && (
              <div className="alert alert-info" role="alert">
                Submit feedback sucessfuly
              </div>
            )}
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

export default connect(mapStateToProps)(withRouter(FeedbackPage));
