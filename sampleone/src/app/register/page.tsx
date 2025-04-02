"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const router= useRouter();
  const [formData, setFormData] = useState({
    name: "",
    student_id: "",
    phoneno: "",
    email: "",
    branch: "",
    semester: "",
    hostel: "",
    address: "N/A",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/add/user", null, {
        params: {
          name: formData.name,
          address: formData.address,
          email: formData.email,
          hostel: formData.hostel,
          sem: formData.semester,
          branch: formData.branch,
          phone_no: formData.phoneno,
          student_id: formData.student_id,
        },
      });

      alert("User registered successfully!");
      console.log(response.data);
      router.push(`/password-setup?email=${formData.email}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error registering user:", error.response?.data || error);
        alert(error.response?.data?.detail || "Registration failed!");
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred!");
      }
    }
  };

  return (
    <div className="mx-auto mt-10 w-64">
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-800 font-semibold text-sm">
            Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 mb-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-800 font-semibold text-sm">
            Student ID:
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              required
              className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 mb-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-800 font-semibold text-sm">
            Phone No:
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="phoneno"
              value={formData.phoneno}
              onChange={handleChange}
              required
              className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 mb-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-800 font-semibold text-sm">
            Email:
          </label>
          <div className="mt-2">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 mb-3"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-800 font-semibold text-sm">
            Branch:
          </label>
          <div className="mt-2">
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 mb-3"
              >
              <option value="">Select Branch</option>
              <option value="CS">CS</option>
              <option value="IT">IT</option>
              <option value="EEE">EEE</option>
              <option value="EC">EC</option>
              <option value="CE">CE</option>
              <option value="SE">SE</option>
            </select>
          </div>
        </div>


        <div>
          <label className="block text-gray-800 font-semibold text-sm">
            Semester:
          </label>
          <div className="mt-2">
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 mb-3"
            >
              <option value="" disabled>
                Select the semester
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-800 font-semibold text-sm">
            Hostel
          </label>
          <div className="mt-2">
            <select
              name="hostel"
              value={formData.hostel}
              onChange={handleChange}
              required
              className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 mb-3"
            >
              <option value="" disabled>
                Select the hostel
              </option>
              <option value="swaraj">Swaraj</option>
              <option value="sahara">Sahara</option>
              <option value="sagar">Sagar</option>
              <option value="sarover">Sarover</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-neutral mt-5 w-56"
        >
          Register
        </button>
      </form>
    </div>
  );
}
