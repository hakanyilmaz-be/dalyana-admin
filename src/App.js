import CustomRoutes from "./router/custom-routes";
import { ToastContainer } from "react-toastify";



function App() {
  return (
    <>
          <CustomRoutes/>
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
    </>
  );
}

export default App;
