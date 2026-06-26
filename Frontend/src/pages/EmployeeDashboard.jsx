import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout  } from "../features/auth/authSlice"

import { getSingleEmployeeAPI } from "../features/users/usersAPI.js"
import { getEmployeeTasksAPI ,addTaskUpdateAPI ,addCommentAPI} from "../features/tasks/tasksAPI.js"
import {getMyRequirementsAPI,createRequirementAPI} from "../features/requirements/requirementsAPI.js"
import { getNotifications, markAsRead } from "../features/notification/notificationsAPI.js";
import { createLeaveAPI, getMyLeavesAPI } from "../features/users/leaveAPI.js"
import {getMySalaryAPI} from "../features/users/salaryAPI.js"
import LogoutButton from "../components/LogoutButton.jsx"

export default function EmployeePanel() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("")
  const [commentText, setCommentText] = useState("")
  const [notifications, setNotifications] = useState([]);
  const [active, setActive] = useState("dashboard")
  const [employee, setEmployee] = useState(null)
  const [tasks, setTasks] = useState([])
  const [requirements, setRequirements] = useState([])
  const [salaries, setSalaries] = useState([])

  const [loading, setLoading] = useState(true)

const [leaves, setLeaves] = useState([])
const [leaveForm, setLeaveForm] = useState({
  type: "casual",
  reason: "",
  fromDate: "",
  toDate: ""
})  

  const [form, setForm] = useState({
    title: "",
    description: ""
  })

