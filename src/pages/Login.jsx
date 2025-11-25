import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../FireBase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsError(null);

    if (!email || !password) {
      return setIsError("Please fill all fields");
    }

    try {
      setIsSubmitting(true);

      await signInWithEmailAndPassword(auth, email, password);

      navigate("/");
    } catch (error) {
      console.log(error);
      setIsError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="form-container">
      {isError && <p style={{ color: "red" }}>{isError}</p>}

      <h2>Login to Ecommerce</h2>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className={isSubmitting ? "inProcess" : ""}>
            {isSubmitting ? "Logging In..." : "Login"}
          </button>
        </form>

        <p>New User? <Link to="/register">Register Here</Link></p>
      </div>
    </div>
  );
}

export default Login;
