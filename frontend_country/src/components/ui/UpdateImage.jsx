import react, { useState } from 'react'
import useAxiosPrivate from '../../auth/hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import Loader from './Loader';
import useAuth from '../../auth/hooks/useAuth';

export default function UpdateImage({setIsModalOpen}) {

  const [avatar,setAvatar]=useState({avatar:""});
  const [loading,setLoading]=useState(false);
  const {fetchUser}=useAuth();

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      setAvatar({avatar:file});
    };

const axiosPrivate=useAxiosPrivate();
const handleImageUpload = async () => {
  try {
    setLoading(true);
    const formData=new FormData()
    formData.append("avatar",avatar.avatar);

    const res=await axiosPrivate.patch("/user/update-avatar",formData,{
      headers:{
        "Content-Type":"multipart/form-data"
      }
    })
    if(res.status==200){
      toast.success("Updated successfully");
      await fetchUser();
      setIsModalOpen(false); 
    }
  } catch (error) {
    console.log(error);
    toast.error("Error occured in updating")
  }
  finally{
    setLoading(false);
  }
};

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-5">
    <div className="shadow-cyan-500/50 bg-cyan-700 text-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
      <h2 className="text-xl font-semibold mb-4">Update Profile Picture</h2>
      
      {loading? <Loader/>:
      <>
      <input type="file" className='text-orange-600' onChange={handleImageChange} />

      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={handleImageUpload}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
          Upload
        </button>
         <button
        onClick={() => setIsModalOpen(false)}
        className="bg-red-500 text-black px-4 py-2 rounded hover:bg-red-600 transition"
        >
        Cancel
      </button>
      </div>
      </>}
    </div>
  </div>
    
  )
}
