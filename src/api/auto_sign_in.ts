import { login} from "./sing-in"
import { useRouter } from "next/router"
export async function for_page(){ 
    const router = useRouter()
    if(localStorage.getItem("loggedin")=="true"){ 
      const r = await login(localStorage.getItem("password")!, localStorage.getItem("email")!, false)
      if(r=="200"){
        router.push("/dash")
      }
      else{ 
        alert(r)
        return
      }
    }
}
export function for_dash(){ 
    
}