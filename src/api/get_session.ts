'use server'; 
import { createClient } from "@/utils/supabase/server";
export async function getdata(refresh_token:string){
    const supabase = await createClient()
    const { data, error } = await supabase.auth.refreshSession({ refresh_token })
    const { session, user } = data
    if(error!=undefined){
        return [error]
    }  
    return [error, data, session, user]
}
export async function getOauthdata(){
    const supabase = await createClient()
    const { data, error } = await supabase.auth.refreshSession()
    const { session, user } = data
    if(error!=undefined){
        return [error]
    }  
    return [error, data, session, user]
}