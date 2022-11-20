import React, {Fragment, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {useNavigate} from 'react-router-dom';
import { useAlert } from 'react-alert'
import { forgotPassword, loadUser, clearErrors } from '../../actions/userActions'
import Loader from '../layouts/Loader'
import { FORGOT_PASSWORD_RESET } from '../../constants/userConstants'
import MetaData from '../../components/layouts/MetaData'
	
const ForgotPassword = () => {

	const { loading, isAuthenticated, error, user } = useSelector(state => state.auth);
	const { loading:forgotPasswordLoading, success, error:forgotPasswordError } = useSelector(state => state.forgotPassword);

	let navigate = useNavigate();
    const alert = useAlert();
    const dispatch = useDispatch();

	const [email, setEmail] = useState('')

	useEffect(()=>{

		 if(isAuthenticated || localStorage.getItem("isAuthenticated")){
                if(user.otp_status === "Verified" || JSON.parse(localStorage.getItem("user")).otp_status === "Verified"){
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
                 navigate('/forgot-password')
            }
        if (success){
        	alert.success("Success, Please Check Your Email")
        	dispatch({type:FORGOT_PASSWORD_RESET})
        }

	},[dispatch, isAuthenticated, success, forgotPasswordLoading, forgotPasswordError])

	const submitHandler = (e) => {
        e.preventDefault();
        console.log(email)
        if(email === ""){
        	alert.error("Please Enter Your Email")
        }else{
         let dateNow = new Date();

        const formData = new FormData();
        formData.set('email', email);
        formData.set("dateTimeNow", dateNow.toLocaleString("en-US"))
        dispatch(forgotPassword(formData))
    	}
    }


	return(
		<Fragment>
		<MetaData title={"Forgot Password"} />
		{forgotPasswordLoading?<Loader/>:
			<div className="bh-login">
			<div className="row m-auto">
				
				<div className="col forgot-password-box">
					<h1 className="text-center">Forgot Password</h1>
					<form onSubmit={submitHandler}>
						<p className="small text-center"><i>Enter your email address and a link to reset your password will be sent to you.</i></p>
						<p className="m-0">Email</p>
						<input type="email" className="form-control" onChange={(e)=>{setEmail(e.target.value)}}/>
						<button type="submit" className="btn bh-loginBtn">Send</button>
					</form>
				</div>
				
			</div>
			</div>
		}
		</Fragment>
		)
}
export default ForgotPassword