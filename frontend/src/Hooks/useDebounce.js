import { useEffect, useState } from "react";

export default function useDebounce(value,delay){
    const [finalSearch,setFinalSearch] = useState(value);
    useEffect(()=>{
        const timer = setTimeout(()=>{
            setFinalSearch(value);
        },delay)

        return ()=> clearTimeout(timer);
    },[value,delay])

    return finalSearch
}
