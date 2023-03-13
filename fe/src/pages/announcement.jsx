import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Announcement() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [fileSelected, setFileSelected] = useState(null);
  const [error, setError] = useState({
    statusCode: 0,
    message: "",
  });
  const [success, setSuccess] = useState({
    statusCode: 0,
    message: "",
  });
  const { userToken } = useSelector((state) => state);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //if file is selected
      if (fileSelected) {
        const formData = new FormData();

        formData.append("file", fileSelected);

        const res = await axios.post(
          "http://localhost:3000/announcement/file",
          formData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setSuccess({
          statusCode: res.status,
          message: res.message,
        });
        //empty form
        setFormData({
          title: "",
          description: "",
        });
      } else {
        const res = await axios.post(
          "http://localhost:3000/announcement",
          {
            title: formData.title,
            description: formData.description,
            date: new Date(),
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setSuccess({
          statusCode: res.status,
          message: res.message,
        });
        //empty form
        setFormData({
          title: "",
          description: "",
        });
      }
    } catch (err) {
      setError({
        statusCode: err.response.status,
        message: err.message,
      });
    }
  };
  console.log(fileSelected);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <form
        className="space-y-8 divide-y divide-gray-200"
        onSubmit={handleSubmit}
      >
        <div className="space-y-8 divide-y divide-gray-200">
          <div className="">
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    id="title"
                    autoComplete="given-name"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  About
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Write a few sentences description yourself.
                </p>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="file-sheet"
                  className="block text-sm font-medium text-gray-700"
                >
                  file sheet
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          onChange={(e) => setFileSelected(e.target.files[0])}
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
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
  );
}
