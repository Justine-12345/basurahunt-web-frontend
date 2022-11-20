import React, {Fragment, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom';
import { useAlert } from 'react-alert'
import { resetPassword, loadUser, clearErrors } from '../../actions/userActions'
import Loader from '../layouts/Loader'
import { NEW_PASSWORD_RESET } from '../../constants/userConstants'
import PasswordChecklist from "react-password-checklist"

const ResetPassword = () => {

	const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
	const [isValidPassword, setIsValidPassword] = useState(false)

	const { loading, isAuthenticated, error, user } = useSelector(state => state.auth);
	const { loading:forgotPasswordLoading, message, success, error:forgotPasswordError } = useSelector(state => state.forgotPassword);


	let navigate = useNavigate();
    const alert = useAlert();
    const dispatch = useDispatch();
    let {token, email} = useParams()

    const submitHandler = (e) => {
        e.preventDefault();

        if(password === ""){
        	alert.error("Please Enter Your New Password")
        }
        else if (confirmPassword === ""){
        	alert.error("Please Confirm Your Password")
        }
        else if (password !== confirmPassword) {
        	alert.error("Password Dont Match, Please Confirm Again")
        }else{

        const formData = new FormData();
        formData.set('password', password);
        formData.set('confirmPassword', confirmPassword);
        dispatch(resetPassword(token, formData))
    	}
    }

	useEffect(()=>{
		 if (success){
		 	alert.success("Password Reset Sucessfully")
		 	dispatch({type:NEW_PASSWORD_RESET})
		 	dispatch(loadUser())
		 }

		 if(isAuthenticated || localStorage.getItem("isAuthenticated")){
                if(user&&user.otp_status === "Verified" || JSON.parse(localStorage.getItem("user")).otp_status === "Verified"){
                 
                   	dispatch(loadUser())
		            if(user&&user.role === "administrator"|| JSON.parse(localStorage.getItem("user")).role === "administrator"){
		            	navigate('/admin/dashboard')
		            }
		            else if(user&&user.role === "garbageCollector"|| JSON.parse(localStorage.getItem("user")).role === "garbageCollector"){
		            	navigate('/collector/profile')
		            }
		            else if(user&&user.role === "barangayAdministrator"|| JSON.parse(localStorage.getItem("user")).role === "barangayAdministrator"){
		            	navigate('/barangay/profile')
		            }
		            else if(user&&user.role === "user"|| JSON.parse(localStorage.getItem("user")).role === "user"){
		               navigate('/newsfeed')
		            }
		            else if(user&&user.role === "newUser"|| JSON.parse(localStorage.getItem("user")).role === "newUser"){
		               navigate('/newsfeed')
		            }
                }else{
                    navigate('/register/email-verification')
                }
            }else{
                 navigate(`/reset-password/${token}/${email}`)
            }

       	   if(forgotPasswordError){
       	   	alert.error(forgotPasswordError)
       	   }

          
	},[dispatch, isAuthenticated, success, forgotPasswordLoading, forgotPasswordError, user])


	return(
		<Fragment>
			{forgotPasswordLoading?<Loader/>:
				<div className="bh-login">
				<div className="row m-auto">
					<div className="col-auto forgot-password-box">
						<h1 className="text-center">Reset Password</h1>
						<form onSubmit={submitHandler}>
							<p className="small text-center"><i>{email}</i></p>
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
				</div>
			}
		</Fragment>
		)
}
export default ResetPassword