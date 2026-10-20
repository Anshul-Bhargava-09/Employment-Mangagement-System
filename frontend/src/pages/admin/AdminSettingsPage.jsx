import { useState, useEffect } from "react";
import ChangePasswordModal from "../../components/ChangePasswordModal";
import Loader from "../../components/Loader";

function AdminSettingsPage() {
  const [profile, setProfile] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@ems.com",
    role: "ADMIN",
    organization: "Employment Management System",
  });
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("ems_user");
      if (userStr) {
        const u = JSON.parse(userStr);
        setProfile((prev) => ({
          ...prev,
          firstName: u.firstName || "Admin",
          lastName: u.lastName || "",
          email: u.email || "admin@ems.com",
        }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <Loader />;

  return (
    <>
      {/* Header */}
      <div className="main-content d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Admin Settings</h2>
          <p className="text-muted mb-0">System configuration and security preferences</p>
        </div>
      </div>

      {/* Admin Profile Details */}
      <div className="main-content">
        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <div className="card-body p-4">
            <h5 className="fw-semibold mb-4 border-bottom pb-3">
              <i className="fa-solid fa-user-shield me-2 text-primary"></i>
              Administrator Profile
            </h5>

            <form onSubmit={handleSaveSettings}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium small">Administrator Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium small">Account Role</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    disabled
                    value="System Administrator"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium small">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-medium small">Organization</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.organization}
                    onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                  />
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-end gap-3 mt-4 pt-2 border-top">
                {saved && (
                  <span className="text-success small fw-semibold">
                    <i className="fa-solid fa-circle-check me-1"></i> Settings saved successfully!
                  </span>
                )}
                <button type="submit" className="btn btn-primary px-4">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Security / Password Card */}
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body d-flex justify-content-between align-items-center p-4">
            <div className="d-flex align-items-center">
              <div
                className="d-flex justify-content-center align-items-center rounded-3 bg-light text-primary"
                style={{ width: "48px", height: "48px" }}
              >
                <i className="fa-solid fa-lock fs-5"></i>
              </div>
              <div className="ms-3">
                <h6 className="fw-semibold mb-1">Security & Password</h6>
                <small className="text-muted">
                  Update your administrator login password
                </small>
              </div>
            </div>

            <button
              className="btn btn-outline-primary px-4"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}

export default AdminSettingsPage;