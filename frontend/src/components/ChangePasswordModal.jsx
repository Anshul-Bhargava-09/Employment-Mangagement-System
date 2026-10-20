import React, { useState } from "react";
import API_BASE_URL from "../config/api";

function ChangePasswordModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("ems_token");
      const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({
          type: "success",
          text: "Password updated successfully.",
        });

        setFormData({
          currentPassword: "",
          newPassword: "",
        });

        // Close after a short delay so the user sees success
        setTimeout(() => {
          if (onClose) onClose();
        }, 1500);
      } else {
        setMessage({
          type: "danger",
          text: data.error || "Failed to update password.",
        });
      }
    } catch (err) {
      setMessage({
        type: "danger",
        text: "Network error. Failed to update password.",
      });
    }

    setLoading(false);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          background: "rgba(0,0,0,.45)",
          backdropFilter: "blur(4px)",
          zIndex: 1040,
        }}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className="position-fixed top-50 start-50 translate-middle"
        style={{ zIndex: 1050, width: "430px", maxWidth: "95%" }}
      >
        <div
          className="card border-0 shadow-lg rounded-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-4 px-4">
            <h5 className="mb-0">
              <i className="fa-solid fa-lock me-2 text-secondary"></i>
              Change Password
            </h5>

            <button
              className="btn btn-light btn-sm rounded-circle"
              onClick={onClose}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Body */}
          <div className="card-body px-4 pb-4">
            <form onSubmit={handleSubmit}>
              {message.text && (
                <div className={`alert alert-${message.type}`}>
                  {message.text}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">
                  Current Password
                </label>

                <input
                  type="password"
                  className="form-control"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">
                  New Password
                </label>

                <input
                  type="password"
                  className="form-control"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary flex-fill"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary flex-fill"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangePasswordModal;