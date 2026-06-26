import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { createTaskAPI } from "../features/tasks/tasksAPI.js"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout  } from "../features/auth/authSlice"


import { getDepartmentsAPI } from "../features/departments/departmentAPI.js"
import {getAllEmployeesAPI,deleteEmployeeAPI,getSingleEmployeeAPI,createEmployeeAPI} from "../features/users/usersAPI";
import { getAllTasksAPI,deleteTaskAPI,addCommentAPI} from "../features/tasks/tasksAPI";
import {getAllRequirementsAPI,sendToAdminAPI} from "../features/requirements/requirementsAPI";
import { getNotifications , markAsRead } from "../features/notification/notificationsAPI.js"
import { getAllLeavesAPI,updateLeaveStatusAPI } from "../features/users/leaveAPI.js";
import { getEmployeeSalaryDetailsAPI,markSalaryPaidAPI } from "../features/users/salaryAPI"
import LogoutButton from "../components/LogoutButton.jsx"
import EmployeeDetailsModal from "../components/EmployeeDetailsModal";
import TaskModal from "../components/TaskModal.jsx"

export default function HRDashboard() {
const dispatch = useDispatch()
const navigate = useNavigate()
const { user } = useSelector(state => state.auth)
const [search, setSearch] = useState("")
const [statusFilter, setStatusFilter] = useState("")
const [dateFilter, setDateFilter] = useState("")
const [employeeSearch, setEmployeeSearch] = useState("")
  const [active, setActive] = useState("dashboard")
  const [profile, setProfile] = useState(null)
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [employees, setEmployees] = useState([])
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const [commentText, setCommentText] = useState("")
  const [requirements, setRequirements] = useState([])
  const [departments, setDepartments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [leaves, setLeaves] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
const [employeeSalary, setEmployeeSalary] = useState([])
const [showEmployeeModal, setShowEmployeeModal] = useState(false)
const [employeeLeaves, setEmployeeLeaves] = useState([])
const [showTaskView, setShowTaskView] = useState(false)

const totalLeaves = employeeLeaves.length

const paidLeaves = employeeLeaves.filter(
  leave =>
    leave.type === "paid" &&
    leave.status === "approved"
).length

const unpaidLeaves = employeeLeaves.filter(
  leave =>
    leave.type !== "paid" &&
    leave.status === "approved"
).length


  const filteredTasks = tasks.filter(task => {

  const matchSearch =
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.assignedTo?.name?.toLowerCase().includes(search.toLowerCase())

  const matchStatus =
    statusFilter ? task.status === statusFilter : true

  const matchDate =
    dateFilter
      ? new Date(task.deadline).toLocaleDateString("en-IN") ===
        new Date(dateFilter).toLocaleDateString("en-IN")
      : true

  return matchSearch && matchStatus && matchDate
})

const filteredRequirements = requirements.filter(req => {

  const matchSearch =
    req.title.toLowerCase().includes(search.toLowerCase())

  const matchStatus =
    statusFilter ? req.status === statusFilter : true

  return matchSearch && matchStatus
})

const filteredEmployees = employees.filter(emp =>
  emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
  emp.email.toLowerCase().includes(employeeSearch.toLowerCase())
)
  
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  department: "",
  dob: "",
  monthlySalary: "",
  phone : "",
  address : "",
})

const [taskData, setTaskData] = useState({
  title: "",
  description: "",
  assignedTo: "",
  deadline: "",
  file: null
})
useEffect(() => {
  fetchEmployees()
  fetchDepartments()
}, [])

const fetchDepartments = async () => {
  try {
    const res = await getDepartmentsAPI()
    setDepartments(res.data || [])
  } catch (err) {
    console.error(err)
  }
}

const fetchLeaves = async () => {

  try {

    const res = await getAllLeavesAPI()

    setLeaves(res.data)

  } catch (err) {

    console.log(err.message)

  }
}
const handleLeaveStatus = async (
  leaveId,
  status
) => {
  try {
    await updateLeaveStatusAPI(
      leaveId,
      status
    )
    setLeaves(prev =>
      prev.map(leave =>
        leave._id === leaveId
          ? {
              ...leave,
              status
            }
          : leave
      )
    )
  } catch (err) {
    console.log(err.message)

  }

}
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })
}
const handleTaskChange = (e) => {
  setTaskData({
    ...taskData,
    [e.target.name]: e.target.value
  })
}

