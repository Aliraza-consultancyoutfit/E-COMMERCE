"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { setCredentials, setInitialized } from "@/store/auth/auth.slice";
import { decodeUser, getToken } from "@/utils/auth-token";

/** Reads the auth cookie once on the client and seeds the auth slice. */
function AuthHydrator({ children }: { children: ReactNode }) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) {
      return;
    }
    hydrated.current = true;

    const token = getToken();
    const user = decodeUser(token);

    if (token && user) {
      store.dispatch(setCredentials({ user, token }));
    } else {
      store.dispatch(setInitialized());
    }
  }, []);

  return <>{children}</>;
}

export default function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthHydrator>{children}</AuthHydrator>
    </Provider>
  );
}
