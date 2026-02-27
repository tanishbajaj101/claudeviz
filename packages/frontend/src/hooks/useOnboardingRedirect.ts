import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export function useOnboardingRedirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (loading) return;

    // If user is new and not on onboarding page, redirect to onboarding
    if (user?.isNewUser && pathname !== "/onboarding") {
      navigate("/onboarding");
    }

    // If user is NOT new and on onboarding page, redirect to home
    if (user?.isNewUser === false && pathname === "/onboarding") {
      navigate("/");
    }
  }, [user?.isNewUser, pathname, navigate, loading]);
}
