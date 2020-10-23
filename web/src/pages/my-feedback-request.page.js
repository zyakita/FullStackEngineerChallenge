import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ApiService from '../services/api.service';

const MyFeedbackRequestsPage = () => {
  const [pbs, setPbs] = useState([]);
  useEffect(() => {
    ApiService.get(`api/performance-reviews/requests-me`).then((res) =>
      setPbs(res.data)
    );
  }, []);
  console.log(pbs);
  return (
    <div>
      <div className="pb-2 mt-4 mb-2 border-bottom">
        <h2>My Feedback Requests</h2>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Title</th>
            <th scope="col">For</th>
            <th scope="col">Status</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {pbs.map((pb) => (
            <tr key={pb.id}>
              <td>{pb.id}</td>
              <td>
                <Link to={`/feedback/${pb.id}`}>
                  {pb.PerformanceReview.title}
                </Link>
              </td>
              <td>{pb.PerformanceReview.User.name}</td>
              <td>{pb.status}</td>
              <td>
                <small>{moment(pb.createdAt).format('MMMM Do YYYY')}</small>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyFeedbackRequestsPage;