const handleCreateTask = async () => {
   const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(taskData.deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  if (deadlineDate < today) {
    alert("Please select today's date or a future date");
    return;
  }
  try {
    const formData = new FormData()

    formData.append("title", taskData.title)
    formData.append("description", taskData.description)
    formData.append("assignedTo", taskData.assignedTo)
    formData.append("deadline", taskData.deadline)

    if (taskData.file) {
      formData.append("file", taskData.file)
    }
    console.log(formData)

    await createTaskAPI(formData)

    alert("Task Created & Assigned")

    setShowTaskModal(false)

    setTaskData({
      title: "",
      description: "",
      assignedTo: "",
      deadline: "",
      file: null
    })

    const res = await getAllTasksAPI()
    setTasks(res.data || [])

  } catch (err) {
    alert(err.message)
  }
}

const handleCreateEmployee = async () => {
  try {
    await createEmployeeAPI(formData)

    alert("Employee Created ✅")

    setShowModal(false)

    setFormData({
      name: "",
      email: "",
      password: "",
      department: "",
      dob: "",
      monthlySalary: "",
      phone : "",
      address : "",
    })

    fetchEmployees() // refresh list

  } catch (err) {
    alert(err.message)
  }
} 

const handleViewEmployee = async (emp) => {

  try {
    const res = await getEmployeeSalaryDetailsAPI(emp._id);
    setSelectedEmployee(res.data.employee);
    setEmployeeSalary(res.data.salaries);
    setEmployeeLeaves(res.data.leaves || [])
    setShowEmployeeModal(true);
  } catch (err) {
    console.log(err);
    alert(err.message);
  }

};

const handleMarkPaid = async (salaryId) => {

  try {

    const res = await markSalaryPaidAPI(salaryId)

    alert("Salary marked as paid ✅")

    // UI update
    setEmployeeSalary(prev =>
      prev.map(sal =>
        sal._id === salaryId
          ? { ...sal, status: "paid" }
          : sal
      )
    )

  } catch (err) {

    alert(err.message)

  }

}
const fetchEmployees = async () => {
  try {
    const res = await getAllEmployeesAPI()
    console.log("reponse : ",res);
    
    const filteredEmployees = res.data.filter(
  (emp) => emp.department?._id === profile?.department?._id
);
    setEmployees(filteredEmployees);
  } catch (err) {
    console.error(err)
  }
}

const fetchNotifications = async () => {
  try {
    const res = await getNotifications();
    console.log(res.data)
    setNotifications(res.data);
  } catch (err) {
    console.log(err.message);
  }
};
const handleAddComment = async () => {
  try {
    await addCommentAPI(selectedTask._id, commentText)

    setCommentText("")
    alert("message send succesfully")

    // 🔥 refresh selected task
    const res = await getAllTasksAPI()
    setTasks(res.data)

    const updated = res.data.find(t => t._id === selectedTask._id)
    setSelectedTask(updated)

  } catch (err) {
    alert(err.message)
  }
}
  // ---------------- Load Data ----------------
  useEffect(() => {

    const loadData = async () => {
      try {
        console.log(user._id)
        const profileRes = await getSingleEmployeeAPI(user._id);
      
        const taskRes = await getAllTasksAPI()
        const reqRes = await getAllRequirementsAPI()
        const leaveRes = await getAllLeavesAPI()
        
        setProfile(profileRes.data)
        setTasks(taskRes.data)
        setRequirements(reqRes.data)
        console.log("leave ",leaveRes.data)
        setLeaves(leaveRes.data)
      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()

  }, [])


useEffect(() => {

  // 🔥 Initial fetch
  fetchNotifications()
  fetchLeaves()

  // 🔥 Polling
  const interval = setInterval(() => {

    fetchNotifications()
    fetchLeaves()

  }, 5000)

  // 🔥 Cleanup
  return () => clearInterval(interval)

}, [])
useEffect(() => {

  if (active === "tasks") {
    getAllTasksAPI()
  }

  if (active === "reports") {
    getAllRequirementsAPI()
  }

  if (active === "leave") {
    fetchLeaves();
  }

}, [active]);

useEffect(() => {
  const handleClick = () => setOpen(false);
  if (open) {
    window.addEventListener("click", handleClick);
  }
  return () => window.removeEventListener("click", handleClick);
}, [open]);

  // ---------------- Stats ----------------
  const completedTasks = tasks.filter(t => t.status === "completed").length
  const pendingTasks = tasks.length - completedTasks

  const handleDelete = async (id) => {
    await deleteEmployeeAPI(id)
    setEmployees(prev => prev.filter(emp => emp._id !== id))
    alert("employee deleted successfully")
  }

  const handleDeleteTask = async (id) => {
    await deleteTaskAPI(id)
    setTasks(prev => prev.filter(tsk => tsk._id !== id))
    alert("tasks deleted successfully")
  }

  const handleSend = async (id) => {
    const res = await sendToAdminAPI(id)
    console.log("send",res)
    alert("request send succesfully");
    setRequirements(prev =>
      prev.map(r => r._id === id ? res.data : r)
    )
  }


  useEffect(() => {
  if (profile) {
    fetchEmployees(); // ✅ ab safe hai
  }
}, [profile]);


  if (loading) return <div className="flex justify-center items-center py-10">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>

  const renderContent = () => {

    if (active === "dashboard") {
      return (
        <>
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          <div className="grid grid-cols-4 gap-6 mb-8">
            <Stat title="Employees" value={employees.length} />
            <Stat title="Total Tasks" value={tasks.length} />
            <Stat title="Completed" value={completedTasks} color="green" />
            <Stat title="Pending" value={pendingTasks} color="red" />
          </div>
        </>
      )
    }

    if (active === "employees") {
  return (
    <>
      {/* 🔥 TOP BAR */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employees</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Employee
        </button>
      </div>
      <div className="flex justify-items-center items-center mb-4">

  <input
    type="text"
    placeholder="Search employee by name/email..."
    value={employeeSearch}
    onChange={(e) => setEmployeeSearch(e.target.value)}
    className="border p-2 m-3.5 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <button
    onClick={() => {
      setEmployeeSearch("")
    }}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    Reset
  </button>

</div>
    
      {/* 🔥 TABLE */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white shadow-sm hover:shadow-md transition rounded-lg">
              <th className="p-2">Name</th>
              <th className="p-2">Role</th>
              <th className="p-2">Salary</th>
              <th className="p-2">Join Date</th>
              <th className="p-">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map(emp => (
              <tr key={emp._id} className="border-b">
                <td className="p-2">{emp.name}</td>
                <td className="p-2">{emp.role}</td>
                <td className="p-2">{emp.monthlySalary}</td>
                <td className="p-2">{new Date(emp.createdAt).toLocaleDateString("en-IN")}</td>
                <td className="p-2">
                  <button
                  className="bg-blue-500 text-white px-3 py-1 rounded m-2"
                  onClick={() => handleViewEmployee(emp)}>
                    View
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded m-1" 
                  onClick={()=>handleDelete(emp._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
        {filteredEmployees.length === 0 && employeeSearch && (
  <p className="text-center text-gray-500 mt-4">
    No employees found 😕
  </p>
)}
      </div>

      <EmployeeDetailsModal
  showEmployeeModal={showEmployeeModal}
  setShowEmployeeModal={setShowEmployeeModal}
  selectedEmployee={selectedEmployee}
  employeeSalary={employeeSalary}
  employeeLeaves={employeeLeaves}
  totalLeaves={totalLeaves}
  paidLeaves={paidLeaves}
  unpaidLeaves={unpaidLeaves}
  handleMarkPaid={handleMarkPaid}
/>
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          
<div className="bg-white p-6 rounded-2xl w-96 shadow-2xl animate-fadeIn">
            <h2 className="text-xl font-bold mb-4">Add Employee</h2>

            <input
              name="name"
              placeholder="Name"
              className="w-full border p-2 mb-3"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              name="email"
              placeholder="Email"
              className="w-full border p-2 mb-3"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full border p-2 mb-3"
              value={formData.password}
              onChange={handleChange}
            />

            <select
              name="department"
              className="w-full border p-2 mb-3"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map(dep => (
                <option key={dep._id} value={dep.name}>
                  {dep.name}
                </option>
              ))}
            </select>

            <input
              name="dob"
              type="date"
              placeholder="DOB"
              className="w-full border p-2 mb-3"
              max={new Date().toISOString().split("T")[0]}
              value={formData.dob}
              onChange={handleChange}
            />
            <input
              name="monthlySalary"
              type="number"
              placeholder="monthlySalary"
              className="w-full border p-2 mb-3"
              value={formData.monthlySalary}
              onChange={handleChange}
            />
            <input
              name="address"
              type="text"
              placeholder="address"
              className="w-full border p-2 mb-3"
              value={formData.address}
              onChange={handleChange}
            />
            <input
              name="phone"
              type="number"
              placeholder="phone"
              className="w-full border p-2 mb-3"
              value={formData.phone}
              onChange={handleChange}
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateEmployee}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Create
              </button>

            </div>

          </div>
        </div>
      )}
      
    </>
  )
}


if (active === "tasks") {
  return (
    <>
      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>

        <button
          onClick={() => setShowTaskModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Task
        </button>
      </div>
      <div className="flex flex-wrap gap-3 mb-4">

  <input
    type="text"
    placeholder="Search task..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border p-2 rounded-lg"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border p-2 rounded-lg"
  >
    <option value="">All Status</option>
    <option value="pending">Pending</option>
    <option value="in_progress">In Progress</option>
    <option value="completed">Completed</option>
  </select>

  <input
    type="date"
    value={dateFilter}
    onChange={(e) => setDateFilter(e.target.value)}
    className="border p-2 rounded-lg"
  />

  <button
    onClick={() => {
      setSearch("")
      setStatusFilter("")
      setDateFilter("")
    }}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"

  >
    Reset
  </button>

</div>

      {/* 🔥 Table */}
      <div className="bg-white rounded-2xl shadow p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-2">Task</th>
              <th className="p-2">Assigned</th>
              <th className="p-2">Deadline</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.map(task => (
              <tr key={task._id} className="border-b hover:bg-gray-50 transition">

                <td className="p-2 font-medium">{task.title}</td>

                <td className="p-2">
                  {task.assignedTo?.name || "—"}
                </td>

                <td className="p-2">
                  {new Date(task.deadline).toLocaleDateString("en-IN")}
                </td>

                <td className={`p-2 font-semibold ${
                  task.status === "completed"
                    ? "text-green-600"
                    : task.status === "in_progress"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}>
                  {task.status}
                </td>

                <td className="p-2 space-x-2">
                  

                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => {
                    setSelectedTask(task)
                    setShowTaskView(true)
                  }}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>

                </td>

              </tr>
            ))}
          </tbody>
        </table>
            {filteredTasks.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No tasks found 😕
              </p>
            )}
  {selectedTask && (

      <div className="mt-6 bg-gray-50 p-5 rounded-2xl border shadow">

        <h3 className="font-bold text-xl mb-4">
          {selectedTask.title}
        </h3>

        <p className="mb-2">
          Assigned To:
          {" "}
          {selectedTask.assignedTo?.name}
        </p>

        <p className="mb-2">
          Status:
          {" "}
          <span className="font-semibold">
            {selectedTask.status}
          </span>
        </p>

        <p className="mb-2">
          Progress:
          {" "}
          {selectedTask.progress || 0}%
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">

          <div
            className="bg-green-500 h-3 rounded-full"
            style={{
              width: `${selectedTask.progress || 0}%`
            }}
          />

        </div>

        {/* Attachments */}

    {selectedTask.attachments?.length > 0 && (

          <div className="mb-4">

            <h4 className="font-semibold mb-2">
              Attachments 📎
            </h4>

            {selectedTask.attachments.map((file, i) => (

              <a
                key={i}
                href={file.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="block text-blue-600 underline"
              >
                {file.fileName}
              </a>

            ))}

          </div>

        )}

        {/* Comments */}

        <div className="mt-6">

          <h3 className="font-bold mb-2">
            Comments 💬
          </h3>

          <div className="max-h-40 overflow-y-auto space-y-2 mb-2">

            {selectedTask.comments?.length === 0 && (
              <p className="text-gray-500 text-sm">
                No comments yet
              </p>
            )}

            {selectedTask.comments?.map((c, i) => (

              <div
                key={i}
                className="bg-white p-3 rounded shadow-sm"
              >

                <p className="font-semibold text-indigo-600">
                  {c.user?.name}
                </p>

                <p>{c.message}</p>

                <p className="text-xs text-gray-500">
                  {new Date(c.createdAt)
                    .toLocaleString("en-IN")}
                </p>

              </div>

            ))}

          </div>

          {/* Add Comment */}

          <div className="flex gap-2">

            <input
              type="text"
              value={commentText}
              onChange={(e) =>
                setCommentText(e.target.value)
              }
              placeholder="Write a comment..."
              className="flex-1 border p-2 rounded"
            />

            <button
              onClick={handleAddComment}
              className="bg-blue-600 text-white px-3 rounded"
            >
              Send
            </button>

          </div>

        </div>

        <button
          onClick={() => setSelectedTask(null)}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>

      </div>

)}

      </div>
      <TaskModal
  showTaskModal={showTaskModal}
  setShowTaskModal={setShowTaskModal}
  taskData={taskData}
  setTaskData={setTaskData}
  employees={employees}
  handleCreateTask={handleCreateTask}
/>
      
    </>
  )
}
    if (active === "reports") {
  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Requirement</h1>
      </div>
      <div className="flex gap-3 mb-4">

  <input
    type="text"
    placeholder="Search requirement..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border p-2 rounded-lg"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border p-2 rounded-lg"
  >
    <option value="">All</option>
    <option value="pending">Pending</option>
    <option value="approved">Approved</option>
    <option value="rejected">Rejected</option>
  </select>

</div>

      {/* 🔥 TABLE CONTAINER */}
      <div className="bg-white p-6 rounded-2xl shadow">

        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-3">Title</th>
              <th className="p-3">RaisedBy</th>
              <th className="p-3">Status</th>
              <th className="p-3">Raised Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequirements.map(req => (
              <tr
                key={req._id}
                className="border-b hover:bg-gray-50 transition"
              >
                
                <td className="p-3 font-medium">
                  {req.title}
                </td>
                <td className="p-3 font-medium">
                  {req.raisedBy?.name || "—"}
                </td>
                

                <td className={`p-3 font-semibold ${
                  req.status === "approved"
                    ? "text-green-600"
                    : req.status === "pending"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}>
                  {req.status}
                </td>
                 <td className="p-3 font-medium">
                  {new Date(req.createdAt).toLocaleDateString("en-IN")}
                </td>

                <td className="p-3">
                  <button
                    disabled={req.sentToAdmin}
                    onClick={() => handleSend(req._id)}
                    className={`px-4 py-1 rounded-lg transition ${
                      req.sentToAdmin
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    {req.sentToAdmin ? "Sent" : "Send"}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>


        {/* 🔥 EMPTY STATE */}
        {filteredRequirements.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No reports available
          </div>
        )}

      </div>
      <h2 className="text-xl font-bold mt-8 mb-4">
        Employee Leave Requests
      </h2>

      <div className="space-y-4">

        {leaves.length === 0 && (
          <p className="text-gray-500">
            No leave requests
          </p>
        )}

        {leaves.map((leave) => (

          <div
            key={leave._id}
            className="border rounded-xl p-4 bg-white shadow-sm"
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="font-semibold">
                  {leave.employee?.name}
                </p>

                <p className="text-sm text-gray-500 capitalize">
                  {leave.type} Leave
                </p>

              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  leave.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : leave.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {leave.status}
              </span>

            </div>

            <p className="mt-3 text-sm text-gray-700">
              {leave.reason}
            </p>

            <p className="text-xs text-gray-500 mt-2">
  {new Date(leave.fromDate).toLocaleDateString("en-IN")}
  {" "}→{" "}
  {new Date(leave.toDate).toLocaleDateString("en-IN")}
</p>

{leave.status === "pending" && (
  <div className="mt-3 flex gap-2">

    <button
      onClick={() =>
        handleLeaveStatus(
          leave._id,
          "approved"
        )
      }
      className="bg-green-600 text-white px-3 py-1 rounded"
    >
      Approve
    </button>

    <button
      onClick={() =>
        handleLeaveStatus(
          leave._id,
          "rejected"
        )
      }
      className="bg-red-600 text-white px-3 py-1 rounded"
    >
      Reject
    </button>

  </div>
)}

          </div>

        ))}

      </div>
    </div>
  );
}

    if (active === "profile") {
      return (
        <>
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>

          <div className="bg-white p-6 rounded-xl shadow max-w-md">
            <Field label="Name" value={profile?.name} />
            <Field label="Email" value={profile?.email} />
            <Field label="Department" value={profile?.department?.name} />
            <Field label="Role" value={profile?.role} />
            <Field label="Company" value={profile?.company} />
            <Field label="DOB" value={new Date(profile?.dob).toLocaleDateString("en-IN")}/>
          </div>
        </>
      )
    }
  }

  return (
   <div className="flex min-h-screen bg-linear-to-br from-gray-100 to-gray-200">

      <div className="w-64 bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 
text-white p-5 shadow-2xl flex flex-col">

        <h2 className="text-2xl font-bold mb-8 tracking-wide">
  🚀 HR Panel
</h2>

        <SidebarItem label="Dashboard" id="dashboard" setActive={setActive} />
        <SidebarItem label="Employees" id="employees" setActive={setActive} />
        <SidebarItem label="Tasks" id="tasks" setActive={setActive} />
        <SidebarItem label="Requirement" id="reports" setActive={setActive} />
        <SidebarItem label="Profile" id="profile" setActive={setActive} />

{/* Bottom */}
  <div className="mt-auto p-4">
    <LogoutButton />
  </div>
      </div>
       

      {/* Content */}
      <div className="flex-1 p-8">

  {/* 🔔 Notification Bell */}
  <div className="flex justify-end mb-4 relative">

    <div
      className="relative cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
      }}
    >

      <div className="text-2xl bg-white shadow-md p-2 rounded-full hover:scale-110 transition">
  🔔
</div>

      {/* 🔴 Unread count */}
      {notifications.filter(n => !n.isRead).length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">
          {notifications.filter(n => !n.isRead).length}
        </span>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg max-h-80 overflow-y-auto z-50">

          {notifications.length === 0 && (
            <p className="p-3 text-gray-500">No notifications</p>
          )}

          {notifications.map(n => (
            

            <div
              key={n._id}
              onClick={async (e) => {
                e.stopPropagation();

                await markAsRead(n._id);

                setNotifications(prev =>
                  prev.map(item =>
                    item._id === n._id
                      ? { ...item, isRead: true }
                      : item
                  )
                );

                // 🔥 HR redirect logic
            if (n.type === "task_assigned" ||
              n.type ===  "task_update_added"||
              n.type === "task_comment"
            ) {
              setActive("tasks");
            }

            if (
              n.type === "requirement_raised" ||
              n.type === "requirement_rejected" ||
              n.type === "requirement_forwarded"
            ) {
              setActive("reports");
            }

            if (n.type === "leave_applied"||
              n.type === "leave_approved"||
              n.type === "leave_rejected"
            ) {
              setActive("reports");
            }

              }}
              className={`p-3 border-b cursor-pointer ${
                n.isRead ? "bg-gray-100" : "bg-blue-50 font-semibold"
              }`}
            >
              <p className="font-semibold text-sm">{n.title}</p>
              <p className="text-xs text-gray-600">{n.message}</p>
            </div>

          ))}

        </div>
      )}

    </div>

  </div>

  {/* 🔽 Existing Content */}
  {renderContent()}

      </div>
    </div>
  )
}

// ---------------- UI Components ----------------

function SidebarItem({ label, id, setActive }) {
  return (
    <button
      onClick={() => setActive(id)}
      className="block w-full text-left px-3 py-2 rounded-lg 
hover:bg-white/10 hover:translate-x-1 transition-all duration-200"
    >
      {label}
    </button>
  )
}

function Stat({ title, value, color }) {
  return (
    <div className="bg-linear-to-r from-white to-gray-100 
p-5 rounded-2xl shadow-lg hover:scale-105 transition">
      <h3 className="text-gray-500 flex items-center gap-2">
  📊 {title}
</h3>
      <p className={`text-2xl font-bold ${
        color === "green"
          ? "text-green-600"
          : color === "red"
          ? "text-red-500"
          : ""
      }`}>
        {value}
      </p>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div className="mb-3">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="font-semibold">{value || "-"}</p>
    </div>
  )
}
