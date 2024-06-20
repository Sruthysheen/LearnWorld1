import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useNavigate } from 'react-router';
import { getCartItems } from '../../../Utils/config/axios.GetMethods';
import { deleteCartItem } from '../../../Utils/config/axios.DeleteMethod';
import { addToWishlist } from '../../../Utils/config/axios.PostMethods';
import {toast} from 'sonner';
import PayButton from '../PayButton/PayButton';

interface CartItem {
  _id: string;
  course: any;
}

function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { student } = useSelector((state: any) => state.student);
  const studentId = student._id;
  console.log(studentId,",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,");
  const {courseDetails} =useSelector((state:any)=>state.course);
  const courseId = courseDetails._id;
  

  useEffect(() => {
    const fetchCartItem = async () => {
      try {
        const response: any = await getCartItems(studentId);
        console.log(response.data,"000000000000000000000000000000");
        
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    fetchCartItem();
  }, [studentId, dispatch]);


  useEffect(() => {
    
    const calculateTotal = () => {
      if (cartItems && cartItems.length > 0) {
        const totalAmount = cartItems.reduce((acc, curr) => {
          return acc + Number(curr.course[0]?.courseFee); 
        }, 0);
        setTotal(totalAmount);
      } else {
        setTotal(0); 
      }
    };

    calculateTotal();
  }, [cartItems]);

 

  
  const handleRemove = async (cartItemId: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0284c7',
        cancelButtonColor: '#f472b6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await deleteCartItem(cartItemId);
        setCartItems(prevCartItems => prevCartItems.filter(item => item._id !== cartItemId));
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleSingleCourse = () => {
    navigate('/singlecourse');
  };


  const handleAddToWishlist = async(cartItemId: string)=>{
    console.log(studentId,"----------studentId");
    if (!studentId) {
      toast.error("Please log in to add the course to your wishlist.");
      return;
  }
    
 
      try {
      const response:any=await addToWishlist(studentId,courseId)
      console.log(response,"..............");
      toast.success(response.data.message);
      await deleteCartItem(cartItemId);
        setCartItems(prevCartItems => prevCartItems.filter(item => item._id !== cartItemId));
        Swal.fire(
          'Moved!',
          'Your course has been moved to the wishlist.',
          'success'
        );

    } catch (error) {
      console.error("Error occur while adding to wishlist", error);
      toast.error("Course alredy existed in the wishlist")
    }
  }





  return (
    <>
    <section className="py-8 lg:py-24 relative -mt-9">
      <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
        <h2 className="title font-manrope font-bold text-4xl md:text-5xl leading-10 md:leading-12 mb-8 text-center text-sky-700">
          Shopping Cart
        </h2>
  
        <div className="border-t border-sky-200 py-3">
          {cartItems && cartItems.length > 0 && cartItems.map((cartItem: CartItem, index: number) => (
            <div key={index} className="flex flex-col md:flex-row items-center justify-between gap-3 border-b border-sky-200 py-3">
              {cartItem.course && cartItem.course.length > 0 && cartItem.course.map((course: any, courseIndex: number) => (
                <div key={courseIndex} className="flex items-center gap-3">
                  <img src={course.photo} alt="Course" className="w-16 h-16 rounded-md" />
                  <div>
                    <h4 className="font-semibold text-sky-600">{course.courseName}</h4>
                    <p className="text-sky-500">{course.courseDuration}</p>
                  </div>
                </div>
              ))}
  
              <div className="flex items-center gap-3">
                <p className="font-bold text-sky-600">₹{cartItem.course[0]?.courseFee}</p>
                <div className="hidden md:block w-8"></div>
                <button onClick={()=>handleRemove(cartItem._id)} className="text-red-500 hover:text-red-700">Remove</button>
                <button onClick={() => handleAddToWishlist(cartItem._id)} className="text-blue-500 hover:text-blue-700">Add to Wishlist</button>
              </div>
            </div>
          ))}
        </div>
  
        <div className="bg-sky-100 rounded-xl p-6 w-full mb-8 max-lg:max-w-xl max-lg:mx-auto">
          <div className="flex items-center justify-between w-full py-2">
            <p className="font-manrope font-medium text-xl md:text-2xl leading-8 md:leading-9 text-sky-900">
              Total
            </p>
            {/* Display total amount */}
            <h6 className="font-manrope font-medium text-xl md:text-2xl leading-8 md:leading-9 text-indigo-500">
            ₹{total}
            </h6>
          </div>
        </div>
  
        <div className="flex items-center flex-col sm:flex-row justify-center gap-3 mt-8">
          
          <PayButton cartItems={cartItems} />
            
          
        </div>
      </div>
    </section>
  </>
  
    
  );
 
}

export default Cart;
