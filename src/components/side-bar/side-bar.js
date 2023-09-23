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
import { AiOutlineCalendar, AiFillEdit, AiFillFolderOpen } from 'react-icons/ai';
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
        <Navbar.Brand as={Link} to="/">
          <img src={logo} className="img-fluid " />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="navbar-menu" id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className={currentPath === "/" ? "active" : ""}>
              <RiHome3Line /> Accueil
            </Nav.Link>
            <Nav.Link as={Link} to="/devis-commandes" className={currentPath === "/devis-commandes" ? "active" : ""}>
              <AiFillFolderOpen /> Devis & Commandes
            </Nav.Link>
            <Nav.Link as={Link} to="/clients" className={currentPath === "/clients" ? "active" : ""}>
              <RiContactsLine /> Clients
            </Nav.Link>
            <Nav.Link as={Link} to="/elements-produits" className={currentPath === "/elements-produits" ? "active" : ""}>
              <RiDashboardLine /> Elements & Produits
            </Nav.Link>
            <Nav.Link as={Link} to="/factures" className={currentPath === "/factures" ? "active" : ""}>
              <AiFillEdit /> Factures
            </Nav.Link>
            <Nav.Link as={Link} to="/employees" className={currentPath === "/employees" ? "active" : ""}>
              <IoMdContacts /> Employees
            </Nav.Link>
            <Nav.Link as={Link} to="/calendrier" className={currentPath === "/calendrier" ? "active" : ""}>
              <AiOutlineCalendar /> Calendrier
            </Nav.Link>
            <Nav.Link as={Link} to="/missions" className={currentPath === "/missions" ? "active" : ""}>
              <BsKanban /> Missions
            </Nav.Link>
            <Nav.Link as={Link} to="/statistiques" className={currentPath === "/statistiques" ? "active" : ""}>
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
