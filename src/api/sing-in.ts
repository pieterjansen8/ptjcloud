"use server"
import { supabase } from '@/lib/supabase-client'
export async function login(password:string, email:string, register:boolean){
    if(register==true){
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        if(error!=undefined){
            return [error.code]
        }
        else{
            const { data, error } = await supabase
            .storage
            .from('files')
            .upload(email+"/welcome.txt",  'Welcome to PTJ_CLOUD!',{
                cacheControl: '3600',
                upsert: false
            })
            if(error != undefined){
                console.log(error)
                return [error.cause]
            }
            return ["200-register"]
        }
    }
    else{
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if(error!=undefined){
            return [error.code]
        }
        else{
            return ["200", data.session.refresh_token]
        }   
    }
}
