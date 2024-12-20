import { supabase } from "@/lib/supabase-client";

export async function download(file_name:string, email:string){
    const filePath = `${email}/${file_name}`;
    const { data, error } = await supabase
        .storage
        .from('files')
        .download(filePath)
    if(error!=undefined){
        return [false, error]
    }
    return [true, data]
}
export async function remove(file_name:string, email:string) {
    const filePath = `${email}/${file_name}`;
    const { error } = await supabase
        .storage
        .from('files')
        .remove([filePath])
    if(error!=undefined){
        return [false, error]
    }
    return [true]
}
export async function copy_link(file_name:string, email:string) {
    const filePath = `${email}/${file_name}`;
    const { data, error } = await supabase
        .storage
        .from('files')
        .createSignedUrl(filePath, 86400)
    if(error!=undefined){
        return [false, error]
    }
    return [true,data.signedUrl]
}