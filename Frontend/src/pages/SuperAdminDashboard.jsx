import { useEffect, useState } from "react";
import {getCompanies,createCompany,deleteCompany,updateCompany,getCompanyDashboardAPI} from "../features/company/companyAPI";
import CompanyDetailsModal from "../components/CompanyDetails";
import LogoutButton from "../components/LogoutButton";

export default function SuperAdminDashboard() {

  const [active, setActive] = useState("dashboard");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyStats, setCompanyStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    plan: "free",
    adminName: "",
    adminEmail: "",
    adminPassword: ""
  });

  const handleViewCompany = async (companyId) => {

  try {
    const res = await getCompanyDashboardAPI(companyId);
    console.log(res)
    setSelectedCompany(res.data.company);
    setCompanyStats(res.data.stats);
    setShowCompanyModal(true);
  } catch (err) {
    console.log(err);
  }
};
  // 🔥 FETCH
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await getCompanies();
      setCompanies(res.data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

 const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  });
};

  const handleSubmit = async () => {
  try {

    await createCompany(form);

    alert("Created ✅");

    setShowModal(false);

    fetchCompanies();

  } catch (err) {
    alert(err.message);
  }
};

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    await deleteCompany(id);
    fetchCompanies();
  };

const filteredCompanies = companies.filter((c) =>
  c.name.toLowerCase().includes(search.toLowerCase())
);
  // 🔥 CONTENT
  const renderContent = () => {

    // DASHBOARD
    if (active === "dashboard") {
      return (
        <div className="grid grid-cols-3 gap-6">
          <StatCard title="Total Companies" value={companies.length} />
          <StatCard title="Active" value={companies.filter(c => c.isActive).length} />
          <StatCard title="Inactive" value={companies.filter(c => !c.isActive).length} />
        </div>
      );
    }

    // COMPANIES
    if (active === "companies") {
      return (
        <div className="max-w-6xl mx-auto">

          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">

            {/* HEADER */}

            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Companies</h1>
              <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      placeholder="Search company..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="border p-2 rounded-lg"
                    />

                    <button
                      onClick={() => setSearch("")}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                    >
                      Reset
                    </button>
                  </div>

              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                + Create
              </button>
            </div>

            {/* TABLE */}
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <table className="w-full border border-gray-200 rounded-xl overflow-hidden">

                <thead className="bg-gray-100">
                  <tr className="text-gray-700 text-sm">
                    <th className="p-3 border-b text-left">Name</th>
                    <th className="p-3 border-b text-left">Email</th>
                    <th className="p-3 border-b text-left">Plan</th>
                    <th className="p-3 border-b text-left">Status</th>
                    <th className="p-3 border-b text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCompanies.map((c, index) => (
                    <tr
                      key={c._id}
                      className={`text-sm ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition`}
                    >

                      <td className="p-3 border-b font-medium">
                        {c.name}
                      </td>

                      <td className="p-3 border-b">
                        {c.email}
                      </td>

                      <td className="p-3 border-b capitalize">
                        {c.plan}
                      </td>

                      <td className="p-3 border-b">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            c.isActive
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-500"
                          }`}
                        >
                          {c.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="p-3 border-b space-x-2">

                        <button
                          onClick={() => handleViewCompany(c._id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleDelete(c._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
              
            )}
            {filteredCompanies.length === 0 && (
  <p className="text-center text-gray-500 mt-4">
    No companies found 😕
  </p>
)}

          </div>
        </div>
      );
    }
  };

  return (
  <div className="flex min-h-screen bg-linear-to-br from-gray-100 to-gray-200">

      <div className="w-64 bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 
text-white p-5 shadow-2xl flex flex-col">

        <h2 className="text-2xl font-bold mb-8">🚀 Super Admin</h2>

        <SidebarItem label="Dashboard" id="dashboard" setActive={setActive} />
        <SidebarItem label="Companies" id="companies" setActive={setActive} />

 <div className="mt-auto p-4">
    <LogoutButton />
  </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-10">
        {renderContent()}
      </div>

        <CompanyDetailsModal
          showCompanyModal={showCompanyModal}
          setShowCompanyModal={setShowCompanyModal}
          selectedCompany={selectedCompany}
          companyStats={companyStats}
          fetchCompanies={fetchCompanies}
        />
      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

            <h2 className="text-lg font-bold mb-4">
  Create Company
</h2>

            <input name="name" placeholder="Name"
              className="w-full border p-2 mb-2 rounded"
              value={form.name} onChange={handleChange} />

            <input name="email" placeholder="Email"
              className="w-full border p-2 mb-2 rounded"
              value={form.email} onChange={handleChange} />

            <select name="plan"
              className="w-full border p-2 mb-2 rounded"
              value={form.plan} onChange={handleChange}>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
            </select>

            <>
  <input
    name="adminName"
    placeholder="Admin Name"
    className="w-full border p-2 mb-2 rounded"
    value={form.adminName}
    onChange={handleChange}
  />

  <input
    name="adminEmail"
    placeholder="Admin Email"
    className="w-full border p-2 mb-2 rounded"
    value={form.adminEmail}
    onChange={handleChange}
  />

  <input
    name="adminPassword"
    type="password"
    placeholder="Password"
    className="w-full border p-2 mb-2 rounded"
    value={form.adminPassword}
    onChange={handleChange}
  />
</>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// 🔥 COMPONENTS

function SidebarItem({ label, id, setActive }) {
  return (
    <button
      onClick={() => setActive(id)}
      className="block w-full text-left px-4 py-2 mb-2 rounded-lg hover:bg-gray-700 transition"
    >
      {label}
    </button>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}
