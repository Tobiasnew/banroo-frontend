import { Routes, Route } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Match from "./pages/Match.jsx";
import MatchResult from "./pages/MatchResult.jsx";
import RooDetail from "./pages/RooDetail.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="match" element={<Match />} />
        <Route path="match/result" element={<MatchResult />} />
        <Route
          path="app"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="roo/:id"
          element={
            <ProtectedRoute>
              <RooDetail />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;