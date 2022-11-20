import React, {Fragment, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom';
import { useAlert } from 'react-alert'
import { updatePassword, clearErrors } from '../../actions/userActions'
import LoaderNoBg from '../layouts/LoaderNoBg'
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants'
import SidebarUser from '../../components/layouts/sidebar-user';
import SidebarBarangay from '../../components/layouts/sidebar-barangay';
import SidebarCollector from '../../components/layouts/sidebar-collector';
import Sidebar from '../../components/layouts/sidebar';
import PasswordChecklist from "react-password-checklist"

const PasswordUpdate = () => {

	const [password, setPassword] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
	const [isValidPassword, setIsValidPassword] = useState(false)

	const { loading, isUpdated, error } = useSelector(state => state.user);
	const { user } = useSelector(state => state.auth)


	let navigate = useNavigate();
    const alert = useAlert();
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();

        if(password === ""){
        	alert.error("Please Enter Your New Password")
        }
        else if (oldPassword === ""){
        	alert.error("Please Confirm Your Password")
        }
        else if (password !== confirmPassword) {
        	alert.error("Password Dont Match, Please Confirm Again")
        }else{

        const formData = new FormData();
        formData.set('password', password);
        formData.set('oldPassword', oldPassword);
        dispatch(updatePassword(formData))
    	}
    }

	useEffect(()=>{
		 if (isUpdated){
		 	alert.success("Password Reset Sucessfully")
		 	dispatch({type:UPDATE_PASSWORD_RESET})
		 	// dispatch(loadUser())
		 	if(user&&user.role === "barangayAdministrator"){
       	 		navigate('/barangay/profile')
	       	 }
	       	if(user&&user.role === "garbageCollector"){
       	 		navigate('/collector/profile')
	       	 }
	       	 if(user&&user.role === "administrator"){
	       	 	navigate(`/admin/profile`)
	       	 }
	       	 if(user&&user.role === "user"){
	       	 	navigate(`/username`)
	       	 }
		 }


       	   if(error){
       	   	alert.error(error)
       	   }

          
	},[dispatch, isUpdated, error])


	return(
		<Fragment>
			<div className="bh-container">
				<div>
				{user&&user.role === "administrator"?
		       	 	<Sidebar/>:
		       	  user&&user.role === "newUser" || user&&user.role === "user"?
		       	  	<SidebarUser/>:
		       	  user&&user.role === "barangayAdministrator"?
		       	  	<SidebarBarangay/>:
		       	  user&&user.role === "garbageCollector"?
		       	   	<SidebarCollector/>:""
		       	 }
				</div>
				{loading?<LoaderNoBg/>:
				<div className="row m-auto">
					<div className="col-auto forgot-password-box">
						<h1 className="text-center">Reset Password</h1>
						<form onSubmit={submitHandler}>
							<p className="m-0">Old Password</p>
							<input type="password" className="form-control" onChange={(e) => setOldPassword(e.target.value)}/>
							
							<p className="m-0">New Password</p>
							<input type="password" value={password} className="form-control" onChange={(e) => setPassword(e.target.value)}/>
							
							<p className="m-0">Confirm New Password</p>
							<input type="password" value={confirmPassword} className="form-control" onChange={(e) => setConfirmPassword(e.target.value)}/>
							
							<PasswordChecklist
                                        rules={["minLength","number","capital","match"]}
                                        minLength={8}
                                        value={password}
                                        valueAgain={confirmPassword}
                                        onChange={(isValid) => {isValid?setIsValidPassword(true):setIsValidPassword(false)}}
                                        style={{fontSize:"14px"}}
                                        iconSize={14}
                            />
							
							<button type="submit" disabled={isValidPassword?"":"true"} className="btn bh-loginBtn">Confirm</button>
						</form>
					</div>
				</div>
				}
			</div>







				
		
		</Fragment>
		)
}
export default PasswordUpdate