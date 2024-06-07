import CustomRoutes from "./router/custom-routes";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CustomRoutes />
      <ToastContainer
        position="top-center"
        autoClose={6500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
}

export default App;
