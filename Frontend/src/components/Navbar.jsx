import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

function Navbar() {
  const { status } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API_URL = "http://localhost:8000";

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {}

    dispatch(logout());
    navigate("/");
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">

          <div className="bg-white text-black w-10 h-10 rounded-lg flex items-center justify-center font-bold">
            C
          </div>

          <h1 className="text-white text-xl font-bold">
            CompanyMS
          </h1>

        </div>

        {/* Center Menu */}
        <div className="hidden md:flex gap-10 text-white">

          <button
            onClick={() => scrollToSection("features")}
            className="hover:text-gray-300 font-bold"
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection("about")}
            className="hover:text-gray-300 font bold"
          >
            About
          </button>

          <button
            onClick={() => scrollToSection("pricing")}
            className="hover:text-gray-300 font-bold"
          >
            Pricing
          </button>

          <button
            onClick={() => scrollToSection("contact-form")}
            className="hover:text-gray-300 font-bold"
          >
            Contact Us
          </button>

        </div>

        {/* Login / Logout */}
        <div>
          {!status ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-black px-4 py-2 rounded-lg font-semibold"
            >
              Login
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          )}
        </div>

      </div>

    </nav>
  );
}

export default Navbar;