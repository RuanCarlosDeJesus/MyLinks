import { useState, useEffect, FormEvent } from "react";
import { Header } from "../../components/header";
import { Input } from '../../components/input';
import { FiTrash } from "react-icons/fi";
import { db, auth } from '../../services/firebaseConections';
import {
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    doc,
    deleteDoc,
    setDoc
} from "firebase/firestore";

interface LinkProps {
    id: string;
    name: string;
    url: string;
    bg: string;
    color: string;
}

export function Admin() {
    const [nameInput, setNameInput] = useState("");
    const [url, setUrl] = useState("");
    const [textColor, setTextColor] = useState("#f1f1f1");
    const [backgroundColor, setBackgroundColor] = useState("#000");
    const [backgroundColorAll, setBackgroundColorAll] = useState("#06066d");
    const [links, setLinks] = useState<LinkProps[]>([]);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const userLinksRef = collection(db, "users", user.uid, "links");
        const queryRef = query(userLinksRef, orderBy("created", "asc"));

        const unsubscribe = onSnapshot(queryRef, (snapshot) => {
            const lista = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })) as LinkProps[];

            setLinks(lista);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const docRef = doc(db, "config", "background");
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            if (snapshot.exists()) {
                setBackgroundColorAll(snapshot.data()?.backgroundColor || "#06066d");
            }
        });
        return () => unsubscribe();
    }, []);

    async function handleRegister(e: FormEvent) {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) {
            alert("Você precisa estar logado para cadastrar um link.");
            return;
        }

        if (!nameInput || !url) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            const userLinksRef = collection(db, "users", user.uid, "links");

            await addDoc(userLinksRef, {
                name: nameInput,
                url: url,
                bg: backgroundColor,
                color: textColor,
                created: new Date()
            });

            setNameInput("");
            setUrl("");
            alert("Link cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar link:", error);
            alert("Erro ao cadastrar link");
        }
    }

    async function handleDeleteLink(id: string) {
        const user = auth.currentUser;
        if (!user) return;

        try {
            await deleteDoc(doc(db, "users", user.uid, "links", id));
        } catch (error) {
            console.error("Erro ao deletar link:", error);
            alert("Erro ao deletar link");
        }
    }

    async function handleSaveBackgroundColor() {
        try {
            await setDoc(doc(db, "config", "background"), {
                backgroundColor: backgroundColorAll,
            });
            alert("Cor de fundo salva com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar cor de fundo:", error);
            alert("Erro ao salvar cor de fundo");
        }
    }

    return (
        <div className="flex items-center h-screen flex-col pb-7 px-2" style={{ background: backgroundColorAll }}>
            <Header />
            <form className="flex flex-col mt-8 mb-3 w-full max-w-xl" onSubmit={handleRegister}>
                <label className="text-white font-medium mt-2 mb-2">Nome do Link</label>
                <Input
                    placeholder="Nome do link"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                />

                <label className="text-white font-medium mt-2 mb-2">Nome da URL</label>
                <Input
                    placeholder="Digite a URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />

                {nameInput !== '' && url !== '' && (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11/12 max-w-xl rounded px-2 py-4 select-none mb-4 text-center font-bold text-lg transition duration-300 hover:scale-105"
                        style={{ backgroundColor: backgroundColor, color: textColor }}
                    >
                        {nameInput}
                    </a>
                )}

                <section className="flex my-4 gap-4 flex-wrap">
                    <div className="flex gap-2 items-center">
                        <label className="text-white font-medium">Cor do texto</label>
                        <input
                            type="color"
                            className="cursor-pointer"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        <label className="text-white font-medium">Fundo do link</label>
                        <input
                            type="color"
                            className="cursor-pointer"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        <label className="text-white font-medium">Fundo da página</label>
                        <input
                            type="color"
                            className="cursor-pointer"
                            value={backgroundColorAll}
                            onChange={(e) => setBackgroundColorAll(e.target.value)}
                        />
                    </div>
                </section>

                <button className="mb-7 bg-blue-600 h-9 rounded-md text-white font-medium">
                    Cadastrar
                </button>
            </form>

            <button
                className="w-full max-w-xl mb-7 bg-blue-600 h-9 rounded-md text-white font-medium"
                onClick={handleSaveBackgroundColor}
            >
                Salvar Cor de Fundo
            </button>

            <h2 className="font-bold text-white mb-4 text-4xl">Meus Links</h2>
            {links.map((item) => (
                <article
                    key={item.id}
                    className="flex items-center justify-between w-11/12 max-w-xl rounded px-2 py-3 m-2"
                    style={{ backgroundColor: item.bg, color: item.color }}
                >
                    <p className="font-bold">{item.name}</p>
                    <button
                        onClick={() => handleDeleteLink(item.id)}
                        className="border border-dashed py-1 px-2 rounded cursor-pointer"
                    >
                        <FiTrash size={18} color="white" />
                    </button>
                </article>
            ))}
        </div>
    );
}
