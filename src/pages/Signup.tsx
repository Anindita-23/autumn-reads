import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup as firebaseSignup } from "../firebase/auth";
import { Card, Input, Button, Select, SelectItem } from "@nextui-org/react";
import { FaBookOpen } from "react-icons/fa";

type Role = "reader" | "publisher";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<Role>("reader");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email || !password)
        throw new Error("Email and password are required");
      if (!role) throw new Error("Please select a role");

      await firebaseSignup(email, password, role);

      // After successful signup, redirect to the role-specific dashboard
      if (role === "publisher") navigate("/publisher");
      else navigate("/reader");
    } catch (err: any) {
      setError(err?.message || "Signup failed");
    } finally {
      setLoading(false);
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
          <h2 className="text-3xl font-serif font-bold text-[#2D1B0E]">Join AutumnReads</h2>
          <p className="text-[#5C4033] mt-2">Start your cozy reading adventure</p>
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
            placeholder="Create a password"
            type="password"
            variant="bordered"
            classNames={{
              inputWrapper: "bg-white/50 border-[#9A3B3B]/20 hover:border-[#9A3B3B]/50 focus-within:!border-[#9A3B3B]",
              label: "text-[#5C4033]",
            }}
            value={password}
            onValueChange={setPassword}
            isRequired
            minLength={6}
          />
          
          <Select
            label="I want to be a"
            variant="bordered"
            classNames={{
              trigger: "bg-white/50 border-[#9A3B3B]/20 hover:border-[#9A3B3B]/50 focus-within:!border-[#9A3B3B]",
              label: "text-[#5C4033]",
              value: "text-[#2D1B0E]",
            }}
            selectedKeys={[role]}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            <SelectItem key="reader" value="reader">Reader</SelectItem>
            <SelectItem key="publisher" value="publisher">Publisher</SelectItem>
          </Select>

          {error && <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</div>}
          
          <Button 
            type="submit" 
            isLoading={loading}
            className="w-full bg-[#9A3B3B] text-white font-bold shadow-lg shadow-[#9A3B3B]/20 mt-2"
            size="lg"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-6 text-center text-[#5C4033]">
          <p>Already have an account? <Link to="/login" className="text-[#9A3B3B] font-bold hover:underline">Login</Link></p>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
