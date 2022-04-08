import { createContext, useState, useCallback } from "react";
import firebaseInstance from "../services/firebase";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const signIn = useCallback(async (email, password) => {
    const response = await firebaseInstance.signIn(email, password)
    const { user } = response

    if(user) {
      setUsuario(user);

      console.log({user})
      localStorage.setItem("usuarioToken", user._delegate.accessToken);
      localStorage.setItem("usuarioID", user._delegate.uid);
      return user;
    } else {
      throw new Error('Error')
    }

    
  }, []);

  const signOut = useCallback(() => {
    firebaseInstance.signOut();
  }, []);

  return (
    <AuthContext.Provider
      value={{ signIn, usuario, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
