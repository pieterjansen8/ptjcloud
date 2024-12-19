import { supabase } from '@/lib/supabase-client'
export async function validate_refresh_key(refresh_token:string){
    const { data, error } = await supabase.auth.refreshSession({ refresh_token })
    if(error==undefined){
        return true
    }
    else{
        return false
    }
}