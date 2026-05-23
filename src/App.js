
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import ProtectedRoute from "./components/ProtectedRoute.js";

import ViewDonation from "./components/viewDonation.js";
import AdminDashboard from "./pages/admin/AdminDashboard.js";
import AnalyticsDashboard from "./pages/admin/Analyticsdashboard.js";
import ForgotPassword from "./pages/auth/ForgotPassowrd.js";
import Home from "./pages/auth/Home.js";
import Login from "./pages/auth/Login.js";
import Register from "./pages/auth/Register.js";
import ResetPassword from "./pages/auth/ResetPassword.js";
import AddDonation from "./pages/donor/AddDonation.js";
import DonorDashboard from "./pages/donor/DonorDashboard.js";
import RequestFood from "./pages/needy/RequestFood.js";
import NGODashboard from "./pages/ngo/NGODashboard.js";
import Rating from "./pages/ngo/Rating.js";
import VolunteersList from "./pages/Volunteer/VolunteerList.js";
const App = () => {
  
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/home" />} />
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
       <Route path="/forgot-password" element={<ForgotPassword/>}/>
       <Route path="/reset-password/:token" element={<ResetPassword/>}/>
      <Route path="/Analyticsdashboard" element={<AnalyticsDashboard/>}/>
      
      {/* Admin Routes */}
     <Route
      path="/admin" element={
      <ProtectedRoute role="admin">
        <AdminDashboard/>
      </ProtectedRoute>
     }
      />
      {/* NGO Routes */}
      <Route
        path="/ngo/dashboard"
        element={
          <ProtectedRoute role="ngo">
            <NGODashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ngo/rating"
        element={
          <ProtectedRoute role="ngo">
            <Rating />
          </ProtectedRoute>
        }
      />

      <Route
        path="/components/viewDonation"
        element={
          <ProtectedRoute role={["ngo","donor","admin"]}>
            <ViewDonation />
          </ProtectedRoute>
        }
      />
      {/* Donor Routes */}
      <Route
        path="/donor/dashboard"
        element={
          <ProtectedRoute role="donor">
            <DonorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/donor/AddDonation"
        element={
          <ProtectedRoute role="donor">
            <AddDonation />
          </ProtectedRoute>
        }
      />

      {/* Needy Routes */}
      <Route
        path="/needy/RequestFood"
        element={
          <ProtectedRoute role="needy">
            <RequestFood />
          </ProtectedRoute>
        }
      />

      {/* Volunteer */}
      <Route
        path="/volunteer/VolunteerList"
        element={
          <ProtectedRoute role="volunteer">
            <VolunteersList />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
};

export default App;

