import { useState } from "react";
import { updateCompany } from "../features/company/companyAPI";

const CompanyDetailsModal = ({
  showCompanyModal,
  setShowCompanyModal,
  selectedCompany,
  companyStats,
  fetchCompanies
}) => {

  const [showEditModal, setShowEditModal] = useState(false);

const [editForm, setEditForm] = useState({
  name: "",
  email: "",
  plan: "free"
});
const handleChange = (e) => {
  setEditForm({
    ...editForm,
    [e.target.name]: e.target.value
  });
};
const handleUpdateCompany = async () => {

  try {

    await updateCompany(
      selectedCompany._id,
      editForm
    );

    alert("Company Updated ✅");

    fetchCompanies();

    setShowEditModal(false);

    setShowCompanyModal(false);

  } catch (err) {

    alert(err.message);

  }

};
  if (!showCompanyModal || !selectedCompany) {
    return null;
  }

  return (
    <>
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white p-6 rounded-2xl w-175 shadow-xl">

        <h2 className="text-2xl font-bold mb-5">
          Company Details
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-semibold">{selectedCompany.name}</p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold">{selectedCompany.email}</p>
          </div>

          <div>
            <p className="text-gray-500">Plan</p>
            <p className="font-semibold capitalize">
              {selectedCompany.plan}
            </p>
          </div>
           <div>
            <p className="text-gray-500">Billing Type</p>
            <p className="font-semibold capitalize">
              {selectedCompany.subscriptionType}
            </p>
          </div>
          

          <div>
            <p className="text-gray-500">Status</p>
            <p
              className={`font-semibold ${
                selectedCompany.isActive
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {selectedCompany.isActive ? "Active" : "Inactive"}
            </p>
          </div>
           <div>
    <p className="text-gray-500">Subscription Status</p>
    <p className="font-semibold capitalize">
      {selectedCompany.subscriptionStatus}
    </p>
  </div>
  <div>
    <p className="text-gray-500">Plan Purchased On</p>
    <p className="font-semibold">
      {new Date(
        selectedCompany.updatedAt
      ).toLocaleDateString("en-IN")}
    </p>
  </div>

  <div>
    <p className="text-gray-500">Expires On</p>
    <p className="font-semibold">
      {new Date(
        selectedCompany.subscriptionEndDate
      ).toLocaleDateString("en-IN")}
    </p>
  </div>
          

        </div>

        <hr className="my-5" />

        <div className="grid grid-cols-3 gap-4">

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-500">Total Employees</p>
            <h3 className="text-2xl font-bold">
              {companyStats?.totalEmployees || 0}
            </h3>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-500">Total HRs</p>
            <h3 className="text-2xl font-bold">
              {companyStats?.totalHRs || 0}
            </h3>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-gray-500">Departments</p>
            <h3 className="text-2xl font-bold">
              {companyStats?.totalDepartments || 0}
            </h3>
          </div>

        </div>

        <div className="flex justify-end mt-5">

          <button
  onClick={() => {
  setEditForm({
    name: selectedCompany.name,
    email: selectedCompany.email,
    plan: selectedCompany.plan
  });

  setShowEditModal(true);
}}
  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
>
  Edit
</button>
          <button
            onClick={() => setShowCompanyModal(false)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>

        </div>

      </div>

    </div>
    {showEditModal && (

<div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

  <div className="bg-white p-6 rounded-xl w-96">

    <h2 className="text-xl font-bold mb-4">
      Edit Company
    </h2>

    <input
      name="name"
      value={editForm.name}
      onChange={handleChange}
      className="w-full border p-2 mb-3"
      placeholder="Company Name"
    />

    <input
      name="email"
      value={editForm.email}
      onChange={handleChange}
      className="w-full border p-2 mb-3"
      placeholder="Company Email"
    />

    <select
      name="plan"
      value={editForm.plan}
      onChange={handleChange}
      className="w-full border p-2 mb-3"
    >
      <option value="free">Free</option>
      <option value="pro">Pro</option>
    </select>

    <div className="flex justify-end gap-2">

      <button
        onClick={() => setShowEditModal(false)}
        className="bg-gray-300 px-3 py-1 rounded"
      >
        Cancel
      </button>

      <button
        onClick={handleUpdateCompany}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        Save
      </button>

    </div>

  </div>

</div>

)}
    </>
  );
  
};

export default CompanyDetailsModal;