// src/app/register/page.tsx
"use client";

import React from "react";
import Image from "next/image";
import RegisterForm from "./components/RegisterForm";
import registerIcon from "@/assets/images/reg.jpg"
const RegisterPage: React.FC = () => {
  return (
   <>
    <div className="flex flex-col-reverse md:flex-row items-center justify-center py-6 sm:space-y-0 md:space-x-8">
      <RegisterForm></RegisterForm>
      <Image
            src={registerIcon}
            width={400}
            height={400}
            alt="Register Illustration"
            className="rounded-lg w-[300px] sm:w-[300px] lg:w-[500px] object-cover"
          />
    </div>
   </>
  );
};

export default RegisterPage;
