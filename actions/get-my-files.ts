import { UTApi } from "uploadthing/server";
import { auth } from "@clerk/nextjs";
import supabase from "@/utils/supabase/client";

export const getMyFiles = async () => {
  try {
    const { userId } = auth();
    if (!userId) return [];

    const { data: files } = await supabase
      .from("files")
      .select("*")
      .eq("user_id", userId);

    return files;
  } catch (err: Error | any) {}
};
