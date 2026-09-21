/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { TaskContext, URL } from "../context/Context";
import "../index.css";
import {
  faTrash,
  faAngleDoubleDown,
  faAnglesUp,
  faAngleUp,
  faEquals,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function TaskCard({ task, index }) {
  const { refreshData } = useContext(TaskContext);
  const [editingHeaderIdx, setEditingHeaderIdx] = useState(null);
  const [editingContentIdx, setEditingContentIdx] = useState(null);
  const [headerInput, setHeaderInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  //Get Priority of Task
  const GetPriority = () => {
    const pr = task.priority;
    switch (pr) {
      case 0:
        return (
          <label className="flex items-center justify-center text-gray-600 bg-gray-300 rounded-full h-7 w-7">
            <FontAwesomeIcon icon={faAngleDoubleDown} />
          </label>
        ); //Neutral
      case 1:
        return (
          <label className="flex items-center justify-center bg-yellow-500 text-orange-600 rounded-full h-7 w-7">
            <FontAwesomeIcon icon={faEquals} />
          </label>
        ); //Mid
      case 2:
        return (
          <label className="flex items-center justify-center bg-orange-500 text-red-500 rounded-full h-7 w-7">
            <FontAwesomeIcon icon={faAngleUp} />
          </label>
        ); //High
      case 3:
        return (
          <label className="flex items-center justify-center text-red-800 bg-red-500 rounded-full h-7 w-7">
            <FontAwesomeIcon icon={faAnglesUp} />
          </label>
        ); //Highest
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (dateString == "1970-01-01") return "No date set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Check if task is overdue
  const isOverdue = (endDate) => {
    if (endDate == "1970-01-01") return false;
    const today = new Date();
    const taskEndDate = new Date(endDate);
    return taskEndDate < today && !task.completed;
  };

  // Get priority color based on date proximity
  const getPriorityColor = () => {
    if (task.completed) return "border-green-400 bg-green-300";

    if (task.endDate == "1970-01-01") return "border-gray-200";

    const today = new Date();
    const endDate = new Date(task.endDate);
    const daysUntilDue = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return "border-red-300 bg-red-100";
    if (daysUntilDue <= 3) return "border-orange-300 bg-orange-100";
    if (daysUntilDue <= 7) return "border-yellow-300 bg-yellow-100";
    return "border-purple-300 bg-white";
  };

  const handleUpdateClick = (field, idx) => {
    if (field === "header") {
      setEditingHeaderIdx(idx);
      setHeaderInput(task.header);
    } else if (field === "content") {
      setEditingContentIdx(idx);
      setContentInput(task.content);
    }
  };

  const handleUpdateInputBlur = async (field, idx) => {
    if (field === "header" && headerInput !== task.header) {
      await updateTask({ header: headerInput });
      setEditingHeaderIdx(null);
    } else if (field === "content" && contentInput !== task.content) {
      await updateTask({ content: contentInput });
      setEditingContentIdx(null);
    } else {
      setEditingHeaderIdx(null);
      setEditingContentIdx(null);
    }
  };

  const handleUpdateInputKeyDown = (field, e, idx) => {
    if (e.key === "Enter") {
      handleUpdateInputBlur(field, idx);
    } else if (e.key === "Escape") {
      setEditingHeaderIdx(null);
      setEditingContentIdx(null);
    }
  };

  const updateTask = async (updates) => {
    setIsUpdating(true);
    try {
      const updatedTask = { ...task, ...updates };
      await axios.put(`${URL}/tasks/${task.taskId}`, updatedTask, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      await refreshData();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Error updating task. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteTask = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setIsDeleting(true);
    try {
      await axios.delete(`${URL}/tasks/${task.taskId}`, {
        withCredentials: true,
      });
      await refreshData();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const toggleCompletion = async () => {
    const newStatus = task.completed ? false : true;
    await updateTask({ completed: newStatus });
  };

  return (
    <div
      className={`relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all 
                  duration-300 p-6 border-l-4 ${getPriorityColor()} group`}
    >
      {/* Loading Overlay */}
      {(isUpdating || isDeleting) && (
        <div className="absolute inset-0 bg-white bg-opacity-75 rounded-xl flex items-center justify-center z-10">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-purple-600 font-medium">
              {isUpdating ? "Updating..." : "Deleting..."}
            </span>
          </div>
        </div>
      )}

      {/* Task Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {editingHeaderIdx === index ? (
            <input
              type="text"
              value={headerInput}
              onChange={(e) => setHeaderInput(e.target.value)}
              onBlur={() => handleUpdateInputBlur("header", index)}
              onKeyDown={(e) => handleUpdateInputKeyDown("header", e, index)}
              className="w-full text-lg font-bold text-purple-800 bg-transparent border-b-2 
                       border-purple-300 focus:border-purple-600 outline-none pb-1"
              autoFocus
            />
          ) : (
            <h3
              onClick={() => handleUpdateClick("header", index)}
              className="text-lg font-bold text-purple-800 cursor-pointer hover:text-purple-600 
                       transition-colors duration-200 leading-tight"
            >
              {task.header || "Untitled Task"}
            </h3>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex relative items-center space-x-2">
          <a className="absolute  right-0 group-hover:hidden ">
            <GetPriority />
          </a>

          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity  gap-x-1">
            <button
              onClick={toggleCompletion}
              className={`p-2 rounded-lg transition-all ${
                task.completed
                  ? "bg-green-100 text-green-600 hover:bg-green-200"
                  : "bg-purple-100 text-purple-600 hover:bg-purple-200"
              }`}
              title={task.completed ? "Mark as incomplete" : "Mark as complete"}
            >
              {task.completed ? "✓" : "○"}
            </button>

            <button
              onClick={deleteTask}
              disabled={isDeleting}
              className="p-2 bg-red-500 hover:bg-red-600 rounded-lg cursor-pointer"
              title="Delete task"
            >
              <FontAwesomeIcon icon={faTrash} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Task Content */}
      <div className="mb-4">
        {editingContentIdx === index ? (
          <textarea
            value={contentInput}
            onChange={(e) => setContentInput(e.target.value)}
            onBlur={() => handleUpdateInputBlur("content", index)}
            onKeyDown={(e) => handleUpdateInputKeyDown("content", e, index)}
            className="w-full text-gray-700 bg-transparent border border-purple-300 
                     focus:border-purple-600 outline-none p-2 rounded-lg resize-none"
            rows="3"
            autoFocus
          />
        ) : (
          <p
            onClick={() => handleUpdateClick("content", index)}
            className={`text-gray-700 cursor-pointer hover:text-gray-900 transition-colors 
                       duration-200 leading-relaxed ${
                         task.completed ? "line-through opacity-75" : ""
                       }`}
          >
            {task.content || "No description"}
          </p>
        )}
      </div>

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {task.labels.map((label, labelIndex) => (
            <span
              key={labelIndex}
              className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs 
                       font-medium border border-purple-200"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Task Footer */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          {/* Due Date */}
          <div
            className={`flex items-center space-x-1 ${
              isOverdue(task.endDate)
                ? "text-red-600"
                : task.completed
                ? "text-green-600"
                : "text-purple-600"
            }`}
          >
            <span>📅</span>
            <span className="font-medium">
              {formatDate(task.endDate)}
              {isOverdue(task.endDate) && " (Overdue)"}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            task.completed
              ? "bg-green-100 text-green-800 border border-green-200"
              : isOverdue(task.endDate)
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-purple-100 text-purple-800 border border-purple-200"
          }`}
        >
          {task.completed
            ? "Completed"
            : isOverdue(task.endDate)
            ? "Overdue"
            : "Pending"}
        </div>
      </div>

      {/* Created Date */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          Created: {formatDate(task.addedDate)}
        </span>
      </div>
    </div>
  );
}

export default TaskCard;
