import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Reimbursement() {
  // const { userInfo } = useSelector((state) => state);
  const { userToken } = useSelector((state) => state);
  const [formData, setFormData] = useState({
    amount: "",
    reason: "",
  });
  const [error, setError] = useState({
    statusCode: 0,
    message: "",
  });
  const [success, setSuccess] = useState({
    statusCode: 0,
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:3000/users/reimbursment",
        {
          amount: parseInt(formData.amount),
          reason: formData.reason,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        setSuccess({
          statusCode: res.status,
          message: res.message,
        });
        //empty form
        setFormData({
          amount: "",
          reason: "",
        });
      })
      .catch((err) => {
        setError({
          statusCode: err.response.status,
          message: err.message,
        });
      });
  };

  return (
    <>
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

      {success.statusCode !== 0 && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <br />
          <span className="block sm:inline">{success.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <form
          className="space-y-8 divide-y divide-gray-200"
          onSubmit={handleSubmit}
        >
          <div className="space-y-8 divide-y divide-gray-200">
            <div className="pt-8">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Personal Information
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Use a permanent address where you can receive mail.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Amount
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="amount"
                      id="amount"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      autoComplete="given-name"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Reason
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="reason"
                      id="reason"
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                      autoComplete="family-name"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
