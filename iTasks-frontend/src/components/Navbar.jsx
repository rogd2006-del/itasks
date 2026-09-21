/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import "/src/index.css";
import { TaskContext, URL } from "../context/Context";
import navbg1 from "/src/assets/img/navbg1.jpg";
import { faSearch, faHome, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

function Navbar() {
  const {
    addedTask,
    setAddedTask,
    isLogged,
    setTaskCards,
    refreshData,
    setIsLogged,
  } = useContext(TaskContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchBox, setSearchBox] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAddTask = () => {
    console.log("Add Task clicked - Current addedTask:", addedTask);
    setIsMenuOpen(false);
    setAddedTask(true);
  };

  const handleToday = async () => {
    await refreshData();
    await axios
      .get(`${URL}/tasks/sort/today`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        if (response.status != 404) setTaskCards(response.data);
      })
      .catch((e) => {
        alert("No Tasks Found");
      });
  };
  const handleSearch = async () => {
    await refreshData();
    await axios
      .get(`${URL}/tasks/search/${searchValue}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        setSearchBox(false);
        setSearchValue("");
        if (response.status != 404) setTaskCards(response.data);
      })
      .catch((e) => {
        alert("Task not Found");
        setSearchValue("");
      });
  };

  return (
    <>
      <nav
        className="
    h-[10%] flex justify-between items-center px-6 py-4 z-40
    backdrop-blur-xl 
    shadow-md border-b border-purple-400
     before:absolute before:top-0 before:left-0 before:w-full before:h-full
    overflow-hidden sticky top-0 
  "
        style={{ backgroundImage: `url(${navbg1})` }}
      >
        {/* Left section with hamburger and title */}
        <div className="flex items-center gap-4">
          {/* Hamburger Menu Button */}
          <button
            onClick={handleMenuToggle}
            onBlur={() => {
              // Delay closing to allow clicks to register
              setTimeout(() => setIsMenuOpen(false), 100);
            }}
            aria-label="Toggle menu"
            className="flex flex-col justify-center items-center w-10 h-10 rounded-md bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95"
          >
            <span
              className={`block h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${
                isMenuOpen
                  ? "rotate-45 translate-y-1.5 bg-red-400"
                  : "group-hover:w-7"
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-white rounded-full transition-all duration-300 my-1 ${
                isMenuOpen ? "opacity-0 scale-0" : "group-hover:w-5"
              }`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${
                isMenuOpen
                  ? "-rotate-45 -translate-y-1.5 bg-red-400"
                  : "group-hover:w-7"
              }`}
            ></span>
          </button>

          {/* Title with enhanced styling */}
          <h1 className="text-3xl md:text-4xl font-black select-none tracking-tight">
            <span className="bg-gradient-to-r to-white from-blue-300 bg-clip-text text-transparent drop-shadow-md">
              i
            </span>
            <span className="text-yellow-300 mx-1">•</span>
            <span className="bg-gradient-to-r to-blue-300 from-white bg-clip-text text-transparent drop-shadow-md">
              Tasks
            </span>
          </h1>
        </div>

        {/* Desktop Navigation Menu */}
        <ul className="hidden md:flex font-semibold text-md items-center gap-8 text-white">
          <li className="relative group">
            <button
              onClick={() => setSearchBox(!searchBox)}
              className="py-2 px-4 rounded-md font-extrabold  transition-all duration-300 hover:bg-white/10 hover:text-yellow-300 hover:shadow-md hover:scale-105"
            >
              <FontAwesomeIcon icon={faSearch} /> Search
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </li>
          <li className="relative group">
            <button
              onClick={() => refreshData()}
              className="py-2 px-4 rounded-md transition-all duration-300 hover:bg-white/10 hover:text-yellow-300 hover:shadow-md hover:scale-105"
            >
              <FontAwesomeIcon icon={faHome} /> Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </li>
          <li className="relative">
            <button
              onClick={() => {
                if (window.confirm("Logout?")) {
                  axios
                    .get(`${URL}/logout`, {
                      headers: {
                        "Content-Type": "application/json",
                      },
                      withCredentials: true,
                    })
                    .then(() => {
                      setIsLogged(false);
                    })
                    .catch((e) => {
                      console.log("Error:-" + e.message);
                    });
                }
              }}
              className="py-2 px-6 bg-gradient-to-r  from-yellow-400 to-orange-400 text-blue-900 font-bold rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-yellow-300 hover:from-yellow-300 hover:to-orange-300"
            >
              <FontAwesomeIcon icon={faUser} />
              <a className="px-2">Log Out</a>
            </button>
          </li>
        </ul>

        {/* Mobile/Tablet Navigation Menu */}
        <div className="md:hidden">
          <button className="py-2 px-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-blue-900 font-bold rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm">
            {isLogged ? "Profile" : "Sign In"}
          </button>
        </div>
      </nav>

      {/*Search Box  */}
      {searchBox && (
        <div
          onBlur={() => {
            setSearchValue("");
            setSearchBox(false);
          }}
          className="flex items-center justify-center fixed md:right-[3.5rem]  z-30 bg-white h-[3rem] md:w-[25rem] w-full rounded-xl  shadow-[3px_5px_2px_oklch(37.3%_0.034_259.733)]"
        >
          <FontAwesomeIcon icon={faSearch} className="p-2 pl-4" />
          <input
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="header/content/label/(YYYY-MM-DD)"
            className="w-full p-2 pl-4 pr-4 focus:outline-none focus:ring-0"
          />
        </div>
      )}
      {/* Background overlay when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20  z-20 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 h-[25rem] mt-[4.6rem] backdrop-blur-xs ml-4 w-72 font-semibold  text-gray-900 rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in slide-in-from-top-2 duration-300 md:hidden ">
          <div className="p-2">
            <ul className="space-y-1">
              <li>
                <button
                  onMouseDown={() => handleAddTask()}
                  className="w-full text-left py-3 px-4 rounded-xl hover:bg-red-50 transition-all duration-200 flex items-center gap-3 group"
                >
                  <div className="text-2xl font-light flex items-center justify-center rounded-full bg-red-500 text-white w-8 h-8 group-hover:scale-110 transition-transform duration-200">
                    +
                  </div>
                  <span className="font-medium text-red-500">Add Tasks</span>
                </button>
              </li>
              <li>
                <button
                  onMouseDown={() => setSearchBox(!searchBox)}
                  className="w-full text-left py-3 px-4 rounded-xl hover:bg-blue-50 transition-all duration-200 flex items-center gap-3 group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                  <span className="font-medium">Search</span>
                </button>
              </li>
              <li>
                <button
                  onMouseDown={() => {
                    handleToday();
                  }}
                  className="w-full text-left py-3 px-4 rounded-xl hover:bg-green-50 transition-all duration-200 flex items-center gap-3 group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                    📅
                  </span>
                  <span className="font-medium">Today</span>
                </button>
              </li>
              <li className="border-t border-gray-200 mt-2 pt-2">
                <button
                  onMouseDown={() => {
                    refreshData();
                  }}
                  className="w-full text-left py-3 px-4 rounded-xl hover:bg-blue-50 transition-all duration-200 flex items-center gap-3 group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                    <FontAwesomeIcon icon={faHome} />
                  </span>
                  <span className="font-medium">Home</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Desktop Home Sidebar - Slides in from left on hamburger click */}
      <div
        className={`hidden md:block fixed left-0 top-[10%] h-[90vh] shadow-2xl transition-all duration-500 ease-in-out z-30 ${
          isMenuOpen ? "w-[15%] translate-x-0" : "w-0 -translate-x-full"
        } overflow-hidden`}
      >
        <div className="flex flex-col py-6 px-4 h-full">
          <div className="mt-2 flex flex-col min-h-[40%] w-full items-center justify-around space-y-4">
            {/* Add Task */}
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <button
                onClick={() => handleAddTask()}
                className="text-4xl pb-1 font-light flex items-center justify-center rounded-full bg-red-500 text-white w-12 h-12 shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 hover:bg-red-600"
              >
                +
              </button>
              <p
                onClick={() => handleAddTask()}
                className="text-red-500 font-semibold text-sm hover:text-red-600 transition-colors duration-300 cursor-pointer"
              >
                Add Task
              </p>
            </div>
            {/* Home */}
            <button
              onClick={() => refreshData()}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 hover:bg-purple-600">
                <FontAwesomeIcon icon={faHome} className="text-white" />
              </div>
              <p className="text-purple-500 font-semibold text-sm hover:text-purple-600 transition-colors duration-300">
                Home
              </p>
            </button>

            {/* Today */}
            <button
              onClick={() => {
                handleToday();
              }}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 hover:bg-green-600">
                📅
              </div>
              <p className="text-green-500 font-semibold text-sm hover:text-green-600 transition-colors duration-300">
                Today
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for desktop home sidebar */}
      {isMenuOpen && (
        <div
          className="hidden md:block fixed inset-0 bg-black/10 z-20"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Navbar;
