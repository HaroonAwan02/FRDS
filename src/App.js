/*import { Navigate, Route, Routes } from "react-router-dom";
import './App.css';
import ViewDonation from "./components/viewDonation.js";
import AdminDashboard from "./pages/admin/AdminDashboard.js";
import AnalyticsDashboard from "./pages/admin/Analyticsdashboard.js";
import Home from "./pages/auth/Home.js";
import Login from "./pages/auth/Login.js";
import Register from "./pages/auth/Register.js";
import { default as AddDonation } from "./pages/donor/AddDonation.js";
import DonorDashboard from "./pages/donor/DonorDashboard.js";
import RequestFood from "./pages/needy/RequestFood.js";
import NGODashboard from "./pages/ngo/NGODashboard.js";
import Rating from "./pages/ngo/Rating.js";
import VolunteersList from "./pages/Volunteer/VolunteerList.js";
const App=()=>{
  return(
      <Routes>
        <Route path="/ngo/dashboard" element={<NGODashboard/>}/>
        <Route path="/donor" element={<DonorDashboard/>}/>
        <Route path="/" element={<Navigate to ="/Register"/>}/>
        <Route path ="login" element={<Login/>}/>
        <Route path="register" element={<Register/>}/>
        <Route path="*" element={<Navigate to="/login"/>}/>
        <Route path="/needy" element={<RequestFood/>}/>
        <Route path="/Volunteer" element={<VolunteersList/>}/>
        <Route path="/admin" element={<AdminDashboard/>}/>
        <Route path="/Analyticsdashboard" element={<AnalyticsDashboard/>}/>
        <Route path="/components/ViewDonation" element={<ViewDonation/>}/>
        <Route path="Rating" element={<Rating/>}/>
        <Route path="Home" element={<Home/>}/>
        <Route path="/donor/AddDonation" element={<AddDonation/>}/>
      </Routes>
  );
};
export default App;*/
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
      <Route path="/" element={<Navigate to="/register" />} />
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
       <Route path="/forgot-password" element={<ForgotPassword/>}/>
       <Route path="/reset-password/:token" element={<ResetPassword/>}/>
      <Route path="/Analyticsdashboard" element={<AnalyticsDashboard/>}/>
      <Route path="/admin" element={<AdminDashboard/>}/>
      {/* Admin Routes */}
     
      


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
          <ProtectedRoute role="ngo">
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
          <ProtectedRoute role="admin">
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

