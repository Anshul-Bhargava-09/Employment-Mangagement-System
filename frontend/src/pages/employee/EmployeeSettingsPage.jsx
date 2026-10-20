import { useEffect, useState } from "react";
import { dummyProfileData } from "../../assets/assets";
import Loader from "../../components/Loader";
import ProfileForm from "../../components/ProfileForm";
import ChangePasswordModal from "../../components/ChangePasswordModal";

function EmployeeSettingsPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fetchProfile = async () => {
    setProfile(dummyProfileData);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      {/* Heading */}
      <div className="main-content d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Settings</h2>
          <p className="text-muted mb-0">Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile Card */}
      <ProfileForm profile={profile}/>

      {/* Password Card */}
      {!profile.isDeleted && (
        <div className=" main-content card shadow border-1 rounded-4 mt-4">
  <div className="card-body d-flex justify-content-between align-items-center p-3">

    {/* Left Side */}
    <div className="d-flex align-items-center">

      <div
        className="d-flex justify-content-center align-items-center rounded-3 bg-light"
        style={{ width: "48px", height: "48px" }}
      >
        <i className="fa-solid fa-lock text-secondary fs-5"></i>
      </div>

      <div className="ms-3">
        <h6 className="fw-semibold mb-1">Password</h6>
        <small className="text-muted">
          Update your account password
        </small>
      </div>

    </div>

    {/* Right Side */}
    <button
      className="btn btn-outline-secondary px-4"
      onClick={() => setShowPasswordModal(true)}
    >
      Change
    </button>

      <ChangePasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

  </div>
</div>
      )}
    </>
  );
}

export default EmployeeSettingsPage;
