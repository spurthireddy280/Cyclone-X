import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USER = {
  name: "Operator Chief",
  email: "demo@cyclonex.ai",
  role: "Disaster Operations Specialist",
  organization: "National Emergency Management Agency",
  avatar: "OC"
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cyclonex_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [onboardingCompleted, setOnboardingCompletedState] = useState(() => {
    return localStorage.getItem('cyclonex_onboarding') === 'true';
  });

  const isAuthenticated = !!user;

  const login = async (email, password) => {
    // Demo validation
    if (!email || !password) {
      throw new Error("Please enter both email and password.");
    }

    if (email === "demo@cyclonex.ai" && password === "demo123") {
      const authUser = { ...DEMO_USER };
      setUser(authUser);
      localStorage.setItem('cyclonex_user', JSON.stringify(authUser));
      return authUser;
    }

    // Allow custom login for testing/demo
    if (password.length >= 6) {
      const customUser = {
        name: email.split('@')[0].toUpperCase(),
        email,
        role: "Field Coordinator",
        organization: "Emergency Operations Hub",
        avatar: email.substring(0, 2).toUpperCase()
      };
      setUser(customUser);
      localStorage.setItem('cyclonex_user', JSON.stringify(customUser));
      return customUser;
    }

    throw new Error("Invalid credentials. Use demo@cyclonex.ai / demo123 or a password with at least 6 characters.");
  };

  const signup = async ({ name, organization, email, password }) => {
    if (!name || !organization || !email || !password) {
      throw new Error("All fields are required.");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    const newUser = {
      name,
      email,
      organization,
      role: "Incident Commander",
      avatar: name.substring(0, 2).toUpperCase()
    };
    setUser(newUser);
    localStorage.setItem('cyclonex_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cyclonex_user');
  };

  const setOnboardingCompleted = (val) => {
    setOnboardingCompletedState(val);
    localStorage.setItem('cyclonex_onboarding', val ? 'true' : 'false');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      signup,
      logout,
      onboardingCompleted,
      setOnboardingCompleted
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
