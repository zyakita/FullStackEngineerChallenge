import React from 'react';

const PerformanceAddModal = ({
  modalInfoNotice,
  handleCloseModal,
  performanceReview,
  handleChangePerformanceReview,
  handleSavePerformanceReview,
}) => {
  return (
    <div className="card card-container p-4">
      <h3>Add new performance review</h3>
      {modalInfoNotice && (
        <div className="alert alert-primary" role="alert">
          {modalInfoNotice}
        </div>
      )}
      <div className="form-group">
        <label>Employee</label>
        <input
          type="text"
          disabled
          className="form-control"
          value={performanceReview.userName}
        />
      </div>
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          className="form-control"
          value={performanceReview.title}
          onChange={(e) =>
            handleChangePerformanceReview('title', e.target.value)
          }
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          className="form-control"
          value={performanceReview.description}
          onChange={(e) =>
            handleChangePerformanceReview('description', e.target.value)
          }
        />
      </div>
      <div className="mt-4 text-right">
        <button
          onClick={handleCloseModal}
          type="button"
          className="btn btn-link">
          Close
        </button>
        <button
          disabled={!performanceReview.title || !performanceReview.description}
          onClick={handleSavePerformanceReview}
          type="button"
          className="btn btn-primary">
          Add
        </button>
      </div>
    </div>
  );
};

export default PerformanceAddModal;
