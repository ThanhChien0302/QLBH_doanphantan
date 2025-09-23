import Image from "next/image";
import LoginForm from "../components/LoginForm";


export default function Home() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <LoginForm />
    </div>
  );
}
