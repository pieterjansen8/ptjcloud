import { supabase } from "@/lib/supabase-client";

export async function  get_files(email:string) {
    const { data, error } = await supabase
        .storage
        .from('files')
        .list(email, {
            limit: 100,
            offset: 0,
        })
    return  data
}