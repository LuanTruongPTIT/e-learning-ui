import { AuthProvider } from "@/context/auth-context";
import React from "react";

//-------------------------------------------------------------------------------------------

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
