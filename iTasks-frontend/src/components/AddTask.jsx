import axios from "axios";
import "/src/index.css";
import { useContext, useState } from "react";
import { TaskContext, URL } from "../context/Context";

function AddTask() {
  const { addedTask, setAddedTask, refreshData } = useContext(TaskContext);
  const [labelsInput, setLabelsInput] = useState("");
  const [task, setTask] = useState({
    taskId: 0,
    header: "",
    content: "",
    addedDate: new Date(),
    endDate: "1970-01-01",
    completed: false,
    labels: [],
    endTime: "00:00:00",
    priority: 0,
  });

  const handleLabels = (value) => {
    setLabelsInput(value);
    const labelsSet = value.split(" ");
    setTask({ ...task, labels: labelsSet });
  };

  const handlePriorityChange = (e) => {
    const priorityValue = parseInt(e.target.value);
    setTask({ ...task, priority: priorityValue });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(task);
    axios
      .post(`${URL}/tasks`, task, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        alert("Task added successfully");
        // Reset form and close modal
        setTask({
          taskId: 0,
          header: "",
          content: "",
          addedDate: new Date(),
          endDate: "1970-01-01",
          completed: false,
          labels: [],
          endTime: "00:00:00",
          priority: 0,
        });
        setLabelsInput("");
        setAddedTask(false);
        refreshData();
      })
      .catch((error) => {
        console.log("Error adding task", error);
        alert("Error adding task");
      });
  };

  const handleClose = () => {
    setAddedTask(false);
    refreshData();
  };

  // CRITICAL: Don't render anything if modal should not be open
  if (!addedTask) return null;

  return (
    <>
      {/* BACKDROP OVERLAY - Covers entire screen */}
      <div
        className="fixed inset-0  backdrop-blur-sm z-[9998]"
        onClick={handleClose}
        style={{ zIndex: 9998 }}
      />

      {/* MODAL CONTAINER - Centered on screen */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[9999]"
        style={{ zIndex: 9999 }}
      >
        {/* MODAL CONTENT - The actual modal box */}
        <div
          className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-[10000] flex items-center justify-center
                     h-8 w-8 text-2xl text-gray-500 hover:text-red-500 
                     hover:bg-red-50 rounded-full transition-all duration-200
                     border-2 border-transparent hover:border-red-200"
            aria-label="Close modal"
          >
            ×
          </button>

          {/* MODAL HEADER */}
          <div className="px-8 pt-8 pb-4">
            <h2 className="text-2xl font-bold text-gray-800 pr-8">
              Add New Task
            </h2>
          </div>

          {/* MODAL BODY - Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={task.header}
                onChange={(e) => setTask({ ...task, header: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition-all duration-200 text-gray-800
                         hover:border-gray-300"
                placeholder="Enter task title..."
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={task.content}
                onChange={(e) => setTask({ ...task, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition-all duration-200 text-gray-800 resize-vertical
                         hover:border-gray-300"
                placeholder="Enter task description..."
              />
            </div>

            {/* Priority Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={task.priority}
                onChange={handlePriorityChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition-all duration-200 text-gray-800
                         hover:border-gray-300 bg-white"
              >
                <option value={0}>Neutral</option>
                <option value={1}>Medium</option>
                <option value={2}>High</option>
                <option value={3}>Highest</option>
              </select>
            </div>

            {/* Due Date Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                onChange={(e) => {
                  setTask({ ...task, endDate: e.target.value });
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition-all duration-200 text-gray-800
                         hover:border-gray-300"
              />
            </div>

            {/* Labels Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Labels{" "}
                <span className="text-gray-500 text-xs">
                  (separated by spaces)
                </span>
              </label>
              <input
                type="text"
                value={labelsInput}
                onChange={(e) => handleLabels(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition-all duration-200 text-gray-800
                         hover:border-gray-300"
                placeholder="work urgent project meeting..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg 
                         hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 
                         focus:ring-offset-2 transition-all duration-200 font-semibold
                         active:scale-95"
              >
                Add Task
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg 
                         hover:bg-gray-50 hover:border-gray-400 focus:ring-4 focus:ring-gray-300 
                         focus:ring-offset-2 transition-all duration-200 font-semibold
                         active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddTask;
