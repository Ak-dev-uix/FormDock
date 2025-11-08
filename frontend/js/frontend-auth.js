const API = "https://formdock.zeabur.app/api/auth";

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");

// 🔹 Handle Signup
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: signupForm.username.value.trim(),
      email: signupForm.email.value.trim(),
      password: signupForm.password.value.trim(),
    };

    if (!data.name || !data.email || !data.password) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (res.ok) {
        alert("✅ Signup successful!");
        window.location.href = "login.html";
      } else {
        alert(`❌ Signup failed: ${json.message || "Server error"}`);
      }
    } catch (err) {
      console.error("❌ Signup Error:", err);
      alert("Signup failed. Check console.");
    }
  });
}

// 🔹 Handle Login
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      email: loginForm.email.value.trim(),
      password: loginForm.password.value.trim(),
    };

    if (!data.email || !data.password) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (res.ok) {
        localStorage.setItem("userId", json.userId);
        localStorage.setItem("username", json.username);
        alert("✅ Login successful!");
        window.location.href = "dashboard.html";
      } else {
        alert(`❌ Login failed: ${json.message || "Invalid credentials"}`);
      }
    } catch (err) {
      console.error("❌ Login Error:", err);
      alert("Login failed. Check console.");
    }
  });
}
