import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h2>Profile Page</h2>
      <h3>
        token:<strong>{currentUser.token}</strong>
      </h3>
    </div>
  );
};

export default Profile;
