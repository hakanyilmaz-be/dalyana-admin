import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import CreateDevisCommande from "../pages/CreateDevisCommande";
import Stock from "../pages/Stock";
import Projets from "../pages/Projets";
import Clients from "../pages/Clients";
import ProjetEditPage from "../pages/ProjetEditPage";
import Login from "../components/Login";
import PrivateRoute from "../components/PrivateRoute";
import RoleBasedRoute from "../components/RoleBasedRoute";
import AdminPanel from "../components/AdminPanel";

const CustomRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route index element={<PrivateRoute><AdminTemplate><Clients /></AdminTemplate></PrivateRoute>} />
        <Route path="projets">
        
          <Route index element={<PrivateRoute><AdminTemplate><Projets /></AdminTemplate></PrivateRoute>}/>
          <Route path="creer-devis-commande" element={<PrivateRoute><AdminTemplate><CreateDevisCommande /></AdminTemplate></PrivateRoute>} />
          <Route path="edit" element={<PrivateRoute><AdminTemplate><ProjetEditPage /></AdminTemplate></PrivateRoute>} />
          <Route path=":projetId" element={<PrivateRoute><AdminTemplate><ProjetEditPage /></AdminTemplate></PrivateRoute>} />
        </Route>
        <Route path="clients">
        <Route index element={<PrivateRoute><AdminTemplate><Clients /></AdminTemplate></PrivateRoute>}/>
        <Route path=":clientId" element={<PrivateRoute><AdminTemplate><ClientsEditPage/></AdminTemplate></PrivateRoute>}/>
        </Route>
        <Route path="elements-produits" element={<PrivateRoute><AdminTemplate><ElementsProduits /></AdminTemplate></PrivateRoute>} />
        <Route path="stock" element={<PrivateRoute><AdminTemplate><Stock /></AdminTemplate></PrivateRoute>} />
        <Route path="factures" >
        <Route index element={<RoleBasedRoute allowedRoles={['admin']}><AdminTemplate><Factures /></AdminTemplate></RoleBasedRoute>}/>
          <Route path="new" element={<RoleBasedRoute allowedRoles={['admin']}><AdminTemplate><CreateInvoice /></AdminTemplate></RoleBasedRoute>} />
          <Route path=":factureId" element={<RoleBasedRoute allowedRoles={['admin']}><AdminTemplate><InvoiceEditPage /></AdminTemplate></RoleBasedRoute>} />
        </Route>
        <Route path="employees" >
        <Route index element={<PrivateRoute><AdminTemplate><Employees /></AdminTemplate></PrivateRoute>}/>
          <Route path=":employeeId" element={<PrivateRoute><AdminTemplate><EmployeeEditPage /></AdminTemplate></PrivateRoute>} />
        </Route>
        <Route path="calendrier" element={<PrivateRoute><AdminTemplate><Calendrier /></AdminTemplate></PrivateRoute>} />
        <Route path="missions" element={<PrivateRoute><AdminTemplate><Missions /></AdminTemplate></PrivateRoute>} />
        <Route path="statistiques" element={<RoleBasedRoute allowedRoles={['admin']}><AdminTemplate><Statistiques /></AdminTemplate></RoleBasedRoute>} />
        <Route path="admin-panel" element={<RoleBasedRoute allowedRoles={['admin']}><AdminTemplate><AdminPanel /></AdminTemplate></RoleBasedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default CustomRoutes;

