"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const SocialLogin = () => {
  const handleSocialLogin = async (provider: string) => {
    await signIn(provider, { redirect: false });
  };

  return (
    <div >
      {/* Google */}
      <Button
        onClick={() => handleSocialLogin("google")}
        className="btn  border-[#e5e5e5] w-full my-5 rounded-xl"
      >
       
        Login with Google
      </Button>

      {/* GitHub */}
      <Button
        onClick={() => handleSocialLogin("github")}
        className="btn  border-black w-full rounded-xl"
      >
        
        Login with GitHub
      </Button>
    </div>
  );
};

export default SocialLogin;
