"use client";
import { getUserSession } from "@/lib/utils/auth";
import { getUserData } from "@/lib/utils/data";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type UserSessionType = {
  accessToken: string;
  userID: string;
  twitterAvatarURL: any;
  twitterEmail: any;
  twitterName: any;
  twitterHandle: any;
  twitterID: any;
};
type AuthContextType = {
  authLoading: boolean;
  userData: UserDataType | null;
  userSession: UserSessionType | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [userSession, setUserSession] = useState<UserSessionType | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  async function initializeUser() {
    const session = await getUserSession();
    if (session) {
      const userData = await getUserData(session.userID);
      if (userData) {
        setUserData(userData);
      }
      setUserSession(session);
    }
    setAuthLoading(false);
  }

  useEffect(() => {
    initializeUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("auth state changed!");
      if (!userSession && session) {
        setAuthLoading(true);
      }
      if (session?.user?.user_metadata) {
        initializeUser();
        // const { user_metadata: meta } = session.user;

        // const sessionData = {
        //   accessToken: session.access_token,
        //   userID: session.user.id,
        //   twitterAvatarURL: meta.avatar_url,
        //   twitterEmail: meta.email,
        //   twitterName: meta.full_name,
        //   twitterHandle: meta.preferred_username,
        //   twitterID: meta.provider_id,
        // };
        // setUserSession(sessionData);
      } else {
        setUserSession(null);
        setUserData(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ userData, userSession, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Auth context must be consumed within its provider");
  }
  return context;
}
