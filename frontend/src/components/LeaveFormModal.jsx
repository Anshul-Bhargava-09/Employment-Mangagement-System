import { useState } from "react";

function LeaveFormModal({ show, onClose, onAddLeave }) {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    type: "SICK",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newLeave = {
      id: Date.now(),
      employee: {
        firstName: "Anshul",
        lastName: "Bhargava",
      },
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: "PENDING",
    };

    onAddLeave(newLeave);

    setFormData({
      type: "SICK",
      startDate: "",
      endDate: "",
      reason: "",
    });

    onClose();
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show"
        style={{
          display: "block",
          backgroundColor: "rgba(0,0,0,0.25)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div
            className="modal-content"
            style={{
              borderRadius: "18px",
              border: "none",
              overflow: "hidden",
              boxShadow: "0 15px 40px rgba(0,0,0,.2)",
            }}
          >
            <div
              className="modal-header"
              style={{
                background: "#0d6efd",
                color: "#fff",
                padding: "18px 25px",
              }}
            >
              <h5 className="modal-title fw-bold">
                Apply For Leave
              </h5>
            

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>
            </div>
              <p className="ms-2">Submit your leave request for approval</p>
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                {/* Leave Type */}

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Leave Type
                  </label>

                  <select
                    className="form-select"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="SICK">Sick Leave</option>
                    <option value="CASUAL">Casual Leave</option>
                    <option value="ANNUAL">Annual Leave</option>
                  </select>
                </div>

                {/* Duration */}

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Duration
                  </label>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="small text-muted">
                        Start Date
                      </label>

                      <input
                        type="date"
                        className="form-control"
                        name="startDate"
                        value={formData.startDate}
                        min={today}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="small text-muted">
                        End Date
                      </label>

                      <input
                        type="date"
                        className="form-control"
                        name="endDate"
                        value={formData.endDate}
                        min={formData.startDate || today}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Reason */}

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Reason
                  </label>

                  <textarea
                    rows="5"
                    className="form-control"
                    name="reason"
                    placeholder="Enter your reason for leave..."
                    value={formData.reason}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer border-0 px-4 pb-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary px-4"
                >
                  Apply Leave
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal-backdrop fade show"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      ></div>
    </>
  );
}

export default LeaveFormModal;