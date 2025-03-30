import { ReactNode, useState, useEffect } from "react";
import { auth } from "../services/firebaseConections";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

interface PrivateProps {
  children: ReactNode;
}

export function Private({ children }: PrivateProps) {
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
        };
        localStorage.setItem("mylinks", JSON.stringify(userData));
        setLoading(false);
        setSigned(true);
      } else {
        setLoading(false);
        setSigned(false);
      }
    });

    // Limpeza do onAuthStateChanged
    return () => unsubscribe(); // Chama o unsubscribe para limpar o ouvinte
  }, []);

  // Se ainda está carregando, retorna uma tela em branco ou um spinner
  if (loading) {
    return <div>Carregando...</div>; // Pode adicionar um spinner ou mensagem de carregamento
  }

  // Se não estiver autenticado, redireciona para a página de login
  if (!signed) {
    return <Navigate to="/login" />; // Altere para a página de login ou uma página de erro
  }

  return <>{children}</>;
}
