import { supabase } from "@/lib/supabase-client";
export async function  upload_file(file:File, email:string) {
    const filePath = `${email}/${file.name}`;
    const { data, error } = await supabase
    .storage
    .from('files/')
    .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
    })
}