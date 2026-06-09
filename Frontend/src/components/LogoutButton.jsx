import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../features/auth/authSlice";
import { logoutUserAPI } from "../features/auth/authAPI";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUserAPI();

      dispatch(logout());

      navigate("/login");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-40 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
    >
      Logout
    </button>
  );
};

export default LogoutButton;