import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAgjfm1IJY7E8D2vOTkdJ3xTFmiaZz6rCg",
  authDomain: "mylinks-b9b0e.firebaseapp.com",
  projectId: "mylinks-b9b0e",
  storageBucket: "mylinks-b9b0e.firebasestorage.app",
  messagingSenderId: "138384945481",
  appId: "1:138384945481:web:03cc15acfd867065eeaa98",
  measurementId: "G-S4J63WNKKT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 
const analytics = getAnalytics(app);


export { auth, db, analytics };

// Função para criar o usuário
export const createUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Usuário criado com sucesso:", user);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
};
