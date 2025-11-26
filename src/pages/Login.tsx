import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Card, Input, Button } from "@nextui-org/react";
import { FaBookOpen } from "react-icons/fa";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAF0E6] px-4">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217153-e59921498e75?q=80&w=2828&auto=format&fit=crop')] bg-cover bg-center opacity-10 pointer-events-none"></div>
      
      <Card className="w-full max-w-md p-8 bg-[#FFF8DC]/80 backdrop-blur-md shadow-xl border border-[#9A3B3B]/10">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-[#9A3B3B] text-white rounded-xl shadow-lg mb-4">
            <FaBookOpen size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#2D1B0E]">Welcome Back</h2>
          <p className="text-[#5C4033] mt-2">Continue your reading journey</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
            classNames={{
              inputWrapper: "bg-white/50 border-[#9A3B3B]/20 hover:border-[#9A3B3B]/50 focus-within:!border-[#9A3B3B]",
              label: "text-[#5C4033]",
            }}
            value={email}
            onValueChange={setEmail}
            isRequired
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            type="password"
            variant="bordered"
            classNames={{
              inputWrapper: "bg-white/50 border-[#9A3B3B]/20 hover:border-[#9A3B3B]/50 focus-within:!border-[#9A3B3B]",
              label: "text-[#5C4033]",
            }}
            value={password}
            onValueChange={setPassword}
            isRequired
          />
          
          {error && <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</div>}
          
          <Button 
            type="submit" 
            className="w-full bg-[#9A3B3B] text-white font-bold shadow-lg shadow-[#9A3B3B]/20 mt-2"
            size="lg"
          >
            Login
          </Button>
        </form>

        <div className="mt-6 text-center text-[#5C4033]">
          <p>Don't have an account? <Link to="/signup" className="text-[#9A3B3B] font-bold hover:underline">Sign up</Link></p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
