import { ReactNode, useState, useEffect } from "react";
import { auth } from "../services/firebaseConections";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

interface PrivateProps {
  children: ReactNode;
}

export function Private({children}: PrivateProps){
    const [loading,setLoading] = useState(true);
    const [signed,setSigned] = useState(false);
    useEffect(()=>{

        const onsub = onAuthStateChanged(auth,(user)=>{
           if(user){
            const userData = {
                uid: user?.uid,
                email:user?.email
            }
            localStorage.setItem("mylinks", JSON.stringify(userData))
            setLoading(false);
            setSigned(true);
           }else{
            setLoading(false);
            setSigned(false);
           }
        })
return ()=>{
    onsub()
}
    },[])


    if(loading){
        return <div></div>
    }
    if(!signed){
       return <Navigate to="/" />
    }


    return children;
}