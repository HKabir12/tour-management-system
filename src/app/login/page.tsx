import Image from "next/image";
import LoginForm from "./components/LoginForm";
import registerIcon from "@/assets/images/reg.jpg"

const LoginPage = () => {
  return (
    <div>
       <div className="flex flex-col-reverse md:flex-row items-center justify-center py-6 sm:space-y-0 md:space-x-8">
      <LoginForm></LoginForm>
      <Image
            src={registerIcon}
            width={400}
            height={400}
            alt="Register Illustration"
            className="rounded-lg w-[300px] sm:w-[300px] lg:w-[500px] object-cover"
          />
    </div>
    </div>
  );
};

export default LoginPage;
