import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo-dalyana.png"
import "./side-bar.css";
import {
  RiHome3Line,
  RiLogoutCircleRLine,
  RiDashboardLine,
  RiContactsLine
} from "react-icons/ri";
import { AiOutlineCalendar, AiFillEdit, AiFillFolderOpen, AiFillHome } from 'react-icons/ai';
import { IoMdContacts } from 'react-icons/io';
import { BsKanban, BsBarChartFill } from 'react-icons/bs';


/* import { useStore } from "../../../store";
import alertify from "alertifyjs";
import { logout } from "../../../store/user/userActions"; */
import { Container, Nav, Navbar } from "react-bootstrap";

const SideBar = () => {
  /* const { userState, dispatchUser } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    alertify.confirm(
      "Logout",
      "Are you sure want to logout?",
      () => {
        dispatchUser(logout());
        localStorage.removeItem("token");
        navigate("/");
      },
      () => {
        console.log("canceled");
      }
    );
  };
 */
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Navbar expand="lg" className="admin-navbar" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/admin">
          <img src={logo} className="img-fluid " />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="navbar-menu" id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin" className={currentPath === "/" ? "active" : ""}>
              <AiFillHome /> Accueil
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/devis-commandes" className={currentPath === "/admin/devis-commandes" ? "active" : ""}>
              <AiFillFolderOpen /> Devis&Commandes
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/clients" className={currentPath === "/admin/clients" ? "active" : ""}>
              <RiContactsLine /> Clients
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/elements-produits" className={currentPath === "/admin/elements-produits" ? "active" : ""}>
              <RiDashboardLine /> Elements&Produits
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/factures" className={currentPath === "/admin/factures" ? "active" : ""}>
              <AiFillEdit /> Factures
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/employees" className={currentPath === "/admin/employees" ? "active" : ""}>
              <IoMdContacts /> Employees
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/calender" className={currentPath === "/admin/calender" ? "active" : ""}>
              <AiOutlineCalendar /> Calendar
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/missions" className={currentPath === "/admin/missions" ? "active" : ""}>
              <BsKanban /> Missions
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/statistiques" className={currentPath === "/admin/statistiques" ? "active" : ""}>
              <BsBarChartFill /> Statistiques
            </Nav.Link>
            {/* <Nav.Link onClick={handleLogout}> ALTTAKI YOKTU, SADECE HATA VERMEMESI ICIN BUNUN YERINE KOYDUM ,BIR ALTTAKI SILINECEK */}
            <Nav.Link >
              <RiLogoutCircleRLine /> Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default SideBar;
