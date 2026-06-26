import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { createContactRequestAPI } from "../features/company/companyAPI";

function Home() {
  const { loading } = useSelector((state) => state.auth);
  const [selectedPlan, setSelectedPlan] = useState("");

const handlePlanClick = (plan) => {
  setSelectedPlan(plan);
  scrollToForm();
};

  const [form, setForm] = useState({
    company: "",
    email: "",
    phone: "",
  });
  const scrollToForm = () => {
  document.getElementById("contact-form").scrollIntoView({
    behavior: "smooth",
  });
};
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedPlan) {
    alert("Please select a plan first ⚠️");
    return;
  }

  try {
    const payload = {
      ...form,
      plan: selectedPlan,
    };

    const res = await createContactRequestAPI(payload);

    console.log("SUCCESS:", res);

    alert("Request Submitted 🚀");

    setForm({
      company: "",
      email: "",
      phone: "",
    });

    setSelectedPlan("");

  } catch (err) {
    console.log("ERROR:", err);
    alert("Something went wrong ❌");
  }
};
    if (loading) {
  return (
    <div className="fixed inset-0 bg-white flex flex-col justify-center items-center z-50">
      <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-blue-600"></div>

      <p className="mt-4 text-gray-600 font-medium">
        Loading...
      </p>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">

      <Navbar />

      {/* 🔥 HERO */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 pt-32">
        <div className="md:w-1/2 space-y-4 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold">
            Manage Your Company Smartly 🚀
          </h1>

          <p className="opacity-90 max-w-md">
            Employees, tasks, reports — sab ek jagah. Powerful SaaS system for modern companies.
          </p>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="dashboard"
            className="w-72 md:w-96"
          />
        </div>
      </div>

     {/* 🔥 FEATURES */}
<div id="features" className="mt-25 px-6 md:px-16">
  <h2 className="text-4xl font-bold text-center mb-16">
    Powerful Features 💡
  </h2>

  <div className="grid md:grid-cols-3 gap-8">

    {[
      {
        title: "Employee Management",
        desc: "Easily manage employees, roles and departments in one place.",
        icon: "👨‍💼",
      },
      {
        title: "Task Tracking",
        desc: "Assign, track and monitor tasks with real-time updates.",
        icon: "📋",
      },
      {
        title: "Smart Notifications",
        desc: "Stay updated with instant alerts and activity tracking.",
        icon: "🔔",
      },
    ].map((item, i) => (
      <div
        key={i}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hover:scale-105 hover:bg-white/20 transition duration-300 shadow-xl"
      >
        <div className="text-4xl mb-4">{item.icon}</div>
        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
        <p className="text-sm opacity-80">{item.desc}</p>
      </div>
    ))}

  </div>
</div>
{/* 🔥 HOW IT WORKS (PREMIUM) */}
<div id="about" className="mt-32 px-6 md:px-20 text-center">

  <h2 className="text-4xl md:text-5xl font-bold mb-4">
    How It Works ⚙️
  </h2>

  <p className="text-white/70 mb-16">
    Simple 3-step process to get your company up and running
  </p>

  <div className="grid md:grid-cols-3 gap-10 relative">

    {[
      {
        title: "Request Demo",
        desc: "Submit your company details and requirements.",
        icon: "📩",
      },
      {
      
        title: "Setup by Us",
        desc: "We create your company dashboard & admin account.",
        icon: "⚙️",
      },
      {
        title: "Start Managing",
        desc: "Login and manage employees, tasks & reports easily.",
        icon: "🚀",
      },
    ].map((item, i) => (
      <div
        key={i}
        className="relative bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition duration-300"
      >

        {/* Icon */}
        <div className="text-4xl mb-4">
          {item.icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-2">
          {item.title}
        </h3>

        {/* Desc */}
        <p className="text-sm text-white/70 leading-relaxed">
          {item.desc}
        </p>

      </div>
    ))}

  </div>

</div>

    
<div id="pricing" className="mt-25 px-6 md:px-16 text-center">
  <h2 className="text-4xl font-bold mb-16">
    Simple Pricing 💳
  </h2>

  <div className="grid md:grid-cols-3 gap-8">

    {/* FREE */}
    <div className="bg-white/10 p-8 rounded-3xl border border-white/20">
      <h3 className="text-xl font-semibold mb-2">Free</h3>
      <p className="text-4xl font-bold mb-4">₹0</p>

      <ul className="space-y-2 text-sm opacity-80">
        <li>✔ Basic dashboard</li>
        <li>✔ Limited users</li>
        <li>✔ Email support</li>
      </ul>

      <button className="hover:scale-105 transition cursor-pointer mt-6 w-full bg-white text-black py-2 rounded-xl font-semibold">
        Current Plan
      </button>
    </div>

    {/* MONTHLY */}
    <div className="bg-white/10 p-8 rounded-3xl border border-white/20">
      <h3 className="text-xl font-semibold mb-2">Monthly</h3>
      <p className="text-4xl font-bold mb-4">₹399</p>

      <ul className="space-y-2 text-sm opacity-80">
        <li>✔ Unlimited employees</li>
        <li>✔ Advanced analytics</li>
        <li>✔ Priority support</li>
      </ul>

      <button className="hover:scale-105 transition mt-6 w-full bg-blue-600 py-2 rounded-xl cursor-pointer"
      onClick={() => handlePlanClick("monthly")}>
        Choose Plan
      </button>
    </div>

    {/* YEARLY (highlighted) */}
    <div className="bg-linear-to-br from-purple-600 to-indigo-600 p-8 rounded-3xl scale-105 shadow-2xl">

      <p className="text-xs bg-white text-black px-2 py-1 rounded w-fit mb-2">
        BEST VALUE
      </p>

      <h3 className="text-xl font-semibold mb-2">Yearly</h3>
      <p className="text-4xl font-bold mb-4">₹3999</p>

      <ul className="space-y-2 text-sm">
        <li>✔ Everything in Monthly</li>
        <li>✔ Faster performance</li>
        <li>✔ Premium support</li>
      </ul>

      <button className="hover:scale-105 transition cursor-pointer  mt-6 w-full bg-white text-black py-2 rounded-xl font-semibold"
      onClick={() => handlePlanClick("yearly")}>
        Choose Plan
      </button>
    </div>

  </div>
</div>

      {/* 🔥 REQUEST DEMO */}
<div id="contact-form"  className="mt-25 px-6 md:px-16 text-center">
  <h2 className="text-4xl font-bold mb-4">
    Start Your Company Setup 🚀
  </h2>

  <p className="opacity-80 mb-10">
    Fill the details and we’ll set up your company dashboard.
  </p>

  <form
    onSubmit={handleSubmit}
    className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 space-y-4 shadow-2xl"
  >

    <input
      name="company"
      value={form.company}
      onChange={handleChange}
      placeholder="Company Name"
       className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
                         placeholder-white/70 text-white focus:outline-none 
                         focus:ring-2 focus:ring-white focus:bg-white/30 transition-all"
      required
    />

    <input
      name="email"
      value={form.email}
      onChange={handleChange}
      placeholder="Business Email"
       className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
                         placeholder-white/70 text-white focus:outline-none 
                         focus:ring-2 focus:ring-white focus:bg-white/30 transition-all"
      required
    />

    <input
      name="phone"
      value={form.phone}
      onChange={handleChange}
      placeholder="Phone Number"
       className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 
                         placeholder-white/70 text-white focus:outline-none 
                         focus:ring-2 focus:ring-white focus:bg-white/30 transition-all"
      required
    />
   <input
  value={selectedPlan || "No plan selected"}
  readOnly
  className="p-3 rounded-xl text-center text-black w-full bg-gray-100"
/>

    <button
  type="submit"
  className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:scale-105 transition"
>
  Request Setup 🚀
</button>

  </form>
</div>

      {/* 🔥 FOOTER */}
      <div className="mt-20 py-6 text-center text-sm border-t border-white/20">
        <p>© 2026 Company Management System</p>
        <div className="space-x-4 mt-2">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Support</span>
        </div>
      </div>

    </div>
  );
}

export default Home;
