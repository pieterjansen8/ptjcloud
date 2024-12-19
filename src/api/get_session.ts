'use server'; 
import { supabase } from "@/lib/supabase-client";
export async function getdata(refresh_token:string){
    const { data, error } = await supabase.auth.refreshSession({ refresh_token })
    const { session, user } = data
    if(error!=undefined){
        return [error]
    }  
    return [error, data, session, user]
}