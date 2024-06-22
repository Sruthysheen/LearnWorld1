import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useNavigate } from 'react-router';
import { getCartItems } from '../../../Utils/config/axios.GetMethods';
import { deleteCartItem } from '../../../Utils/config/axios.DeleteMethod';
import { addToWishlist, stripePayment, updateWalletBalance } from '../../../Utils/config/axios.PostMethods';
import { toast } from 'sonner';
import PayButton from '../PayButton/PayButton';
import { selectWalletBalance, withdraw } from '../../../Slices/studentSlice/walletSlice';

interface CartItem {
  _id: string;
  course: any;
}

function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { student } = useSelector((state: any) => state.student);
  const studentId = student._id;
  const { courseDetails } = useSelector((state: any) => state.course);
  const courseId = courseDetails._id;
  const walletBalance = useSelector(selectWalletBalance);
  console.log(walletBalance,".......>>>>>>>>>>>>>.....");
  
  

  useEffect(() => {
    const fetchCartItem = async () => {
      try {
        const response: any = await getCartItems(studentId);
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

  const handleAddToWishlist = async (cartItemId: string) => {
    if (!studentId) {
      toast.error("Please log in to add the course to your wishlist.");
      return;
    }

    try {
      const response: any = await addToWishlist(studentId, courseId);
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
      toast.error("Course already existed in the wishlist");
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePaymentSelection = async () => {
    if (selectedPaymentMethod === 'wallet') {
      if (total <= walletBalance) {
        await updateWalletBalance(studentId, -total, cartItems);
        dispatch(withdraw(walletBalance))
        toast.success('Payment successful!');
        navigate('/paymentsuccess');
      } else {
        toast.error("Insufficient wallet balance.");
      }
    } else if (selectedPaymentMethod === 'stripe') {
      const response: any = await stripePayment(cartItems);
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error("Error: Unable to initiate payment.");
      }
    }
    handleCloseModal();
  };
  

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
                  <button onClick={() => handleRemove(cartItem._id)} className="text-red-500 hover:text-red-700">Remove</button>
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
              <h6 className="font-manrope font-medium text-xl md:text-2xl leading-8 md:leading-9 text-indigo-500">
                ₹{total}
              </h6>
            </div>
          </div>

          <div className="flex items-center flex-col sm:flex-row justify-center gap-3 mt-8">
            <button
              onClick={handleOpenModal}
              className="rounded-3xl w-full max-w-[280px] py-2 px-6 text-center justify-center items-center bg-sky-600 font-semibold text-lg text-white flex transition-all duration-500 hover:bg-indigo-700"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div
          id="select-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Select Payment Method</h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={handleCloseModal}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <ul className="space-y-4 mb-4">
                <li>
                  <input
                    type="radio"
                    id="wallet"
                    name="paymentMethod"
                    value="wallet"
                    className="hidden peer"
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    disabled={total > walletBalance}
                  />
                  <label
                    htmlFor="wallet"
                    className={`inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500 ${total > walletBalance ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <div className="block">
                      <div className="w-full text-lg font-semibold">
                        Wallet
                      </div>
                    </div>
                    <svg
                      className="w-4 h-4 ms-3 rtl:rotate-180 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </label>
                </li>
                <li>
                  <input
                    type="radio"
                    id="stripe"
                    name="paymentMethod"
                    value="stripe"
                    className="hidden peer"
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  />
                  <label
                    htmlFor="stripe"
                    className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
                  >
                    <div className="block">
                      <div className="w-full text-lg font-semibold">
                        Stripe Payment
                      </div>
                    </div>
                    <svg
                      className="w-4 h-4 ms-3 rtl:rotate-180 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </label>
                </li>
              </ul>
              <button
                onClick={handlePaymentSelection}
                className="text-white inline-flex w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
