import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { deleteCart } from '../../../Utils/config/axios.PostMethods';

function PaymentSuccess() {

    const cartId = useSelector((state: any) => state.cart.cartId);
    console.log(cartId,"---------=================");
    
    const {student} = useSelector((state:any)=>state.student)
    const studentId = student._id;
    console.log(studentId,"))))))))))))))))))))))))))");
    
    const navigate = useNavigate();
    const searchQuery = useSearchParams()[0];
    const referenceNo = searchQuery.get("reference");

    const clearCart = async () => {
        try {
          console.log("Attempting to clear cart with ID:", cartId);
          
            const data={ id: studentId }
            
            const response:any =await deleteCart(data)
            console.log("Clear cart response:", response);
            if (response?.data?.status) {
              toast.success("Payment Successfull");
            } else {
            }
          
          
        } catch (error) {
          console.error("Error clearing cart:", error);
        }
      };

      useEffect(() => {
        (async()=>{
         if (cartId) {
           await clearCart();
         } else {
           toast.error("CART ID IS NOT FOUN D")
         }
        })()
         
       }, [cartId]);


  return (
<div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-sky-200">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-sky-600 mb-4">Payment Success!</h1>
        {/* <h1 className="text-lg font-semibold text-sky-600 mb-4">Reference Number : {referenceNo}</h1> */}
        <p className="text-lg text-sky-700 mb-6">Thank you for your payment. Your order has been successfully processed.</p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/enrolled-course"
            className="bg-sky-600 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
          >
            Enrolled Courses
          </Link>
          <button
            className="bg-green-700 hover:bg-gray-500 text-white px-4 py-2 rounded focus:outline-none focus:ring focus:ring-gray-300"
            onClick={() => {
              navigate('/');
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
  
}

export default PaymentSuccess