import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
// import { selectStudent } from '../../Slices/studentSlice/studentSlice';
// import { selectTutor } from '../../Slices/tutorSlice/tutorSlice';
import { toast } from 'sonner';

interface PrivatePageProps {
    isStudent : boolean;         
}
const privatePage: React.FC<PrivatePageProps> = ({isStudent}) => {
    const {student} = useSelector((state:any)=>state.student);
    console.log(student,"user is here--------------");
    
    const {tutor} = useSelector((state: any)=>state.tutor);
    console.log(tutor,'THIS IS Tutor----------------');
    
    if(isStudent) {
        if(student) {
            return <Outlet/>
        } else {
            return <Navigate to={'/login'}/>
        }
    } else {
        if(tutor) {
            return <Outlet/>
        } else {
            return <Navigate to={'/'}/>
        }
    }
}


export default privatePage