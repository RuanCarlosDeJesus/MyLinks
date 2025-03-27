import { Input } from "../../components/input";
import { useState, FormEvent } from "react";
import { auth, db } from "../../services/firebaseConections";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

export function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // Novo campo para username
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (email === "" || password === "" || username === "") {
      alert("Preencha todos os campos corretamente");
      setLoading(false);
      return;
    }

    try {
      // Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Atualiza o displayName com o username informado
      await updateProfile(user, { displayName: username });
      
      // Cria um documento na coleção "users" usando o username como ID
      await setDoc(doc(db, "users", username), {
        uid: user.uid,
        nome: username,
        email,
        bio: "",
        foto: "",
        links: []  // Inicia com links vazios
      });
      
      console.log('Usuário criado com sucesso:', user);
      navigate("/login", { replace: true });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full h-screen items-center justify-center flex-col">
      <form className="w-full max-w-xl flex flex-col m-1" onSubmit={handleRegister}>
        <Link to="/">
          <h1 className="mt-11 text-amber-50 text-5xl font-bold uppercase">
            Crie su<span className="bg-gradient-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent">a conta</span>
          </h1>
        </Link>

        {/* Novo input para username */}
        <Input
          placeholder="Digite seu username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          placeholder="Digite seu email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="*********"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Exibindo erro, se houver */}
        {error && <p className="text-red-500">{error}</p>}

        <button
          disabled={loading}
          className="h-9 bg-blue-600 rounded border-0 font-medium m-2 text-white cursor-pointer"
          type="submit"
        >
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
}
