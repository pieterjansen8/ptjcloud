import "server-only";
import { FilesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/libsql';
export const upload_file = async (key: string, url: string, name:string, user_id:string) => { 
    const push = await db.insert(FilesTable).values({key: key, url:url, name:name, user_id:user_id})
    if(push){
        return true
    }else{
        return false
    }
}
export const Get_user_files = async (user:any) => { 
    if(!user){
        return ["error", "User not AUTHENTICATED"]
    }
    const files = await db.select().from(FilesTable).where(eq(FilesTable.user_id, user.id))
    return ["success", files]
    
}

const db = drizzle({ connection: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  }});