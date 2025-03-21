import { InputHTMLAttributes } from "react";


interface InputProps extends InputHTMLAttributes<HTMLInputElement>{}


export function Input(props: InputProps){
    return (
        
        <input type="text"
        
        className="border-0 h-9 rounded-md outline-none px-2 m-2 bg-white"
        {...props}
            />
     
    )
}