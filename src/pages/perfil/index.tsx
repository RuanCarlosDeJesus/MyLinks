import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Error } from "../error";

export function Perfil() {
  const { username } = useParams(); // Captura o username da URL
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    async function fetchUser() {
      if (!username) return;
      const userRef = doc(db, "users", username);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      } else {
        setUserData(null);
      }
      setLoading(false);
    }
    fetchUser();
  }, [username, db]);

  if (loading) return <p>Carregando...</p>;
  if (!userData) return <Error />;

  return (
    <div>
      <h1>{userData.nome}</h1>
      <p>{userData.bio}</p>
      <img src={userData.foto || "/default-avatar.png"} alt="Foto de perfil" />
      <ul>
        {userData.links?.map((link: any, index: number) => (
          <li key={index}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.nome}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
