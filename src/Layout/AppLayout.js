import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../common/component/Sidebar";
import Navbar from "../common/component/Navbar";
import ToastMessage from "../common/component/ToastMessage";
import { loginWithToken } from "../features/user/userSlice";
import { getCartQty } from "../features/cart/cartSlice";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useRef(null);

  useEffect(() => {
    dispatch(loginWithToken());
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(getCartQty());
    }
  }, [user]);

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Navbar 높이 동적으로 설정
  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, [navbarRef.current]);

  return (
    <div>
      <ToastMessage />
      {location.pathname.includes("admin") ? (
        <Row className="vh-100">
          <Col xs={12} md={3} className="sidebar mobile-sidebar">
            <Sidebar />
          </Col>
          <Col xs={12} md={9}>
            {children}
          </Col>
        </Row>
      ) : (
        <>
          {/* Navbar에 ref 추가 */}
          <div
            ref={navbarRef}
            className={`navbar-container ${showNavbar ? "visible" : "hidden"}`}
          >
            <Navbar user={user} />
          </div>
          {/* Navbar 높이만큼 padding-top 적용 */}
          <div
            className="content-with-navbar"
            style={{ paddingTop: navbarHeight + 20 }}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
};

export default AppLayout;
