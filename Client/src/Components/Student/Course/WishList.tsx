import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useNavigate } from 'react-router';
import {toast} from 'sonner';
import { addToCart } from '../../../Utils/config/axios.PostMethods';
import { getWishlistItems } from '../../../Utils/config/axios.GetMethods';
import { deleteWishlistItem } from '../../../Utils/config/axios.DeleteMethod';


interface WishlistItem {
    _id: string;
    course: any;
}

function WishList() {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { student } = useSelector((state: any) => state.student);
    const studentId = student._id;
    const {courseDetails} =useSelector((state:any)=>state.course);
    const courseId = courseDetails._id;

    useEffect(() => {
        const fetchWishlistItem = async () => {
            try {
                const response: any = await getWishlistItems(studentId);
                console.log(response.data,"000000000000000000000000000000");
                setWishlistItems(response.data);
            } catch (error) {
                console.error("Error fetching wishlist items:", error);
            }
        };
        fetchWishlistItem();
    }, [studentId, dispatch]);

    const handleRemove = async (wishlistItemId: string) => {
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
                await deleteWishlistItem(wishlistItemId);
                setWishlistItems(prevWishlistItems => prevWishlistItems.filter(item => item._id !== wishlistItemId));
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

    const handleAddToCart = async (wishlistItemId:string) => {
        console.log(studentId, "----------studentId");
        if (studentId) {
            try {
                const response: any = await addToCart(studentId, courseId);
                console.log(response, "..............\\\\");
                toast.success(response.data.message);
                await deleteWishlistItem(wishlistItemId);
                setWishlistItems(prevWishlistItems => prevWishlistItems.filter(item => item._id !== wishlistItemId));
        Swal.fire(
          'Moved!',
          'Your course has been moved to the cart.',
          'success'
        );

                
            } catch (error) {
                console.error("Error occur while adding to cart", error);
                toast.error("Course already exists in the cart")
            }
        } else {
            toast.error("Please log in to add the course to your cart.");
        }
    }

    return (
        <>
            <section className="py-8 lg:py-24 relative -mt-9">
                <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
                    <h2 className="title font-manrope font-bold text-4xl md:text-5xl leading-10 md:leading-12 mb-8 text-center text-sky-700">
                        WishList
                    </h2>

                    <div className="border-t border-sky-200 py-3">
                        {wishlistItems && wishlistItems.length > 0 && wishlistItems.map((wishlistItem: WishlistItem, index: number) => (
                            <div key={index} className="flex flex-col md:flex-row items-center justify-between gap-3 border-b border-sky-200 py-3">
                                {wishlistItem.course && wishlistItem.course.length > 0 && wishlistItem.course.map((course: any, courseIndex: number) => (
                                    <div key={courseIndex} className="flex items-center gap-3">
                                        <img src={course.photo} alt="Course" className="w-16 h-16 rounded-md" />
                                        <div>
                                            <h4 className="font-semibold text-sky-600">{course.courseName}</h4>
                                            <p className="text-sky-500">{course.courseDuration}</p>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex items-center gap-3">
                                    <p className="font-bold text-sky-600">₹{wishlistItem.course[0]?.courseFee}</p>
                                    <div className="hidden md:block w-8"></div>
                                    <button onClick={() => handleRemove(wishlistItem._id)} className="text-red-500 hover:text-red-700">Remove</button>
                                    <button onClick={()=>handleAddToCart(wishlistItem._id)} className="text-blue-500 hover:text-blue-700">Add to Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export default WishList;
