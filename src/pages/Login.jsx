import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../FireBase";

function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(null);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsError(null);

    if (!data.email) return setIsError("Email is required");
    if (!data.password) return setIsError("Password is required");

    try {
      setIsSubmitting(true);

      // Firebase login
      await signInWithEmailAndPassword(auth, data.email, data.password);

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
              name="email"
              value={data.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              value={data.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <button type="submit" className={isSubmitting ? "inProcess" : ""}>
              {isSubmitting ? "Logging In..." : "Login"}
            </button>
          </div>
        </form>

        <p>
          New User? <Link to="/register">Register Here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
