import './App.css'
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import Login from './pages/Auth/login/Login'
import Signup from './pages/Auth/signup/Signup'
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { MainLayout } from './pages/MainLayout/MainLayout';
import ForumClinic from './pages/ForumClinicPage/ForumClinic';
import LostFound from './pages/LostFoundPage/LostFound';
import Feed from './pages/FeedPage/Feed';
import ProfileDetail from './pages/ProFileDetailPage/ProfileDetail';
import RequireAuth from './components/RequireAuth';
import { isAuthenticated } from './utils/auth';

// Component để chặn user đã login vào lại trang Login/Signup
const RedirectIfAuth = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/" replace /> : children;
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <RequireAuth>
          <MainLayout />
        </RequireAuth>
      ), // Bọc RequireAuth ở đây để bảo vệ tất cả children bên dưới
      children: [
        {
          index: true,
          element: <Feed />
        },
        {
          path: "forum&clinic",
          element: <ForumClinic />
        },
        {
          path: "lost&found",
          element: <LostFound />
        },
        {
          path: "profile",
          element: <ProfileDetail />
        }
      ]
    },
    {
      path: "/login",
      element: (
        <RedirectIfAuth>
          <Login />
        </RedirectIfAuth>
      )
    },
    {
      path: "/signup",
      element: (
        <RedirectIfAuth>
          <Signup />
        </RedirectIfAuth>
      )
    },
    {
      path: '*',
      element: <NotFoundPage />
    }
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App