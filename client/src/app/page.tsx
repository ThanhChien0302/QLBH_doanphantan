import Image from "next/image";
import LoginForm from "../components/LoginForm";
export default function Home() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="col-12 col-md-10 col-lg-8 col-xl-6">
        <LoginForm />
      </div>
    </div>
  );
}
