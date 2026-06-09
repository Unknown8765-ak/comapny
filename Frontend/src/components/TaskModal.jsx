// src/components/TaskModal.jsx

function TaskModal({
  showTaskModal,
  setShowTaskModal,
  taskData,
  setTaskData,
  employees,
  handleCreateTask,
}) {
  if (!showTaskModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">

        <h2 className="text-2xl font-bold mb-4">
          Create Task
        </h2>

        <input
          type="text"
          placeholder="Task Title"
          value={taskData.title}
          onChange={(e) =>
            setTaskData({
              ...taskData,
              title: e.target.value,
            })
          }
          className="w-full border p-3 rounded-lg mb-3"
        />

        <textarea
          placeholder="Task Description"
          value={taskData.description}
          onChange={(e) =>
            setTaskData({
              ...taskData,
              description: e.target.value,
            })
          }
          className="w-full border p-3 rounded-lg mb-3"
          rows="4"
        />

        <select
          value={taskData.assignedTo}
          onChange={(e) =>
            setTaskData({
              ...taskData,
              assignedTo: e.target.value,
            })
          }
          className="w-full border p-3 rounded-lg mb-3"
        >
          <option value="">Select Employee</option>

          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={taskData.deadline}
          onChange={(e) =>
            setTaskData({
              ...taskData,
              deadline: e.target.value,
            })
          }
          className="w-full border p-3 rounded-lg mb-3"
        />

        <input
          type="file"
          onChange={(e) =>
            setTaskData({
              ...taskData,
              file: e.target.files[0],
            })
          }
          className="w-full border p-3 rounded-lg mb-4"
        />

        <div className="flex justify-end gap-3">

          <button
            onClick={() => setShowTaskModal(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleCreateTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Create Task
          </button>

        </div>

      </div>

    </div>
  );
}

export default TaskModal;   