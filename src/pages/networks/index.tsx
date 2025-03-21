import { useState, FormEvent, useEffect } from "react"
import { Header } from "../../components/header"
import { Input } from "../../components/input"
import { db } from "../../services/firebaseConections"
import{
    setDoc,
    doc,
    getDoc
} from 'firebase/firestore'

export function Networks(){

    const[facebook,setFacebook] = useState("")
    const[instagram,setInstagram] = useState("")
    const[youtube,setYoutube] = useState("")
   

    useEffect(()=>{
        const docRef = doc(db,"social","link");
        getDoc(docRef)
        .then((snapshot)=>{
            if(snapshot.data() !==undefined){
                setFacebook(snapshot.data()?.facebook)
                setInstagram(snapshot.data()?.instagram)
                setYoutube(snapshot.data()?.youtube)
            }
        })
    },[])

    function handleRegister(e:FormEvent){
    e.preventDefault();

    setDoc(doc(db,"social","link"),{
        facebook:facebook,
        instagram:instagram,
        youtube:youtube,

    }).then(()=>{

    }).catch((error)=>{
        console.log(error)
    })

    }

    return (


        <div className="flex  flex-col min-h-screen pb-7 px-2  items-center">
             <Header/>
             <h1 className="text-white text-3xl mt-3  mb-4 font-medium ">Minhas Redes Sociais</h1>
             <form className="flex flex-col max-w-xl w-full"  onSubmit={handleRegister}>
                <label className="text-white font-medium mt-2 mb-2">Link do Facebook</label>
                <Input
                type="url"
                value={facebook}
                onChange={(e)=> setFacebook(e.target.value)}
                />
                   <label className="text-white font-medium mt-2 mb-2">Link do Instagram</label>
                <Input
                type="url"
                value={instagram}
                onChange={(e)=> setInstagram(e.target.value)}
                />
                   <label className="text-white font-medium mt-2 mb-2">Link do Youtube</label>
                <Input
                type="url"
                value={youtube}
                onChange={(e)=> setYoutube(e.target.value)}
                
                />
           
           <button 
            type="submit"
            className="text-white bg-blue-600 h-9 rounded-md items-center justify-center flex mt-2 mb-7 font-medium cursor-pointer" >
                Salvar links
            </button>
             </form>
        </div>
    )
}