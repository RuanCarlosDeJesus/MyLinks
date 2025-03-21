import { useState, useEffect, FormEvent } from "react";
import { Header } from "../../components/header/index";
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
    deleteDoc
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
    const [links, setLinks] = useState<LinkProps[]>([]);

    useEffect(() => {
        const linkRef = collection(db, "links");
        const queryRef = query(linkRef, orderBy("created", "asc"));

        const onSub = onSnapshot(queryRef, (snapshot) => {
            let lista: LinkProps[] = []; 

            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    name: doc.data().name,
                    url: doc.data().url,
                    bg: doc.data().bg,
                    color: doc.data().color
                });
            });

            setLinks(lista); 
        });

        return () => onSub();
    }, []);
     function handleRegister(e:FormEvent){
    e.preventDefault();
if( nameInput ==="" || url===""){
    alert("Preencha todos os campos!")
    return;
}

     addDoc(collection(db,"links"),{
        name: nameInput,

        url:url,
        bg:backgroundColor,
        color: textColor,
        created: new Date()
    }).then(()=>{
        setNameInput("");
        setUrl("");
        console.log("funfou")
    }).catch((error)=>{
        console.log(error)
    })
    }

 async   function handleDeleteLink(id:string){
        const docRef = doc(db,"links",id);
       await deleteDoc(docRef);
    }

    return (    
            <div className="flex items-center flex-col min--screen pb-7 px-2">
                <Header/>


                <form className="flex flex-col mt-8 mb-3 w-full max-w-xl" onSubmit={handleRegister}>

                    

                    <label className="text-white font-medium mt-2 mb-2"> 
                       Nome do Link
                    </label>
                     <Input
                     placeholder="Nome do link"
                     value={nameInput}
                     onChange={(e)=> setNameInput(e.target.value)}
                     />


                    <label className="text-white font-medium mt-2 mb-2"> 
                       Nome da URL
                    </label>
                     <Input
                     placeholder="digite a URL"
                     value={url}
                     onChange={(e)=> setUrl(e.target.value)}
                     />
                    <section className="flex my-4 gap-2">
                        <div  className=" flex gap-3">
                            <label className="text-white font-medium mt-2 mb-2"> 
                            Fundo do link
                            </label>
                        <input type="color"
                          className="cursor-pointer"
                            value={textColor}
                            onChange={(e)=>  setTextColor(e.target.value)} />
                        </div>

                        <div className=" flex gap-3">
                            <label className="text-white font-medium mt-2 mb-2"> 
                            cor do link
                            </label>
                        <input type="color"
                         className="cursor-pointer"
                            value={backgroundColor}
                            onChange={(e)=>  setBackgroundColor(e.target.value)} />
                        </div>
                  
                    </section>
                       
                        {nameInput !=='' && (
                                   <div className="flex items-center justify-start flex-col mb-7 p-1 border-white border rounded-md">
                                   <label className="text-white font-medium mt-2 mb-2"> 
                                     Veja como está ficando:
                                     </label>
                                     <article className="w-11/12 max-w-lg flex flex-col items-center justify-between bg-zinc-900 rounded px-1 py-3 "
                                     style={{marginBottom:8,marginTop:8, backgroundColor: backgroundColor}}>
                                         <p className="fonte-medium" style={{color:textColor}}> {nameInput}</p>
                                     </article>
                                 </div>   
                        )}    
                    <button className="mb-7 bg-blue-600 h-9 rounded-md text-white font-medium gap-4 flex justify-center items-center cursor-pointer"> Cadastrar</button>
                </form>

                 <h2 className="font-bold text-white mb-4 text-4xl"> Meus Links</h2>
                {
                    links.map((item)=> (
                        
                        <article
                        key={item.id}
                         className="flex items-center justify-between w-11/12 max-w-xl rounded px-2 py-3 m-2 select-none"
                        style={{backgroundColor:item.bg, color:item.color}}>
                               <p className="font-bold"> {item.name}</p>
                               <div>
                                   <button onClick={() =>handleDeleteLink(item.id)}
                                   className="border border-dashed py-1 px-2  rounded cursor-pointer">
                                      < FiTrash size={18} color="white"/>
                                   </button>
                               </div>
                        </article>
                    ))
                }
            </div>
    )
}