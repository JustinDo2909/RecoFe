"use client";
import { useUser } from "@/hooks/useUser";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  useChangePasswordMutation,
  useUpdateProfileMutation,
} from "@/state/api";
import dayjs from "dayjs";
import toast from "react-hot-toast";
const Profile = () => {
  const { user } = useUser();
  const [
    updateProfile,
    {
      isLoading: isProfileLoading,
      isError: isProfileError,
      error: profileError,
    },
  ] = useUpdateProfileMutation();
  const [
    changePassword,
    {
      isLoading: isPasswordLoading,
      isError: isPasswordError,
      error: passwordError,
    },
  ] = useChangePasswordMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.user?.username || "",
    phone: user?.user?.phone || "",
    address: user?.user?.address || "",
    email: user?.user?.email || "",
    date_of_birth: dayjs(user?.user?.date_of_birth).format("DD/MM/YYYY") || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState("");

  // Update formData when user data changes
  React.useEffect(() => {
    setFormData({
      username: user?.user?.username || "",
      phone:
        user?.user?.phone === "Không có số điện thoại"
          ? ""
          : user?.user?.phone || "",
      address:
        user?.user?.address === "Không có địa chỉ"
          ? ""
          : user?.user?.address || "",
      email: user?.user?.email || "",
      date_of_birth: user?.user?.date_of_birth
        ? dayjs(user.user.date_of_birth).format("DD/MM/YYYY")
        : "",
    });
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordInputChange = (e: any) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(""), 3000);
      window.location.reload();
    } catch (err) {
      toast.error("Failed to update profile:", err || "An error occurred.");
    }
  };

  const handlePasswordSubmit = async (e: any) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordSuccessMessage("");
      setPasswordSuccessMessage("New passwords do not match.");
      return;
    }
    try {
      await changePassword({
        confirmNewPassword: passwordData.confirmNewPassword,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      setPasswordSuccessMessage("Password changed successfully!");
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setTimeout(() => setPasswordSuccessMessage(""), 3000);
    } catch (err) {
      toast.error("Failed to change password:", err || "An error occurred.");
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setSuccessMessage("");
    setIsChangingPassword(false);
  };

  const toggleChangePassword = () => {
    setIsChangingPassword(!isChangingPassword);
    setPasswordSuccessMessage("");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-pink-300 to-purple-700 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative h-32 w-32 rounded-full border-4 border-white shadow-2xl mb-4 md:mb-0 md:mr-6 flex items-center justify-center bg-gray-200 text-gray-800 text-5xl font-bold overflow-hidden"
            >
              {user?.avatar && user.avatar !== "default-avatar.png" ? (
                <Image
                  src={user.avatar}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                  priority
                />
              ) : (
                <span className="transform hover:scale-110 transition-transform">
                  {user?.user?.username?.charAt(0).toUpperCase()}
                </span>
              )}
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold tracking-tight">
                {user?.user?.username}
              </h1>
              <div className="flex items-center mt-2 space-x-2">
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {user?.user?.role}
                </span>
                <span className="text-sm text-white/90">
                  Member since {new Date().getFullYear()}
                </span>
              </div>
            </motion.div>
          </div>

          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-white/5"></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-6 md:p-8"
        >
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg"
            >
              {successMessage}
            </motion.div>
          )}

          {isProfileError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg"
            >
              Error updating profile:{" "}
              {profileError?.data?.message || "Something went wrong"}
            </motion.div>
          )}

          {passwordSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg"
            >
              {passwordSuccessMessage}
            </motion.div>
          )}

          {isPasswordError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg"
            >
              Error changing password:{" "}
              {passwordError?.data?.message || "Something went wrong"}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                Personal Information
              </h2>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </p>
                    <p className="font-mono text-sm text-gray-600 mt-1">
                      {user?.user?.email}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="mt-1 w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={dayjs(formData.date_of_birth).format("DD/MM/YYYY")}
                      onChange={handleInputChange}
                      className="mt-1 w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </form>
              ) : (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </p>
                    <p className="font-medium text-gray-800 mt-1">
                      {user?.user?.email || "Not provided"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </p>
                    <p className="font-medium text-gray-800 mt-1">
                      {user?.user?.phone || "Not provided"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date of Birth
                    </p>
                    <p className="font-medium text-gray-800 mt-1">
                      {dayjs(user?.user?.date_of_birth).format("DD/MM/YYYY") ||
                        "Not specified"}
                    </p>
                  </div>
                </>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                Address Information
              </h2>

              {isEditing ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter address"
                  />
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </p>
                  <p className="font-medium text-gray-800 mt-1">
                    {user?.user?.address || "Not provided"}
                  </p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </p>
                <p className="font-mono text-sm text-gray-600 mt-1">
                  {user?.user?._id}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Status
                </p>
                <p className="font-medium text-gray-800 mt-1 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Active
                </p>
              </div>
            </motion.div>
          </div>

          {isChangingPassword && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-8 p-6 bg-gray-50 rounded-lg"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
                Change Password
              </h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordInputChange}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <motion.button
                    type="submit"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isPasswordLoading}
                    className={`px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center ${isPasswordLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    {isPasswordLoading ? "Saving..." : "Save Password"}
                  </motion.button>
                  <motion.button
                    type="button"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleChangePassword}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 hover:shadow-lg transition-all flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          <motion.div
            variants={containerVariants}
            className="mt-12 flex flex-wrap gap-4 justify-center md:justify-start"
          >
            {isEditing ? (
              <>
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={isProfileLoading}
                  className={`px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center ${isProfileLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  {isProfileLoading ? "Saving..." : "Save Changes"}
                </motion.button>
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleEdit}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 hover:shadow-lg transition-all flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  Cancel
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleEdit}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                  Edit Profile
                </motion.button>
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleChangePassword}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 hover:shadow-lg transition-all flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    ></path>
                  </svg>
                  Change Password
                </motion.button>
              </>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;
