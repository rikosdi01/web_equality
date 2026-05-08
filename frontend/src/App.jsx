import "./App.css";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import SignIn from "./pages/authentication/signin/SignIn";
import SidebarPages from "./components/sidebar/SidebarPages";
import Navbar from "./components/navbar/Navbar";
import NotFound from "./pages/features/notfound/NotFound";
import { ToastProvider } from "./context/ToastContext";
import Settings from "./pages/personalization/settings/Settings";
import ProtectedRoute from "./components/protectedroute/ProtectedRoute";
import EqualityProducts from "./pages/features/equality_products/EqualityProducts";
import { EqualityProductsProvider } from "./context/EqualityProductsContext";
import Recent from "./pages/features/recent/Recent";
import AddEquality from "./pages/features/equality_products/components/add_equality/AddEquality";
import { HistoryEqualityProvider } from "./context/HistoryEqualityContext";
import DetailsEquality from "./pages/features/equality_products/components/details_equality/DetailsEquality";
import { useEffect } from "react";
import { auth } from "./firebase";
import SalesProducts from "./pages/features/sales_products/SalesProducts";
import Items from "./pages/features/items/Items";
import AddItem from "./pages/features/items/components/add_item/AddItem";
import DetailsItem from "./pages/features/items/components/details_item/DetailsItem";

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    const getToken = async () => {
      const user = auth.currentUser;
      if (user) {
        const idToken = await user.getIdToken();
        console.log("Firebase ID Token:", idToken);

        // Kirim ke backend misalnya:
        // await axios.post("/auth/login", { idToken });
      }
    };

    getToken();
  }, []);

  // Daftar halaman yang tidak menampilkan sidebar
  const hideSidebarRoutes = ["/signin", "/signup", "/404"];

  return (
    <div className="app-container">
      {!hideSidebarRoutes.includes(location.pathname) && <SidebarPages />}
      {!hideSidebarRoutes.includes(location.pathname) && <Navbar />}

      <div className="main-content">
        <Routes>
          {/* Authentication */}
          <Route path="/signin" element={<SignIn />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Recent */}
          <Route path="/recents" element={<ProtectedRoute><Recent /></ProtectedRoute>} />

          {/* Equality Products */}
          <Route path="/equality-products" element={<ProtectedRoute><EqualityProducts /></ProtectedRoute>} />
          <Route path="/equality-products/new" element={<ProtectedRoute><AddEquality /></ProtectedRoute>} />
          <Route path="/equality-products/:id" element={<ProtectedRoute><DetailsEquality /></ProtectedRoute>} />

          
          {/* Items */}
          <Route path="/items" element={<ProtectedRoute><Items /></ProtectedRoute>} />
          <Route path="/items/new" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
          <Route path="/items/:id" element={<ProtectedRoute><DetailsItem /></ProtectedRoute>} />

          
          {/* Recent */}
          <Route path="/sales-products" element={<ProtectedRoute><SalesProducts /></ProtectedRoute>} />

          {/* Not Found Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <EqualityProductsProvider>
        <HistoryEqualityProvider>
          <Router>
            <AppContent />
          </Router>
        </HistoryEqualityProvider>
      </EqualityProductsProvider>
    </ToastProvider>
  );
}

export default App;