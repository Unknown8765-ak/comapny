const EmployeeDetailsModal = ({
  showEmployeeModal,
  setShowEmployeeModal,
  selectedEmployee,
  employeeSalary,
  employeeLeaves,
  totalLeaves,
  paidLeaves,
  unpaidLeaves,
  handleMarkPaid,
}) => {

  if (!showEmployeeModal || !selectedEmployee) return null;

  return (

  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

    <div className="bg-white w-175 p-6 rounded-2xl shadow-xl">

      <h2 className="text-2xl font-bold mb-4">
        Employee Details
      </h2>

      {/* BASIC INFO */}

      <div className="grid grid-cols-2 gap-4 mb-6">
        

        <div>
          <p className="text-gray-500">Name</p>
          <p className="font-semibold">
            {selectedEmployee.name}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-semibold">
            {selectedEmployee.email}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Department</p>
          <p className="font-semibold">
            {selectedEmployee.department?.name}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Role</p>
          <p className="font-semibold">
            {selectedEmployee.role}
          </p>
        </div>
         <div className="bg-blue-50 p-4 rounded-lg">
    <p className="text-gray-500">Total Leaves</p>
    <p className="text-2xl font-bold">{totalLeaves}</p>
  </div>

  <div className="bg-green-50 p-4 rounded-lg">
    <p className="text-gray-500">Paid Leaves</p>
    <p className="text-2xl font-bold">{paidLeaves}</p>
  </div>

  <div className="bg-red-50 p-4 rounded-lg">
    <p className="text-gray-500">Unpaid Leaves</p>
    <p className="text-2xl font-bold">{unpaidLeaves}</p>
  </div>
        <div>
  <p className="text-gray-500">Monthly Salary</p>
  <p className="font-semibold">
    ₹{selectedEmployee.monthlySalary}
  </p>
</div>

      </div>
      <div className="bg-blue-50 border rounded-xl p-4 mb-5">

  <h3 className="text-lg font-bold mb-3">
    Current Month Salary
  </h3>

  <div className="grid grid-cols-2 gap-4">

    <div>
      <p className="text-gray-500">Base Salary</p>
      <p className="font-semibold">
        ₹{selectedEmployee.monthlySalary}
      </p>
    </div>

    <div>
      <p className="text-gray-500">Status</p>
      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
        Pending
      </span>
    </div>

  </div>

</div>

      {/* SALARY TABLE */}

      <h3 className="text-xl font-bold mb-3">
        Salary History
      </h3>

      <table className="w-full border">

        <thead>

          <tr className="bg-gray-100">

            <th className="p-2">Month</th>
            <th className="p-2">Salary</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>

          </tr>

        </thead>

        <tbody>

          {employeeSalary.map((sal) => (

            <tr key={sal._id} className="border-b">

              <td className="p-2">
                {sal.month}/{sal.year}
              </td>

              <td className="p-2">
                ₹{sal.netSalary}
              </td>

              <td className="p-2">

                <span className={`px-2 py-1 rounded text-sm ${
                  sal.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>

                  {sal.status}

                </span>

              </td>

              <td className="p-2">

                {sal.status !== "paid" && (

                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => handleMarkPaid(sal._id)}
                  >
                    Mark Paid
                  </button>

                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <div className="flex justify-end mt-5">

        <button
          onClick={() => setShowEmployeeModal(false)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>

      </div>

    </div>

  </div>

)
};

export default EmployeeDetailsModal;