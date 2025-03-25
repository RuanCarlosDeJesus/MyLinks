
import {useState, useEffect} from'react'
import {Social}  from '../../components/social'
import {FaFacebook, FaInstagram, FaYoutube} from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { db } from '../../services/firebaseConections'
import {
    doc,
    getDocs,
    collection,
    orderBy,
    query,
    getDoc,
}from 'firebase/firestore'


interface LinkProps{
    id:string;
    name:string;
    url:string;
    bg:string;
    color:string;
}

interface SocialLinksProps{
    facebook: string;
    youtube: string;
    instagram: string;
  }

export function Home(){
const [links,setLinks] = useState<LinkProps[]>([])
const [socialLinks, setSocialLinks] = useState<SocialLinksProps>()
useEffect(()=> {
  function loadLinks(){
    const linksRef = collection(db,"links");
    const queryRef = query(linksRef,orderBy("created","asc"))
    getDocs(queryRef)
    .then((snapshot) => {
        let lista = [] as LinkProps[];
        snapshot.forEach((doc)=>{
            lista.push({
                id:doc.id,
                name: doc.data().name,
                url:doc.data().url,
                bg: doc.data().bg,
                color: doc.data().color,
            })
            setLinks(lista);
        })
    })
  }
loadLinks();
},[])

useEffect(() => {
    function loadingSocialLinks() {
        const docRef = doc(db, "social", "link");
        getDoc(docRef)
            .then((snapshot) => {
                if (snapshot.data() !== undefined) {
                  setSocialLinks({
                    facebook: snapshot.data()?.facebook || "",
                    instagram: snapshot.data()?.instagram || "",
                    youtube: snapshot.data()?.youtube || ""
                });
                }
            });
    }

    loadingSocialLinks();
}, []);


    return (
        <div  className="flex flex-col w-full py-4 items-center justify-center">
            
        <h1 className="md:text-4xl  text-3xl  font-bold text-white mt-20" >  My Links</h1>
        <span className="text-gray-50 mb-5 mt-3"> Veja meus Links 👇</span>

        <main className="flex flex-col w-11/12 max-w-xl text-center">
           {
            links.map((link)=> (
           
                <section 

                style={{ backgroundColor: link.bg}}
                key={link.id}
                className="bg-white mb-4 w-full py-2 rounded-lg select-none transition-transform hover:scale-105 cursor-pointer" >
                <a href={link.url } target='_blank'  >
                <p className='text-base md:text-lg ' style={{ color: link.color}}>
                {link.name}
                </p>
                  
                
                </a>
            </section>
            ))
           }
            
            { socialLinks && Object.keys(socialLinks).length > 0 && (
  <footer className="flex justify-center gap-3 my-4">
    <Social url={socialLinks?.facebook}>
      <FaFacebook className='transition-transform hover:scale-110 ' size={35} color="#0866FE" />
    </Social>
    <Social  url={socialLinks?.youtube}>
      <FaYoutube  className='transition-transform hover:scale-110 ' size={35} color="#FF0033" />
    </Social>
    <Social url={socialLinks?.instagram}>
      <FaInstagram className='transition-transform hover:scale-110 '  size={35} color="#FE1A84" />
    </Social>



             
  </footer>

              
)}


        </main>
        <footer className="  items-center justify-center flex rounded-3xl border-2 p-4 mt-auto md:mt-12">
        <Link to="/login">
          <p className='text-white  underline underline-offset-1 text-xl'>Entre com sua conta </p>
          </Link>
        </footer>
      
 {/* 
<footer className="mt-1 pt-1">
  <Link to="/register">
    <p className='text-purple-400 text-xs underline underline-offset-1'>
      Entre com sua conta 
    </p>
  </Link>
</footer> 
*/}
       
        </div>
    )
}