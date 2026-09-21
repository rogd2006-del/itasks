import TaskCard from "/src/components/TaskCard";
import Navbar from "/src/components/Navbar";
import { TaskContext, URL } from "./context/Context";
import { useContext, useState } from "react";
import AddTask from "./components/AddTask";
import Login from "./components/Login";
import axios from "axios";

function App() {
  const { taskCards, isError, isLogged, setTaskCards, refreshData } =
    useContext(TaskContext);
  const [completed, setCompleted] = useState(false);

  const handleCompleted = async () => {
    await axios
      .get(`${URL}/tasks/filter/completed`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setTaskCards(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  if (!isLogged)
    return (
      <>
        <Login />
      </>
    );

  return (
    <>
      {/* Navbar - Fixed at top */}
      <Navbar />

      {/* Main App Container */}
      <div className="min-h-screen relative">
        {/* Background Overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-custom"></div>

        {/* Main Content - Relative to overlay backdrop */}
        <div className="relative z-10 pl-[10%] pr-[10%] px-6 py-8">
          {/* Error Message */}
          {isError && (
            <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <strong>Error:</strong> Failed to load tasks. Please check your
              connection and try again.
            </div>
          )}

          {/* Tasks Container */}
          <div className="flex items-center gap-2  right-0 p-3 top-0 backdrop-blur-xl bg-white/20 rounded-2xl w-fit ">
            <button
              onMouseDown={() => {
                setCompleted(!completed);
                if (!completed) {
                  handleCompleted();
                } else {
                  refreshData();
                }
              }}
              className={`w-6 h-6 border border-black rounded-sm flex items-center justify-center ${
                completed ? "bg-green-500 text-white" : "bg-transparent"
              }`}
            >
              {completed && "✓"}
            </button>
            <span className="text-white font-bold">
              {completed ? "Completed" : "Completed"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {taskCards && taskCards.length > 0 ? (
              taskCards.map((task, index) => (
                <TaskCard
                  key={task.taskId || index}
                  task={task}
                  index={index}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                  <div className="text-purple-300 text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-purple-800 mb-2">
                    No Tasks Yet
                  </h3>
                  <p className="text-purple-600">
                    Create your first task to get started!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD TASK MODAL - Rendered conditionally, will overlay everything */}
      <AddTask />
    </>
  );
}

export default App;
