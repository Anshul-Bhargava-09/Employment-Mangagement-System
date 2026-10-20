import { useEffect, useState } from "react";

function ProfileForm({ profile, onSave }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    bio: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        position: profile.position || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="main-content card shadow-sm border-0 rounded-4">
      <div className="card-body p-4">

        <h5 className="fw-semibold mb-4 border-bottom pb-3">
          <i className="fa-regular fa-user me-2"></i>
          Public Profile
        </h5>

        <form onSubmit={handleSubmit}>

          <div className="row">

            <div className="col-md-6 mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="firstName"
                className="form-control"
               disabled value={formData.firstName}
                onChange={handleChange}
                // disabled={profile.isDeleted}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="form-control"
               disabled value={formData.lastName}
                onChange={handleChange}
                // disabled={profile.isDeleted}
              />
            </div>

          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
             disabled value={formData.email}
              onChange={handleChange}
              // disabled={profile.isDeleted}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Position</label>
            <input
              type="text"
              name="position"
              className="form-control"
            disabled value={formData.position}
              onChange={handleChange}
              // disabled={profile.isDeleted}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Bio</label>
            <textarea
              rows="4"
              name="bio"
              className="form-control"
              value={formData.bio}
              onChange={handleChange}
              disabled={profile.isDeleted}
            />
          </div>

          {profile.isDeleted ? (
            <div className="p-4 bg-danger-subtle border border-danger rounded-4 text-center">
              <h5 className="text-danger">Account Deactivated</h5>
              <p className="mb-0">
                You can no longer update your profile.
              </p>
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-end gap-3">
              {saved && (
                <span className="text-success small fw-semibold">
                  <i className="fa-solid fa-circle-check me-1"></i> Changes saved!
                </span>
              )}
              <button className="btn btn-primary px-4" type="submit">
                Save Changes
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}

export default ProfileForm;