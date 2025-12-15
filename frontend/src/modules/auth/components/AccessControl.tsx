import React from "react";
import { useAuthStore } from "@/modules/auth/store/auth.store";

interface AccessControlProps {
  allow: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AccessControl: React.FC<AccessControlProps> = ({
  allow,
  children,
  fallback = null,
}) => {
  const { hasAnyRole } = useAuthStore();

  if (!hasAnyRole(allow)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
