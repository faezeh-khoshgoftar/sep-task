import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu } from "antd";
import { CgProfile } from "react-icons/cg";
import { FaUsers } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import { logout } from "../slices/auth";

function getItem(label, key, icon) {
  return {
    label,
    key,
    icon,
  };
}
const items = [
  getItem("Profile", "profile", <CgProfile />),
  getItem("Users", "users", <FaUsers />),
  getItem("Logout", "logout", <BiLogOutCircle />),
];

function Root() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  let pathName = useLocation().pathname;
  async function logoutHandler() {
    await dispatch(logout());
    navigate("login");
  }
  const onClick = (e) => {
    if (e.key === "logout") {
      logoutHandler();
    } else {
      navigate(e.key);
    }
  };
  return (
    <div className="min-h-screen">
      {!currentUser ? (
        <div className="p-2.5 md:p-10">
          <nav>
            <ul className="flex justify-between">
              <li>
                <Link to={"/register"}>Register</Link>
              </li>
              <li>
                <Link to={"/login"}>Login</Link>
              </li>
            </ul>
          </nav>
          <h1 className="text-center mt-20 font-bold text-xl md:text-3xl">
            Welcome to sep panel
          </h1>
        </div>
      ) : (
        <div className="flex min-h-screen">
          <Menu
            onClick={onClick}
            style={{ width: "fit-content" }}
            defaultSelectedKeys={
              pathName === "/" ? "profile" : pathName.slice(1)
            }
            items={items}
            theme="dark"
          />
          <div className="w-full py-10 px-5">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
}

export default Root;
