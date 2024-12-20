import { supabase } from "@/lib/supabase-client";
export async function  upload_file(file:File, email:string) {
    if(file.size>50000000){
        return [false, "File size is too large. Maximum file size is 50MB, consider compressing the file."]
    }
    const filePath = `${email}/${file.name.replaceAll("[" , "").replaceAll("]" , "").replaceAll("{" , "").replaceAll("}" , "").replaceAll(" " , "")}`;
    const {  error } = await supabase
    .storage
    .from('files/')
    .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
    })
    if(error!=undefined){
        return [false, error.message]
    }
    else{
        return [true]
    }
}