const fetchSalaries = async () => {
  try {
    const res = await getMySalaryAPI()
    console.log(res)
    setSalaries(res.data)
  } catch (err) {
    console.log(err.message)

  }
}
  const fetchEmployee = async () => {
    try {

      const res = await getSingleEmployeeAPI(user._id)
      setEmployee(res.data)
    } catch (err) {
      console.log(err.message)

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

  const fetchTasks = async () => {
    try {

      const res = await getEmployeeTasksAPI()
      setTasks(res.data)
    } catch (err) {

      console.log(err.message)

    }
  }


  const fetchRequirements = async () => {
    try {

      const res = await getMyRequirementsAPI()
      console.log("DATA : ",res.data)
      console.log("RES : ",res)
      setRequirements(res.data)
    } catch (err) {
      console.log(err.message)

    }
  }
    const fetchLeaves = async () => {
  try {

    const res = await getMyLeavesAPI()
    console.log("emp leave",res.data)
    setLeaves(res.data)

  } catch (err) {

    console.log(err.message)

  }
}

const handleApplyLeave = async (e) => {

  e.preventDefault()

  try {

    const res = await createLeaveAPI(leaveForm)

    setLeaves(prev => [res.data, ...prev])

    setLeaveForm({
      type: "casual",
      reason: "",
      fromDate: "",
      toDate: ""
    })

    alert("Leave applied successfully 🔥")

  } catch (err) {

    alert(err.message)

  }
}

const handleAddComment = async () => {
  try {
    if (!selectedTask) return alert("No task selected")

    await addCommentAPI(selectedTask._id, commentText)

    setCommentText("")
    alert("message send successfully");
    fetchTasks()

  } catch (error) {
    alert(error.message)
    }
  }

 const handleTaskUpdate = async () => {

  if (!selectedTask) {
    alert("No task selected ❌")
    return
  }
  console.log(selectedTask._id);
  try {
    await addTaskUpdateAPI(
      selectedTask._id,
      {
        progress,
        message
      }
    )

    alert("Task updated 🔥")

    setSelectedTask(null)
    setMessage("")
    fetchTasks()

  } catch (err) {
    console.log(err.message)
  }
}

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {
      const res = await createRequirementAPI(form)
      setRequirements(prev => [...prev, res.data])
      setForm({
        title: "",
        description: ""
      })
      alert("requirement request done : ")
    } catch (err) {

      console.log(err.message)

    }

  }

  useEffect(() => {

    const loadData = async () => {

      await fetchEmployee()
      await fetchTasks()
      await fetchRequirements()
      await fetchLeaves()
      await fetchSalaries()

      setLoading(false)
    }

    loadData()

  }, [])
 
  
useEffect(() => {
  fetchRequirements()

  const interval = setInterval(() => {
    fetchRequirements()
  }, 5000)

  return () => clearInterval(interval)
}, [])

useEffect(() => {
  fetchNotifications();

  const interval = setInterval(() => {
    fetchNotifications();
  }, 5000);

  return () => clearInterval(interval);
}, []);

  useEffect(() => {

  if (active === "tasks") {
    fetchTasks();
  }

  if (active === "reports") {
    fetchRequirements();
  }

  if (active === "leave") {
    fetchLeaves();
  }
  if (active === "salary") {
  fetchSalaries()
}

}, [active]);

useEffect(() => {
  const handleClick = () => setOpen(false);
  if (open) {
    window.addEventListener("click", handleClick);
  }
  return () => window.removeEventListener("click", handleClick);
}, [open]);



  const completed = tasks.filter(t => t.status === "completed").length
  const pending = tasks.filter(t => t.status !== "completed").length


const renderContent = () => {
  if (loading) return <div className="flex justify-center items-center py-10">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
    if (active === "dashboard") {
      return (
        <>
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Tasks" value={tasks.length} />
            <StatCard title="Completed Tasks" value={completed} />
            <StatCard title="Pending Tasks" value={pending} />
            <StatCard title="My Requirements" value={requirements.length} />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">
              Task Progress
            </h2>
            <Progress
              label="Completed"
              value={(completed / (tasks.length || 1)) * 100}
            />

            <Progress
              label="Pending"
              value={(pending / (tasks.length || 1)) * 100}
            />

          </div>
        </>
      )

    }

    if (active === "tasks") {

      return (
        <>
          <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
          <div className="bg-white rounded-2xl shadow p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b hover:bg-gray-50 transition">
                  <th className="p-2">Task</th>
                  <th className="p-2">Deadline</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Progress</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task._id} className="border-b">
                    <td className="p-2">{task.title}</td>
                    <td className="p-2">{new Date(task.deadline).toLocaleDateString("en-IN")}</td>
                    <td>{task.status}</td>
                    <td>{task.progress || 0}%</td>

                    <td>
                      <button
                        onClick={() => {
                          setSelectedTask(task)
                          setProgress(task.progress || 0)
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
      {selectedTask && (
 <div className="mt-6 bg-white p-5 rounded-2xl shadow-xl border">

    <h3 className="font-bold mb-2">
    Task: {selectedTask.title}
    </h3>

    <p>Progress: {progress}%</p>

    {/* 📁 Attachments */}
    {selectedTask.attachments?.length > 0 && (
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Attachments 📎</h4>

        {selectedTask.attachments.map((file, index) => (
          <a
            key={index}
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

    {/* 🔥 Slider */}
    <input
      type="range"
      min="0"
      max="100"
      value={progress}
      onChange={(e) => setProgress(Number(e.target.value))}
      className="w-full"
    />

    {/* 🔥 Message */}
    <textarea
      placeholder="Write update..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      className="w-full border p-2 mt-2"
    />

    {/* 🔥 Buttons */}
    <div className="mt-2 space-x-2">

      <button
        onClick={handleTaskUpdate}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg transition"
      >
        Submit
      </button>

      <button
        onClick={() => setSelectedTask(null)}
        className="bg-gray-400 text-white px-3 py-1 rounded"
      >
        Cancel
      </button>

    </div>

    <div className="mt-6">
      <h3 className="font-bold mb-2">Comments 💬</h3>

      <div className="max-h-40 overflow-y-auto space-y-2 mb-2">

        {selectedTask.comments?.length === 0 && (
          <p className="text-gray-500 text-sm">No comments yet</p>
        )}

        {selectedTask.comments?.map((c, i) => (
          <div key={i} className="bg-gray-50 p-3 rounded-lg shadow-sm">

            <p className="text-sm font-semibold text-indigo-600">
              {c.user?.name || "User"}
            </p>

            <p className="text-sm">{c.message}</p>

            <p className="text-xs text-gray-500">
              {new Date(c.createdAt).toLocaleString("en-IN")}
            </p>

          </div>
        ))}

      </div>

      {/* ✍️ Add Comment */}
      <div className="flex gap-2">

        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddComment()
          }}
        />

        <button
          onClick={handleAddComment}
          className="bg-blue-600 text-white px-3 rounded"
        >
          Send
        </button>

      </div>
    </div>

  </div>
)}
                </div>
              </>
      )

    }
  if (active === "requirements") {
    return (
    <>
      <h1 className="text-2xl font-bold mb-6">
        Requirements
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Left Side - Raise Requirement */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-semibold mb-4">
            Raise Requirement
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Requirement Title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value
                })
              }
              className="w-full border p-2 rounded"
              required
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value
                })
              }
              className="w-full border p-2 rounded"
              required
            />

            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Submit Requirement
            </button>
          </form>

        </div>

        {/* Right Side - My Requirements */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-xl font-semibold mb-4">
            My Requirements
          </h2>

          <ul className="space-y-3">

            {requirements.length === 0 && (
              <p className="text-gray-500">
                No requirements found
              </p>
            )}

            {requirements.map(req => (

              <li
                key={req._id}
                className="flex justify-between border p-3 rounded"
              >
                <span>{req.title}</span>

                <span
                  className={`font-semibold ${
                    req.status === "approved"
                      ? "text-green-600"
                      : req.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {req.status}
                </span>

              </li>

            ))}

          </ul>

        </div>

      </div>
    </>
  )
}

if (active === "salary") {

  const currentSalary = salaries[0]

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">
        Salary Details
      </h1>

      {/* Current Salary Card */}
      {currentSalary && (

        <div className="bg-white p-6 rounded-2xl shadow mb-6">

          <h2 className="text-xl font-semibold mb-4">
            Current Month Salary
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <div>
              <p className="text-gray-500">Base Salary</p>
              <p className="font-bold">
                ₹{currentSalary.baseSalary}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Net Salary</p>
              <p className="font-bold text-green-600">
                ₹{currentSalary.netSalary}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-bold capitalize">
                {currentSalary.status}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                Present Days
              </p>
              <p>
                {currentSalary.presentDays}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                Paid Leaves
              </p>
              <p>
                {currentSalary.paidLeaves}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                Unpaid Leaves
              </p>
              <p>
                {currentSalary.unpaidLeaves}
              </p>
            </div>

          </div>

        </div>

      )}

      {/* Salary History */}

      <div className="bg-white p-6 rounded-2xl shadow">

        <h2 className="text-xl font-semibold mb-4">
          Salary History
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="p-2 text-left">
                Month
              </th>

              <th className="p-2 text-left">
                Base Salary
              </th>

              <th className="p-2 text-left">
                Net Salary
              </th>

              <th className="p-2 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {salaries.map((salary) => (

              <tr
                key={salary._id}
                className="border-b"
              >

                <td className="p-2">
                  {salary.month}/{salary.year}
                </td>

                <td className="p-2">
                  ₹{salary.baseSalary}
                </td>

                <td className="p-2">
                  ₹{salary.netSalary}
                </td>

                <td className="p-2">

                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      salary.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : salary.status === "processed"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {salary.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </>
  )
}
     if (active === "leave") {

  return (

    <>
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Apply Leave
        </h1>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* 🔥 Leave Form */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <form
            onSubmit={handleApplyLeave}
            className="space-y-4"
          >

            <select
              value={leaveForm.type}
              onChange={(e) =>
                setLeaveForm({
                  ...leaveForm,
                  type: e.target.value
                })
              }
              className="w-full border p-2 rounded"
            >

              <option value="casual">Casual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="paid">Paid Leave</option>

            </select>

            <textarea
              placeholder="Reason"
              value={leaveForm.reason}
              onChange={(e) =>
                setLeaveForm({
                  ...leaveForm,
                  reason: e.target.value
                })
              }
              className="w-full border p-2 rounded"
              required
            />

            <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="text-sm text-gray-500">
                  From Date
                </label>

                <input
                  type="date"
                  value={leaveForm.fromDate}
                  onChange={(e) =>
                    setLeaveForm({
                      ...leaveForm,
                      fromDate: e.target.value
                    })
                  }
                  className="w-full border p-2 rounded"
                  required
                />

              </div>

              <div>

                <label className="text-sm text-gray-500">
                  To Date
                </label>

                <input
                  type="date"
                  value={leaveForm.toDate}
                  onChange={(e) =>
                    setLeaveForm({
                      ...leaveForm,
                      toDate: e.target.value
                    })
                  }
                  className="w-full border p-2 rounded"
                  required
                />

              </div>

            </div>

            <button className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-2 rounded-lg">

              Apply Leave

            </button>

          </form>

        </div>

        {/* 🔥 Leave History */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-lg font-semibold mb-4">
            Leave History
          </h2>

          <div className="space-y-3">

            {leaves.length === 0 && (
              <p className="text-gray-500">
                No leaves applied
              </p>
            )}

            {leaves.map((leave) => (

              <div
                key={leave._id}
                className="border rounded-xl p-4"
              >

                <div className="flex justify-between">

                  <p className="font-semibold capitalize">
                    {leave.type} Leave
                  </p>

                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
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

                <p className="text-sm text-gray-600 mt-2">
                  {leave.reason}
                </p>

                <p className="text-xs text-gray-500 mt-2">

                  {new Date(leave.fromDate).toLocaleDateString("en-IN")}
                  {" "}→{" "}
                  {new Date(leave.toDate).toLocaleDateString("en-IN")}

                </p>

              </div>

            ))}

          </div>

        </div>

      </div>
    </>
  )
}

    // ---------------- Profile

    if (active === "profile") {

      return (
        <>
          <h1 className="text-2xl font-bold mb-6">
            Profile
          </h1>

          <div className="bg-white shadow rounded-2xl p-6 max-w-md">

            <ProfileField
              label="Name"
              value={employee?.name}
            />

            <ProfileField
              label="Email"
              value={employee?.email}
            />

            <ProfileField
              label="Department"
              value={employee?.department?.name}
            />

            <ProfileField
              label="Role"
              value={employee?.role}
            />
            <ProfileField
              label="Company"
              value={employee?.company}
            />

            <ProfileField
              label="Date of Birth"
              value={new Date(employee?.dob).toLocaleDateString("en-IN")}
            />

          </div>
        </>
      )

    }

  }

  return (

   <div className="min-h-screen flex bg-linear-to-br from-gray-100 to-gray-200">

      {/* Sidebar */}
      <div className="w-64 bg-linear-to-b from-gray-900 to-gray-800 text-white p-5 shadow-xl flex flex-col min-h-screen">

       <h2 className="text-2xl font-bold mb-8 tracking-wide">
  🚀 Employee Panel
</h2>

        <nav className="space-y-2">

          <SidebarItem label="Dashboard" id="dashboard" setActive={setActive}/>
          <SidebarItem label="My Tasks" id="tasks" setActive={setActive}/>
          <SidebarItem label="My Requirements" id="requirements" setActive={setActive}/>
          <SidebarItem label="Salary" id="salary" setActive={setActive}/>
          <SidebarItem label="Apply Leave" id="leave" setActive={setActive}/> 
          <SidebarItem label="Profile" id="profile" setActive={setActive}/>

        </nav>
    <div className="mt-auto p-4">
   <LogoutButton />
  </div>
      </div>

      {/* Content */}

     <div className="flex-1 p-8">

  {/* 🔔 Notification Bell (TOP RIGHT) */}
  <div className="flex justify-end mb-4 relative">

    <div className="relative cursor-pointer"
     onClick={(e) => {
  e.stopPropagation();
  setOpen(!open);
}}
     >

      <span className="text-2xl hover:scale-110 transition cursor-pointer">🔔</span>

      {/* 🔴 Unread count */}
      {notifications.filter(n => !n.isRead).length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">
          {notifications.filter(n => !n.isRead).length}
        </span>
      )}

      {/* Dropdown */}
      {open &&(
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
             if (n.type === "task_assigned" ||
              n.type === "task_comment"
            ) {
              setActive("tasks");
            }

            if (
              n.type === "requirement_rejected" ||
              n.type === "requirement_forwarded"
            ) {
              setActive("requirements");
            }

            if (
              n.type === "leave_approved"||
              n.type === "leave_rejected"
            ) {
              setActive("leave");
            }
            }}
            className={`p-3 border-b cursor-pointer ${
              n.isRead ? "bg-gray-100" : "bg-white"
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


// UI components

function SidebarItem({ label, id, setActive }) {

  return (
    <button
      onClick={() => setActive(id)}
      className="block w-full text-left px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
    >
      {label}
    </button>
  )

}


function StatCard({ title, value }) {

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300">

      <p className="text-gray-500">{title}</p>

     <p className="text-3xl font-bold text-indigo-600">{value}</p>

    </div>
  )

}


function Progress({ label, value }) {

  return (
    <div className="mb-4">

      <p className="text-sm mb-1">{label}</p>

      <div className="w-full bg-gray-200 h-3 rounded-full">

        <div
          className="bg-linear-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />

      </div>

    </div>
  )

}


function ProfileField({ label, value }) {

  return (
    <div className="mb-3">

      <p className="text-gray-500 text-sm">{label}</p>

      <p className="font-semibold">{value}</p>

    </div>
  )

}
