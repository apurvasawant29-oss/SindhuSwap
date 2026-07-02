import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={2400} theme="colored" />
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
