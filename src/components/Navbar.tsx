// import { FaBars } from "react-icons/fa";
// import { IoPersonCircleOutline } from "react-icons/io5";
// import { MdOutlineLogout } from "react-icons/md";
// import { FaChevronDown } from "react-icons/fa";

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SITE_URL } from "../common/constant";
import {
  useFetchAdminRolesById,
  useFetchAdminRoles,
} from "../api/AdminRoleApi";
import { useFetchAdminUsers } from "../api/AdminUserApi";
import { useAuthContext } from "../hooks/useAuthContext";
import { AdminUser } from "../api/AdminUserApi";

const Navbar: React.FC = () => {
  const location = useLocation();
  const { Adminusers, isLoading: adminusersLoading } = useFetchAdminUsers();
  const [AdminData, setAdminData] = useState<AdminUser | null>(null);
  const {
    state: { user },
    loadUser,
  } = useAuthContext();
  console.log("user", user);

  useEffect(() => {
    if (!user) {
      loadUser();
    } else {
      setAdminData(user);
    }
  }, [user, adminusersLoading]);

  const currentPath = location.pathname;

  const roleId = user?.roleId;
  const { AdminRoleById, isLoading, error } = useFetchAdminRolesById(roleId);

  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);
  const sidebarRef = useRef(null);
  const logoutRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleLogout = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div>
      <div className='h-[80px] pb-10 sticky z-50 bg-[#F8F8FF]'>
        <div className='flex justify-between w-screen pr-6'>
          <div className='bg-[#F8F8FF] h-[80px] w-screen'>
            <div className='relative z-[9999] p-5 flex justify-between'>
              <div className='flex items-center gap-2'>
                <div onClick={toggleSidebar}>
                  <button
                    type='button'
                    aria-controls='drawer-navigation'
                    className='text-red-50 text-2xl pl-2'>
                    Menu
                  </button>
                </div>
                <span className='ml-2'></span>
              </div>
              <div className='flex items-center gap-4 cursor-pointer'>
                <div className='flex gap-5 mx-4 items-center'>
                  <h1
                    className={`font-bold ${
                      currentPath === "/overview"
                        ? "text-black"
                        : "text-[#9C9C9C]"
                    }`}>
                    <Link to='/overview'>Overview</Link>
                  </h1>
                  <h1
                    className={`font-bold ${
                      currentPath === "/order-dashboard"
                        ? "text-black"
                        : "text-[#9C9C9C]"
                    }`}>
                    <Link to='/order-dashboard'>Dashboard</Link>
                  </h1>
                </div>
                <div
                  //   onClick={handleIconClick}
                  style={{
                    cursor: "pointer",
                    display: "inline-block",
                    position: "relative",
                  }}>
                  <svg
                    width='21'
                    height='27'
                    viewBox='0 0 21 27'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M12.6774 2.07948C13.5741 2.34279 14.365 2.75463 15.0382 3.30404C17 4.90512 17.6334 7.27277 17.6334 14.2627V14.3496C17.6334 15.4048 18.085 15.9516 18.6569 16.644L18.6578 16.6451L18.6589 16.6465C19.4462 17.5999 20.4263 18.7868 20.4263 21.6927C20.4263 21.8691 20.2853 22.0117 20.1109 22.0117H14.6152C14.4526 24.325 12.5422 26.1572 10.2148 26.1572C7.88571 26.1572 5.97372 24.325 5.81105 22.0117H0.315328C0.14098 22.0117 0 21.8691 0 21.6927C0 18.7866 0.980187 17.5998 1.76834 16.6455L1.77025 16.6432C2.34208 15.9508 2.79374 15.4039 2.79374 14.3487V9.57876C2.79374 5.72447 4.59645 3.0036 7.7489 2.07948C7.96997 0.879389 8.99437 0 10.2148 0C11.4336 0 12.4571 0.879389 12.6774 2.07948Z'
                      fill='black'
                    />
                  </svg>

                  {/* {totalDotCount > 0 && (
                    <span className='absolute top-[3px] bg-[red] right-0 size-[9px] rounded-full border-[1.5px] border-white text-[5px]'></span>
                  )} */}
                </div>
                <div
                  className='flex items-center gap-4 cursor-pointer'
                  onClick={toggleLogout}>
                  <div className='text-4xl'>
                    {/* <IoPersonCircleOutline /> */}
                  </div>
                  <div>
                    <h1>{AdminData?.name}</h1>
                    <h1 className='text-[10px]'>{AdminData?.role}</h1>
                  </div>
                </div>
              </div>
              {isDrawerOpen && (
                <div
                  ref={drawerRef}
                  style={{
                    position: "absolute",
                    top: "60px",
                    right: "0",
                    width: "200px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    padding: "10px",
                    borderRadius: "5px",
                    zIndex: "1000",
                  }}>
                  {/* {orderNotification > 0 && (
                    <p>
                      <Link to='/orders'>Order: {orderNotification}</Link>
                    </p>
                  )}
                  {notifyNotification > 0 && (
                    <p>
                      <Link to='/notify'>Notify: {notifyNotification}</Link>
                    </p>
                  )}
                  {affiliateNotification > 0 && (
                    <p>
                      <Link to='/affiliate'>
                        Affiliate: {affiliateNotification}
                      </Link>
                    </p>
                  )}
                  {userNotification > 0 && (
                    <p>
                      <Link to='/users'>User: {userNotification}</Link>
                    </p>
                  )}

                  {deletedUserNotification > 0 && (
                    <p>
                      <Link to='/deletedUsers'>
                        Deleted User: {deletedUserNotification}
                      </Link>
                    </p>
                  )}
                  {productNotification > 0 && (
                    <p>
                      <Link to='/products'>Product: {productNotification}</Link>
                    </p>
                  )}
                  {candidateNotification > 0 && (
                    <p>
                      <Link to='/candidates'>
                        Candidate: {candidateNotification}
                      </Link>
                    </p>
                  )}
                  {careerNotification > 0 && (
                    <p>
                      <Link to='/career'>Career: {careerNotification}</Link>
                    </p>
                  )}
                  {newsletterNotification > 0 && (
                    <p>
                      <Link to='/newsletter'>
                        Newsletter: {newsletterNotification}
                      </Link>
                    </p>
                  )} */}
                </div>
              )}
              {/* Dropdown content */}
              {isOpen && (
                <div
                  ref={logoutRef}
                  className='absolute right-0 top-[83%] mt-2 mr-3 w-[250px] bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10'>
                  <ul className='py-2'>
                    {/* Additional items can be added here */}
                    <li>
                      <h1 className='flex items-center p-2 pb-1 text-gray-900 rounded-lg dark:text-white group'>
                        <span className='ms-3 whitespace-nowrap text-sm uppercase'>
                          {AdminData?.role}
                        </span>
                      </h1>
                    </li>
                    <li>
                      <h1 className='flex items-center p-2 pt-0 text-gray-900 rounded-lg dark:text-gray-400 group'>
                        <span className='ms-3 whitespace-nowrap text-sm'>
                          {AdminData?.email}
                        </span>
                      </h1>
                    </li>
                    <li>
                      <Link
                        className='flex items-center p-2 mt-4 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
                        to='/'>
                        <span className='ms-3 whitespace-nowrap'>
                          {/* <MdOutlineLogout /> */} User
                        </span>
                        <span className='ms-3 whitespace-nowrap'>Logout</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isSidebarOpen && (
        <div
          ref={sidebarRef}
          id='drawer-navigation z-[99999] '
          className='bg-[#F8F8FF] h-full fixed top-0 left-0 w-48 pt-0 '
          tabIndex={-1}
          aria-labelledby='drawer-navigation-label'>
          {/* Sidebar Content */}
          <div>
            <div className='flex items-center gap-2 p-5 pt-6'>
              <button
                type='button'
                onClick={toggleSidebar}
                aria-controls='drawer-navigation'
                className='text-black text-2xl pl-2'>
                {/* <FaBars className='text-2xl' /> */} Logo
              </button>
              <span className='ml-2'>
                <img
                  src={`${SITE_URL}/logo.svg`}
                  className='size-8 mix-blend-multiply bg-[#F9F9F9]'
                  alt='Logo'
                />
              </span>
            </div>
            <ul className='font-medium text-black p-5 pt-2'>
              {AdminRoleById?.data?.accessibility?.orders.includes("VIEW") && (
                <li>
                  <Link
                    className='flex items-center p-2 text-black rounded-lg group'
                    to='/orders'
                    // onClick={() => handleClick("order")}
                  >
                    <span className='flex-1 ms-3 whitespace-nowrap'>
                      Orders
                    </span>
                  </Link>
                </li>
              )}
              {AdminRoleById?.data?.accessibility?.products.includes(
                "VIEW"
              ) && (
                <li>
                  <Link
                    className='flex items-center p-2 text-black rounded-lg hover:bg-gray-100group'
                    to='/products'
                    // onClick={() => handleClick("products")}
                  >
                    <span className='flex-1 ms-3 whitespace-nowrap'>
                      Products
                    </span>
                  </Link>
                </li>
              )}
              {AdminRoleById?.data?.accessibility?.products.includes(
                "VIEW"
              ) && (
                <li>
                  <Link
                    className='flex items-center p-2 text-black rounded-lg hover:bg-gray-100group'
                    to='/inventory'
                    onClick={() => toggleSidebar()}>
                    <span className='flex-1 ms-3 whitespace-nowrap'>
                      Inventory
                    </span>
                  </Link>
                </li>
              )}
              {AdminRoleById?.data?.accessibility?.chatroom.includes(
                "VIEW"
              ) && (
                <li>
                  <Link
                    className='flex items-center p-2 text-black rounded-lg hover:bg-gray-100group'
                    to='/chat-room'
                    onClick={() => toggleSidebar()}>
                    <span className='flex-1 ms-3 whitespace-nowrap'>
                      Chat Rooms
                    </span>
                  </Link>
                </li>
              )}
              {AdminRoleById?.data?.accessibility?.chatroom.includes(
                "VIEW"
              ) && (
                <li>
                  <Link
                    className='flex items-center p-2 text-black rounded-lg ml-4'
                    to='#'
                    onClick={toggleDropdown}>
                    <span className='flex items-center justify-between w-full'>
                      {/* "More" text */}
                      <span className='flex items-center'>
                        More
                        {/* Icon beside "More" */}
                        <span className='ml-2'>
                          {isDropdownOpen ? (
                            "->"
                          ) : (
                            <svg
                              width='8'
                              height='13'
                              viewBox='0 0 8 13'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'>
                              <path
                                d='M1 1L6 6.5L1 12'
                                stroke='black'
                                stroke-width='1.5'
                                stroke-linecap='round'
                              />
                            </svg>
                          )}
                        </span>
                      </span>
                    </span>
                  </Link>

                  {isDropdownOpen && (
                    <ul
                      ref={dropdownRef}
                      className='ml-6 '>
                      {" "}
                      {/* Margin left and spacing */}
                      {AdminRoleById?.data?.accessibility?.emails.includes(
                        "VIEW"
                      ) && (
                        <li>
                          <Link
                            className='flex items-center p-2 text-black rounded-lg hover:bg-gray-100group'
                            to='/emails'
                            // onClick={() => handleClick("order")}
                          >
                            <span className='flex-1 ms-3 whitespace-nowrap'>
                              Emails
                            </span>
                          </Link>
                        </li>
                      )}
                      {AdminRoleById?.data?.accessibility?.emails.includes(
                        "VIEW"
                      ) && (
                        <li>
                          <Link
                            className='flex items-center p-2 text-black rounded-lg hover:bg-gray-100group'
                            to='/customer'
                            // onClick={() => handleClick("customer")}
                          >
                            <span className='flex-1 ms-3 whitespace-nowrap'>
                              Customer
                            </span>
                          </Link>
                        </li>
                      )}
                      {AdminRoleById?.data?.accessibility?.users.includes(
                        "VIEW"
                      ) && (
                        <li>
                          <Link
                            className='flex items-center p-2 text-black rounded-lg hover:bg-gray-100 group'
                            to='/users'
                            // onClick={() => handleClick("users")}
                          >
                            <span className='flex-1 ms-3 whitespace-nowrap'>
                              Users
                            </span>
                          </Link>
                        </li>
                      )}
                      {AdminRoleById?.data?.accessibility?.affiliates.includes(
                        "VIEW"
                      ) && (
                        <li>
                          <Link
                            className='flex items-center p-2 text-black rounded-lg hover:bg-gray-100group'
                            to='/affiliate'
                            // onClick={() => handleClick("affiliate")}
                          >
                            <span className='flex-1 ms-3 whitespace-nowrap'>
                              Affiliates
                            </span>
                          </Link>
                        </li>
                      )}
                      {AdminRoleById?.data?.accessibility?.career.includes(
                        "VIEW"
                      ) && (
                        <li>
                          <Link
                            className='flex items-center p-2 text-black rounded-lg hover:bg-gray-100group'
                            to='/career'
                            // onClick={() => handleClick("career")}
                          >
                            <span className='flex-1 ms-3 whitespace-nowrap'>
                              Career
                            </span>
                          </Link>
                        </li>
                      )}
                      {AdminRoleById?.data?.accessibility?.candidates.includes(
                        "VIEW"
                      ) && (
                        <li>
                          <Link
                            className='flex items-center p-2 text-black rounded-lg hover:bg-gray-100group'
                            to='/candidates'
                            // onClick={() => handleClick("candidates")}
                          >
                            <span className='flex-1 ms-3 whitespace-nowrap'>
                              Candidates
                            </span>
                          </Link>
                        </li>
                      )}
                      {AdminRoleById?.data?.accessibility?.adminusers.includes(
                        "VIEW_ADMIN"
                      ) && (
                        <li>
                          <Link
                            className='flex items-center p-2 text-black rounded-lg hover:bg-gray-100group'
                            to='/adminUsers'
                            // onClick={() => handleClick("Adminusers")}
                          >
                            <span className='flex-1 ms-3 whitespace-nowrap'>
                              Admin User
                            </span>
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
export default Navbar;
