import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from '../FireBase.js'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function Register() {
  const [data, setData] = useState({
    name: "",
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

    try {
      setIsSubmitting(true);

      // Firebase Authentication - Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: data.name,
      });

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: data.name,
        email: data.email,
        createdAt: new Date().toISOString(),
      });

      // Navigate to login page after successful registration
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      // Display user-friendly error messages
      if (error.code === "auth/email-already-in-use") {
        setIsError("This email is already registered");
      } else if (error.code === "auth/weak-password") {
        setIsError("Password should be at least 6 characters");
      } else if (error.code === "auth/invalid-email") {
        setIsError("Invalid email address");
      } else {
        setIsError(error.message || "Registration failed. Please try again");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-black font-[machina-light]">
        <div className="flex w-full max-w-5xl rounded-xl overflow-hidden shadow-lg" style={{ minHeight: '560px' }}>
          {/* Left panel */}
          <div className="w-1/2 bg-gradient-to-br from-[#14422f] via-[#C63E2F] to-[#0e1b18] px-10 py-16 flex flex-col justify-between hidden md:flex">
            <div>
              <h2 className="text-white text-3xl font-semibold mb-5 leading-tight">
                Get Started<br />with Us
              </h2>
              <p className="text-white text-base mb-12 max-w-[240px]">
                Complete these easy steps to register your account.
              </p>
            </div>
          </div>
          {/* Right: register form */}
          <div className="w-full md:w-1/2 bg-[#181818] px-10 py-16 flex flex-col justify-center">
            <h2 className="text-white text-[1.5rem] font-semibold mb-2 text-center">Sign Up Account</h2>
            <p className="text-[#b7bad0] text-[15px] mb-8 text-center">Enter your personal data to create your account.</p>

            {isError && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4 text-sm text-center">
                {isError}
              </div>
            )}

            <form className="w-full max-w-md mx-auto flex flex-col gap-5" onSubmit={(e) => handleSubmit(e)}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={data.name}
                onChange={handleChange}
                required
                className="bg-[#232323] text-white px-4 py-3 rounded-lg border border-[#242428] placeholder:text-[#768089] focus:outline-none focus:border-[#325244]"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={data.email}
                onChange={handleChange}
                required
                className="bg-[#232323] text-white px-4 py-3 rounded-lg border border-[#242428] placeholder:text-[#768089] focus:outline-none focus:border-[#325244]"
              />
              <input
                type="password"
                name="password"
                placeholder="Password (min 6 characters)"
                value={data.password}
                onChange={handleChange}
                required
                minLength={6}
                className="bg-[#232323] text-white px-4 py-3 rounded-lg border border-[#242428] placeholder:text-[#768089] focus:outline-none focus:border-[#325244]"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#183B29] text-white px-4 py-3 rounded-lg border border-[#183B29] hover:bg-[#13271D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>
              <p className="text-[#b7bad0] text-[15px] text-center mt-4">
                Already have an account? <Link to="/login" className="text-[#183B29] hover:underline">Login Here</Link>
              </p>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}

export default Register;