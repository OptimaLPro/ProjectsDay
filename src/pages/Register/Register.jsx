import { useState } from "react";
import { useRegister, useLogin } from "@/hooks/useAuth";

const Register = ({ type = "login" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = type === "register" ? useLogin() : useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background">
      <form onSubmit={handleSubmit}>
        <h2>{type === "login" ? "התחברות" : "הרשמה"}</h2>
        <input
          type="email"
          value={email}
          placeholder="אימייל"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          value={password}
          placeholder="סיסמה"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "שולח..." : "שלח"}
        </button>
        {mutation.isError && (
          <p style={{ color: "red" }}>
            שגיאה: {mutation.error.response?.data?.error || "שגיאה כללית"}
          </p>
        )}
      </form>
    </div>
  );
};

export default Register;
