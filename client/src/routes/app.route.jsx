import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Home from "../pages/Home.jsx";
import SignUp from "../pages/SignUp.jsx";
import SignIn from "../pages/SignIn.jsx";
import ProtectedRoute from "../pages/ProtectedRoute/ProtectedRoute.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import UploadForm from "../pages/Dashboard/UploadForm.jsx";
import Results from "../pages/Dashboard/Results.jsx";
import Account from "../pages/Dashboard/Account.jsx";
import History from "../pages/Dashboard/History.jsx";
import HistoryDetail from "../pages/Dashboard/HistoryDetail.jsx";
import RootLayout from "../pages/RootLayout.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route element={<Dashboard />}>
            <Route index element={<UploadForm />} />
            <Route path="results" element={<Results />} />
            <Route path="account" element={<Account />} />
            <Route path="history" element={<History />} />
            <Route path="history-details" element={<HistoryDetail />} />
          </Route>
        </Route>
      </Route>
    </>,
  ),
);

export default router;
