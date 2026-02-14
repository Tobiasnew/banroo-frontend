import { Routes, Route } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="app" element={<Dashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;
