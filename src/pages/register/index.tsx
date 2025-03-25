import { Input } from "../../components/input";
import { useState, FormEvent } from "react";
import { auth } from '../../services/firebaseConections';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from "react-router-dom";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (email === "" || password === "") {
        alert("Preencha tudo corretamente");
        setLoading(false);
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Usuário registrado com sucesso");
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
            Crie sua conta
            <span className="bg-gradient-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent">
              {" "}
              Agora!
            </span>
          </h1>
        </Link>

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
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>
    </div>
  );
}
