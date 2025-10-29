"use client";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const SocialLogin = () => {
  const { data } = useSession();
  const router = useRouter();

  const handleSocialLogin = async (provider: string) => {
    await signIn(provider, { redirect: false });
  };

  useEffect(() => {
    if (data?.user) {
      router.push("/");
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Welcome ${data.user.name}!`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }, [data, router]);

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
