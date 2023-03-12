import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Attendance() {
  const { userToken } = useSelector((state) => state);
  const [data, setData] = useState([]);
  const [error, setError] = useState({
    statusCode: 0,
    message: "",
  });
  useEffect(() => {
    axios
      .get("http://localhost:3000/users/attendance", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(data);
  const handleClickTimeIn = () => {
    axios
      .post(
        "http://localhost:3000/users/attendance",
        {
          time_in: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {})
      .catch((err) => {
        setError({
          statusCode: err.response.status,
          message: err.response.data.message,
        });
      });
  };

  const handleClickTimeOut = () => {
    axios
      .post(
        "http://localhost:3000/users/attendance",
        {
          time_out: new Date().toLocaleTimeString(),
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        // refresh page
      })
      .catch((err) => {
        setError({
          statusCode: err.response.status,
          message: err.message,
        });
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      {/* show error */}
      {error.statusCode !== 0 && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <br />
          <span className="block sm:inline">{error.message}</span>
        </div>
      )}

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* {stats.map((item) => ( */}
        <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">
            {/* {item.name} */}
            Morning Attendance
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            <button
              type="button"
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleClickTimeIn}
            >
              Attend
            </button>
          </dd>
        </div>

        <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">
            {/* {item.name} */}
            Evening Attendance
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            <button
              type="button"
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleClickTimeOut}
            >
              Attend
            </button>
          </dd>
        </div>

        <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
          <dt className="text-sm font-medium text-gray-500 truncate">
            {/* {item.name} */}
            Todays Attendance Status
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {/* show user attendance */}
            {data.map((item) => (
              <div>
                <p key={1} className="text-sm">
                  Morning Attendance:
                  {item.time_in === null
                    ? " Not yet"
                    : item.time_in?.toLocaleString()}
                </p>
                <p key={2} className="text-sm">
                  Evening Attendance:
                  {item.time_out === null
                    ? "Not yet"
                    : item.time_out?.toLocaleString()}
                </p>
              </div>
            ))}
          </dd>
        </div>
      </dl>
    </div>
  );
}
