import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

/* import AdminReservationEditPage from "../pages/admins/AdminReservationEditPage";
import AdminReservationsPage from "../pages/admins/AdminReservationsPage";
import AdminUsersEditPage from "../pages/admins/AdminUsersEditPage";
import AdminUsersNewPage from "../pages/admins/AdminUsersNewPage";
import AdminUsersPage from "../pages/admins/AdminUsersPage";
import AdminVehicleEditPage from "../pages/admins/AdminVehicleEditPage";
import AdminVehiclesNewPage from "../pages/admins/AdminVehiclesNewPage";
import AdminVehiclesPage from "../pages/admins/AdminVehiclesPage";
import NotFoundPage from "../pages/common/NotFoundPage";
import UnAuthorizedPage from "../pages/common/UnAuthorizedPage";
import AboutPage from "../pages/users/AboutPage";
import AuthPage from "../pages/users/AuthPage";
import ContactPage from "../pages/users/ContactPage";
import HomePage from "../pages/users/HomePage";
import ProfilePage from "../pages/users/ProfilePage";
import UserReservationDetailsPage from "../pages/users/UserReservationDetailsPage";
import UserReservationsPage from "../pages/users/UserReservationsPage";
import VehicleDetailsPage from "../pages/users/VehicleDetailsPage";
import VehiclesPage from "../pages/users/VehiclesPage";
import UserTemplate from "../templates/user-template";
import ProtectedRoute from "./protected-route"; */

import AdminTemplate from "../template/admin-template";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import ElementsProduits from "../pages/ElementsProduits";
import Factures from "../pages/Factures";
import Employees from "../pages/Employees"; 
import Calendrier from "../pages/Calendrier";
import Missions from "../pages/Missions";
import Statistiques from "../pages/Statistiques";
import ClientsEditPage from "../pages/ClientsEditPage";
import EmployeeEditPage from "../pages/EmployeeEditPage";
import CreateInvoice from "../pages/CreateInvoice";
import InvoiceEditPage from "../pages/InvoiceEditPage";
import CreateCustomer from "../pages/CreateCustomer";
import CreateDevisCommande from "../pages/CreateDevisCommande";
import Stock from "../pages/Stock";
import DevisEditPage from "../pages/DevisEditPage";
import Projets from "../pages/Projets";
import Clients from "../pages/Clients";
import Uygulama from "../components/create-new-devis-commande/uygulama";


const CustomRoutes = () => {
  return (
    <BrowserRouter>       
      <Routes>
        <Route path="/">

          {/* ADMIN ROUTES */}
         {/*  <Route path="admin">
            <Route index element={<ProtectedRoute isAdmin={true}><AdminTemplate><AdminDashboardPage/></AdminTemplate></ProtectedRoute>}/>
            <Route path="users">
              <Route index element={<ProtectedRoute isAdmin={true}><AdminTemplate><AdminUsersPage/></AdminTemplate></ProtectedRoute>}/>
              <Route path=":userId" element={<ProtectedRoute isAdmin={true}><AdminTemplate><AdminUsersEditPage/></AdminTemplate></ProtectedRoute>}/>
              <Route path="new" element={<ProtectedRoute isAdmin={true}><AdminTemplate><AdminUsersNewPage/></AdminTemplate></ProtectedRoute>}/>
            </Route>
            <Route path="vehicles">
              <Route index element={<ProtectedRoute isAdmin={true}><AdminTemplate><AdminVehiclesPage/></AdminTemplate></ProtectedRoute>}/>
              <Route path=":vehicleId" element={<ProtectedRoute isAdmin={true}><AdminTemplate><AdminVehicleEditPage/></AdminTemplate></ProtectedRoute>}/>
              <Route path="new" element={<ProtectedRoute isAdmin={true}><AdminTemplate><AdminVehiclesNewPage/></AdminTemplate></ProtectedRoute>}/>
            </Route>
            <Route path="reservations">
              <Route index element={<ProtectedRoute isAdmin={true}><AdminTemplate><AdminReservationsPage/></AdminTemplate></ProtectedRoute>}/>
              <Route path=":reservationId" element={<ProtectedRoute isAdmin={true}><AdminTemplate><AdminReservationEditPage/></AdminTemplate></ProtectedRoute>}/>
            </Route>
          </Route> */}


          {/* USER ROUTES */}
          
          <Route index element={<AdminTemplate><AdminDashboardPage /></AdminTemplate>} />
         
            <Route path="projets">
              <Route index element={<AdminTemplate><Projets /></AdminTemplate>}/>
              <Route path="creer-devis-commande" element={<AdminTemplate><CreateDevisCommande/></AdminTemplate>}/>
              <Route path="uygulama" element={<AdminTemplate><Uygulama/></AdminTemplate>}/>

              <Route path=":devisId" element={<AdminTemplate> <DevisEditPage /></AdminTemplate>}/>
            </Route>

            <Route path="clients">
              <Route index element={<AdminTemplate><Clients/></AdminTemplate>}/>
              <Route path="creer-client" element={<AdminTemplate><CreateCustomer/></AdminTemplate>}/>
              <Route path=":clientId" element={<AdminTemplate><ClientsEditPage/></AdminTemplate>}/>
            </Route>

          <Route path="elements-produits" element={<AdminTemplate><ElementsProduits /></AdminTemplate>} />
          <Route path="stock" element={<AdminTemplate><Stock /></AdminTemplate>} />
          

          <Route path="factures"> 
            <Route index element={<AdminTemplate><Factures /></AdminTemplate>} />
            <Route path="new" element={<AdminTemplate><CreateInvoice/></AdminTemplate>}/>
            <Route path=":factureId" element={<AdminTemplate><InvoiceEditPage/></AdminTemplate>}/>

            </Route> 
         
          <Route path="employees">
              <Route index element={<AdminTemplate><Employees /></AdminTemplate>}/>
              <Route path=":employeeId" element={<AdminTemplate><EmployeeEditPage/></AdminTemplate>}/>
          </Route> 
          <Route path="calendrier" element={<AdminTemplate><Calendrier /></AdminTemplate>} />
          <Route path="missions" element={<AdminTemplate><Missions /></AdminTemplate>} />
          <Route path="statistiques" element={<AdminTemplate><Statistiques /></AdminTemplate>} />


         {/*  <Route path="about" element={<UserTemplate><AboutPage /></UserTemplate>} />
          <Route path="contact" element={<UserTemplate><ContactPage /></UserTemplate>} />
          <Route path="auth" element={<AuthPage />} />

          <Route path="vehicles">
            <Route index element={<UserTemplate><VehiclesPage /></UserTemplate>} />
            <Route path=":vehicleId" element={<UserTemplate><VehicleDetailsPage /></UserTemplate>} />
          </Route>

          <Route path="user">
            <Route index element={<ProtectedRoute><UserTemplate><ProfilePage /></UserTemplate></ProtectedRoute>} />
            <Route path="reservations">
              <Route index element={<ProtectedRoute><UserTemplate><UserReservationsPage/></UserTemplate></ProtectedRoute>} />
              <Route path=":reservationId" element={<ProtectedRoute><UserTemplate><UserReservationDetailsPage/></UserTemplate></ProtectedRoute>} />
            </Route>
          </Route>

          <Route path='unauthorized' element={<UserTemplate><UnAuthorizedPage /></UserTemplate>} />
          <Route path='*' element={<UserTemplate><NotFoundPage /></UserTemplate>} /> */}

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default CustomRoutes;