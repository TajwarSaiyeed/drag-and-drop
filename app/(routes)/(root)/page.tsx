"use client";
import Hero from "@/components/Hero/Hero";
import { useUser } from "@clerk/nextjs";
import supabase from "@/utils/supabase/client";

const HomePage = () => {
  const { user } = useUser();
  const oldUser = new Promise((resolve, reject) => {
    supabase
      .from("users")
      .select("user_id")
      .eq("user_id", user?.id)
      .then((res) => {
        if (res.data.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
  });

  if (user) {
    oldUser.then((res) => {
      if (!res) {
        supabase
          .from("users")
          .insert({
            user_id: user?.id,
          })
          .then((res) => {});
      }
    });
  }

  return (
    <>
      <Hero />
    </>
  );
};

export default HomePage;
