import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={2400} theme="colored" />
    </AuthProvider>
  );
}

export default App;
