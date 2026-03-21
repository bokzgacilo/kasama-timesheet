import { createClient } from "./browser";

export async function signout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  window.location.href = "/"
}