import { useState } from 'react';
import useAxiosPrivate from '../auth/hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const ChangePassword = () => {
  const axiosPrivate = useAxiosPrivate();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate=useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axiosPrivate.post('/user/change-password', form);
      toast.success("Password changed successfully!")
      console.log('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '' })
      navigate("/profile");

    } catch (err) {
      toast.error("Failed to change password");
      console.log('Failed to change password');
    }
  };

  return (
    <div className='flex flex-col justify-center min-h-screen bg-gray-600'>
<form onSubmit={handleSubmit} className="max-w-md mx-auto  bg-black text-white  p-6 py-14 rounded-lg shadow-md">
  <h2 className="text-2xl font-semibold mb-4 text-center">Change Password</h2>

  <input
    type="password"
    name="currentPassword"
    placeholder="Old Password"
    value={form.currentPassword}
    onChange={handleChange}
    required
    className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <input
    type="password"
    name="newPassword"
    placeholder="New Password"
    value={form.newPassword}
    onChange={handleChange}
    required
    className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <button
    type="submit"
    className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200"
  >
    Update Password
  </button>

</form>
</div>
  );
};

export default ChangePassword;
