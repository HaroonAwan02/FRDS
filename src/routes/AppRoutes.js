import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import DonorDashboard from "../pages/donor/DonorDashboard";
const AppRoutes=()=>(
        <Routes>
            <Route path="/donor" element={
                <ProtectedRoute role="donor">
                    <DonorDashboard/>
                    </ProtectedRoute>
            }
            />
                 
        </Routes>
    );

export default AppRoutes;