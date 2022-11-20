import React, { Fragment } from 'react'
import { Route, Navigate, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


const ProtectedRoute = ({ isAdmin=false, isUser=false, isNewUser=false, NotForNewUser=false, isGarbageCollector=false, isBarangayAdministrator=false, children }) => {

    const { isAuthenticated, loading, user } = useSelector(state => state.auth)

    console.log(children.type.name, isAuthenticated, loading, user)

    
    let navigate = useNavigate();
    
    if(!loading){
        // alert()

        if(!localStorage.getItem("isAuthenticated")){
             return <Navigate to='/login'  />;
        }

        if(JSON.parse(localStorage.getItem("user")).otp_status !== 'Verified'){
            return <Navigate to="/register/email-verification"/>
        }

            if(JSON.parse(localStorage.getItem("user")).role === 'banned'){
                return <Navigate to="/user-banned"/>
            }

            if (isAdmin === true && JSON.parse(localStorage.getItem("user")).role !== 'administrator') {
                    return <Navigate to={-1} />;
            }

            if (isUser === true && JSON.parse(localStorage.getItem("user")).role !== 'user') {
                    if(NotForNewUser === true && JSON.parse(localStorage.getItem("user")).role === 'newUser'){
                        return <Navigate to="/access-denied" />;
                    }else if(isNewUser===true && JSON.parse(localStorage.getItem("user")).role === 'newUser'){
                        return children;
                    }
                    else{
                        return <Navigate to={-1} />; 
                    }
            }

            if (isGarbageCollector === true && JSON.parse(localStorage.getItem("user")).role !== 'garbageCollector') {
                     return <Navigate to={-1} />;
            }

            if (isBarangayAdministrator === true && JSON.parse(localStorage.getItem("user")).role !== 'barangayAdministrator') {
                     return <Navigate to={-1} />;
            }
       
       


          return children;
    }
};
export default ProtectedRoute