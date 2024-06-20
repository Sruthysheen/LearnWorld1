import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from 'sonner';
import { addCartId } from "../../../Slices/studentSlice/cartSlice";
import { stripePayment } from "../../../Utils/config/axios.PostMethods";

function PayButton({ cartItems }: any) {
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(cartItems[0]?._id, 'KKKART--'); // Added optional chaining for safety
    }, [cartItems]);

    const handleCheckOut = async () => {
        try {
            if (!cartItems || cartItems.length === 0) {
                toast.error("No items in the cart.");
                return;
            }

            const cartItemId = cartItems[0]?._id;
            if (!cartItemId) {
                toast.error("No cart item found.");
                return;
            }

            dispatch(addCartId(cartItemId));
            const response: any = await stripePayment(cartItems);
            
            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                toast.error("Error: Unable to initiate payment.");
            }
        } catch (error) {
            console.error("Error occurred during checkout:", error);
            toast.error("An error occurred during checkout. Please try again later.");
        }
    }

    return (
        <div >
            <button
                onClick={handleCheckOut}
             className="rounded-3xl w-full max-w-[280px] py-2 px-6 text-center justify-center items-center bg-sky-600 font-semibold text-lg text-white flex transition-all duration-500 hover:bg-indigo-700">
            
                Check out
            </button>
        </div>
    );
}

export default PayButton;
