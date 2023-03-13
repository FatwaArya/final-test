import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];
export default function Approval() {
  const { userToken } = useSelector((state) => state);
  const [dataReimburse, setDataReimburse] = useState([]);
  const [dataOvertime, setDataOvertime] = useState([]);
  const [error, setError] = useState({
    statusCode: 0,
    message: "",
  });
  const [successChange, setSuccessChange] = useState(false);
  useEffect(() => {
    axios
      .get("http://localhost:3000/reimbursment", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setDataReimburse(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("http://localhost:3000/overtime", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setDataOvertime(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [successChange]);
  const handleReimbursmentApproval = (id) => {
    try {
      axios.patch(
        `http://localhost:3000/reimbursment/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setSuccessChange(true);
    } catch (error) {
      setError({
        statusCode: err.response.status,
        message: err.response.message,
      });
    }
  };
  const handleReimbursmentReject = (id) => {
    try {
      axios.patch(
        `http://localhost:3000/reimbursment/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setSuccessChange(true);
    } catch (error) {
      setError({
        statusCode: err.response.status,
        message: err.response.message,
      });
    }
  };

  const handleOvertimeApproval = (id) => {
    try {
      axios.patch(
        `http://localhost:3000/overtime/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setSuccessChange(true);
    } catch (error) {
      setError({
        statusCode: err.response.status,
        message: err.response.message,
      });
    }
  };

  const handleOvertimeReject = (id) => {
    try {
      axios.patch(
        `http://localhost:3000/overtime/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setSuccessChange(true);
    } catch (error) {
      setError({
        statusCode: err.response.status,
        message: err.response.message,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-2">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-md font-semibold text-gray-900">
              Reimbursment Approval
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            {/* <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add user
            </button> */}
          </div>
        </div>
        <div className=" flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Reason
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {dataReimburse.map((reimbursement) => (
                      <tr key={reimbursement._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {reimbursement.user.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {reimbursement.amount}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {reimbursement.reason}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {reimbursement.status === "pending" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Pending
                            </span>
                          ) : reimbursement.status === "approved" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Reject
                            </span>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex justify-around">
                          {/* two button to reject and approved */}
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={() =>
                              handleReimbursmentReject(reimbursement._id)
                            }
                          >
                            reject
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            onClick={() =>
                              handleReimbursmentApproval(reimbursement._id)
                            }
                          >
                            approve
                          </button>{" "}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 mt-2">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-md font-semibold text-gray-900">
              Overtime Approval
            </h1>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            {/* <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add user
            </button> */}
          </div>
        </div>
        <div className=" flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Time start
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Time end
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Reason
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {dataOvertime.map((overtime) => (
                      <tr key={overtime._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {overtime.user.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {overtime.start_time
                            .toLocaleString("id-ID", {
                              timeZone: "Asia/Jakarta",
                            })
                            .replace(/[TZ]/g, " ")}{" "}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {overtime.end_time
                            .toLocaleString("id-ID", {
                              timeZone: "Asia/Jakarta",
                            })
                            .replace(/[TZ]/g, " ")}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {overtime.reason}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {overtime.status === "pending" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Pending
                            </span>
                          ) : overtime.status === "approved" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Reject
                            </span>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex justify-around">
                          {/* two button to reject and approved */}
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={() => handleOvertimeReject(overtime._id)}
                          >
                            reject
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            onClick={() => handleOvertimeApproval(overtime._id)}
                          >
                            approve
                          </button>{" "}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
