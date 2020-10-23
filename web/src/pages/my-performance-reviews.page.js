import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ApiService from '../services/api.service';

const MyPerformanceReviewsPage = () => {
  const [prs, setPrs] = useState([]);
  useEffect(() => {
    ApiService.get(`api/performance-reviews/me`).then((res) =>
      setPrs(res.data)
    );
  }, []);

  return (
    <div>
      <div className="pb-2 mt-4 mb-2 border-bottom">
        <h2>My Performance Reviews</h2>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Title</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {prs.map((pr) => (
            <tr key={pr.id}>
              <td>{pr.id}</td>
              <td>
                <Link to={`/performance-review/${pr.id}`}>{pr.title}</Link>
              </td>

              <td>
                <small>{moment(pr.createdAt).format('MMMM Do YYYY')}</small>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyPerformanceReviewsPage;
