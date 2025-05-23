import { Link, useParams } from "react-router-dom";
import { auth } from "../../services/firebaseConections"; 
import { signOut } from "firebase/auth";
import { BiLogOut } from "react-icons/bi"; 

export function Header() {
  const { username } = useParams(); 

  async function handleGetLogout() {
    await signOut(auth);
  }

  return (
    <header className="w-full max-w-2xl">
      <nav className="w-full bg-white h-12 flex items-center justify-between rounded-md-3 mt-4 px-1 rounded-3xl">
        <div className="flex gap-4 font-medium px-3">
        <Link
  className="px-2 cursor-pointer transform transition duration-300 ease-in-out hover:scale-125"
  to="/links">Home</Link>
          <Link
            className="px-2 cursor-pointer transform transition duration-300 ease-in-out hover:scale-125"
            to={`/admin/${username}`}>Links</Link> 
          <Link
            className="px-2 cursor-pointer transform transition duration-300 ease-in-out hover:scale-125"
            to="/networks">Rede sociais</Link>
        </div>
        <button
          className="px-2 cursor-pointer transform transition duration-300 ease-in-out hover:scale-125"
          onClick={handleGetLogout}>
          <BiLogOut size={28} color="#db2628" />
        </button>
      </nav>
    </header>
  );
}
