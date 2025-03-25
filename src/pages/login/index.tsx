import { Link, useNavigate} from "react-router-dom";
import {Input} from "../../components/input"
import { FormEvent, useState } from "react";
import {auth} from '../../services/firebaseConections'
import {signInWithEmailAndPassword} from 'firebase/auth'



export function Login(){
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const navigate = useNavigate()
function handleSubmit(e:FormEvent){
e.preventDefault()


if(email ===''|| password ===''){
    alert("preencha corretamente ")
}


signInWithEmailAndPassword(auth,email,password)
.then(()=> {

    navigate("/admin", { replace: true });

}).catch((error)=>{
    if(!email || !password){
        alert("sua senha ou seu email estão incorretos!")
    } else {
        alert("erro ao login tente novamente")
    }
   console.log(error);
})





}
    return (
        <div className="flex w-full h-screen items-center justify-center flex-col">
            <Link to="/">   <h1 className="mt-11 text-amber-50 text-5xl font-bold   ">My<span className="bg-gradient-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent">Links</span></h1></Link>
         
         <form onSubmit={handleSubmit}
          className="w-full max-w-xl flex flex-col m-1">

            <Input
            placeholder="Digite seu email"
            type="email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}/>


        <Input
            placeholder="*********"
            type="password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}/>




            <button className="h-9 bg-blue-600 rounded border-0 font-medium m-2 text-white cursor-pointer"
            type="submit">
                Entrar
            </button>
         </form>
         
        </div>
    )
}