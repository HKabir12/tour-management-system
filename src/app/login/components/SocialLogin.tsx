"use client";

import { signIn } from "next-auth/react";

const SocialLogin = () => {
  const handleSocialLogin = async (provider: string) => {
    await signIn(provider, { redirect: false });
  };

  return (
    <div className="flex flex-col gap-3 mt-5">
      <button
        onClick={() => handleSocialLogin("google")}
        className="btn bg-white text-black border border-gray-300 rounded-xl"
      >
        Login with Google
      </button>

      <button
        onClick={() => handleSocialLogin("github")}
        className="btn bg-black text-white rounded-xl"
      >
        Login with GitHub
      </button>
    </div>
  );
};

export default SocialLogin;
