import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from 'firebase/auth';
import logo from "../../assets/img/logo-dalyana.png";
import "./side-bar.css";
import {
  RiLogoutCircleRLine,
  RiDashboardLine,
} from "react-icons/ri";
import { AiOutlineCalendar, AiFillEdit, AiFillFolderOpen } from 'react-icons/ai';
import { IoMdContacts } from 'react-icons/io';
import { BsKanban, BsBarChartFill, BsBoxSeamFill } from 'react-icons/bs';
import { FaNetworkWired } from "react-icons/fa";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { useAuth } from '../../../src/context/AuthContext';
import { auth } from '../../firebase';  // Firebase auth importu

const SideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { userRole } = useAuth(); // AuthContext'ten userRole'u alın

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Kullanıcı çıkış yaptıktan sonra login sayfasına yönlendirme
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <Navbar expand="lg" className="admin-navbar" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img alt="logo" src={logo} className="img-fluid " />
        </Navbar.Brand>
        <Dropdown.Divider />
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="navbar-menu" id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className={currentPath === "/" ? "active" : ""}>
              <IoMdContacts /> Clients
            </Nav.Link>
            
            <Nav.Link as={Link} to="/projets" className={currentPath === "/projets" ? "active" : ""}>
              <AiFillFolderOpen /> Projets
            </Nav.Link>

            <Nav.Link as={Link} to="/elements-produits" className={currentPath === "/elements-produits" ? "active" : ""}>
              <RiDashboardLine /> Elements&Produits
            </Nav.Link>
            <Nav.Link as={Link} to="/stock" className={currentPath === "/stock" ? "active" : ""}>
              <BsBoxSeamFill /> Stock
            </Nav.Link>

            {/* userRole 'admin' ise Factures linkini göster */}
            {userRole === 'admin' && (
              <Nav.Link as={Link} to="/factures" className={currentPath === "/factures" ? "active" : ""}>
                <AiFillEdit /> Factures
              </Nav.Link>
            )}

            <Nav.Link as={Link} to="/employees" className={currentPath === "/employees" ? "active" : ""}>
              <FaNetworkWired /> Employees
            </Nav.Link>
            <Nav.Link as={Link} to="/calendrier" className={currentPath === "/calendrier" ? "active" : ""}>
              <AiOutlineCalendar /> Calendrier
            </Nav.Link>
            <Nav.Link as={Link} to="/missions" className={currentPath === "/missions" ? "active" : ""}>
              <BsKanban /> Missions
            </Nav.Link>

            {/* userRole 'admin' ise Statistiques linkini göster */}
            {userRole === 'admin' && (
              <Nav.Link as={Link} to="/statistiques" className={currentPath === "/statistiques" ? "active" : ""}>
                <BsBarChartFill /> Statistiques
              </Nav.Link>
            )}

            <Nav.Link onClick={handleLogout}>
              <RiLogoutCircleRLine /> Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default SideBar;
