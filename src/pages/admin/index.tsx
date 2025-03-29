import { useState, useEffect, FormEvent } from "react";
import { Header } from "../../components/header";
import { Input } from '../../components/input';
import { FiTrash } from "react-icons/fi";
import { db } from '../../services/firebaseConections';
import {
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    doc,
    deleteDoc,
    setDoc,
} from "firebase/firestore";
import { auth } from '../../services/firebaseConections';

interface LinkProps {
    id: string;
    name: string;
    url: string;
    bg: string;
    color: string;
    backgroundColor: string;
}

export function Admin() {
    const [nameInput, setNameInput] = useState("");
    const [url, setUrl] = useState("");
    const [textColor, setTextColor] = useState("#f1f1f1");
    const [backgroundColor, setBackgroundColor] = useState("#000");
    const [backgroundColorAll, setBackgroundColorAll] = useState("");
    const [links, setLinks] = useState<LinkProps[]>([]);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const linkRef = collection(db, `users/${user.uid}/links`);
            const queryRef = query(linkRef, orderBy("created", "asc"));

            const onSub = onSnapshot(queryRef, (snapshot) => {
                let lista: LinkProps[] = [];
                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        name: doc.data().name,
                        url: doc.data().url,
                        bg: doc.data().bg,
                        color: doc.data().color,
                        backgroundColor: doc.data().backgroundColor,
                    });
                });

                setLinks(lista);
            });

            return () => onSub();
        }
    }, []);

    function handleRegister(e: FormEvent) {
        e.preventDefault();
        const user = auth.currentUser;
        if (user) {
            if (nameInput === "" || url === "") {
                alert("Preencha todos os campos!");
                return;
            }

            addDoc(collection(db, `users/${user.uid}/links`), {
                name: nameInput,
                url: url,
                bg: backgroundColor,
                color: textColor,
                created: new Date()
            }).then(() => {
                setNameInput("");
                setUrl("");
                console.log("Link cadastrado!");
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    async function handleDeleteLink(id: string) {
        const user = auth.currentUser;
        if (user) {
            const docRef = doc(db, `users/${user.uid}/links`, id);
            await deleteDoc(docRef);
        }
    }

    async function handleSaveBackgroundColor() {
        try {
            await setDoc(doc(db, "config", "background"), {
                backgroundColor: backgroundColorAll,
            });
            alert('Cor de fundo salva com sucesso!');
        } catch (error) {
            alert('Erro ao salvar a cor de fundo');
            console.error(error);
        }
    }

    return (
        <div className="flex items-center h-screen flex-col min--screen pb-7 px-2" style={{ background: backgroundColorAll }}>
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
                    placeholder="digite a URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <section className="flex my-4 gap-2">
                    <div className="flex gap-3">
                        <label className="text-white font-medium mt-2 mb-2">Fundo do link</label>
                        <input type="color"
                            className="cursor-pointer"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)} />
                    </div>

                    <div className="flex gap-3">
                        <label className="text-white font-medium mt-2 mb-2">Cor do link</label>
                        <input type="color"
                            className="cursor-pointer"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)} />
                    </div>

                    <div className="flex gap-3">
                        <label className="text-white font-medium mt-2 mb-2">Cor de fundo</label>
                        <input type="color"
                            className="cursor-pointer"
                            value={backgroundColorAll}
                            onChange={(e) => setBackgroundColorAll(e.target.value)} />
                    </div>
                </section>

                <button className="mb-7 bg-blue-600 h-9 rounded-md text-white font-medium gap-4 flex justify-center items-center cursor-pointer">Cadastrar</button>
            </form>

            <button className="w-full max-w-xl mb-7 bg-blue-600 h-9 rounded-md text-white font-medium gap-4 flex justify-center items-center cursor-pointer" onClick={handleSaveBackgroundColor}>
                Salvar Cor de Fundo
            </button>

            <h2 className="font-bold text-white mb-4 text-4xl">Meus Links</h2>
            {
                links.map((item) => (
                    <article
                        key={item.id}
                        className="flex items-center justify-between w-11/12 max-w-xl rounded px-2 py-3 m-2 select-none"
                        style={{ backgroundColor: item.bg, color: item.color }}>
                        <p className="font-bold">{item.name}</p>
                        <div>
                            <button onClick={() => handleDeleteLink(item.id)}
                                className="border border-dashed py-1 px-2 rounded cursor-pointer">
                                <FiTrash size={18} color="white" />
                            </button>
                        </div>
                    </article>
                ))
            }
        </div>
    );
}
