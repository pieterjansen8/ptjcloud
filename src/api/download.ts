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
export async function  share_file(email:string,file_name:string, sharedmail:string){
    const filePath = `${email}/${file_name}`;
    const share_path = `${sharedmail}/${file_name+"-shared"}`;
    const { data, error } = await supabase
      .storage
       .from('files')
       .copy(filePath, share_path)
    if(error!=undefined){
        return [false, error]
    }
    else{
        console.log(data)
        return [true]
    }
}