import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectAdmin } from '../../Slices/adminSlice/adminSlice';

interface PrivatePageProps {
    isStudent : boolean;          //received as props from App.jsx
}

const AdminPrivateRoute: React.FC<PrivatePageProps> = ({isStudent}) => {
    const admin = useSelector(selectAdmin);
    
 
    if(isStudent) {
        if(admin) {
            return <Outlet/>
        } else {
            return <Navigate to={'/admin/adminLogin'}/>
        }
    } else {
       
        
    }
}

export default AdminPrivateRoute