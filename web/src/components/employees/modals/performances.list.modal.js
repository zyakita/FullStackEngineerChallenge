import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ApiService from '../../../services/api.service';

const PerformancesListModal = ({ userId, handleCloseModal }) => {
  const [prs, setPrs] = useState([]);
  useEffect(() => {
    ApiService.get(`api/performance-reviews/user/${userId}`).then((res) =>
      setPrs(res.data)
    );
  }, [userId]);

  return (
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
  );
};

export default PerformancesListModal;
