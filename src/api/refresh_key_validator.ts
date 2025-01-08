'use server'; 
import { createClient } from "@/utils/supabase/server";
export async function validate_refresh_key(refresh_token: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.refreshSession({ refresh_token });
  if (error == undefined) {
    return true;
  } else {
    return false;
  }
}
