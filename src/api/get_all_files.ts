'use server';
import { createClient } from "@/utils/supabase/server";

export async function  get_files(email:string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .storage
        .from('files')
        .list(email, {
            limit: 100,
            offset: 0,
        })
    return  data
}