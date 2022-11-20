import React, {Fragment, useState, useEffect} from 'react';
// import {Link, useNavigate} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { useDispatch, useSelector } from 'react-redux'
import { checkOtp, loadUser, refreshOtp, clearErrors } from '../../actions/userActions'
import { useAlert } from 'react-alert'
import Loader from '../layouts/Loader'
import { UPDATE_USER_RESET} from '../../constants/userConstants'

const RegisterOTP = () => {

	let navigate = useNavigate();
	const dispatch = useDispatch();
	const alert = useAlert();

	const [otp, setOtp] = useState('');

	const { loading, isAuthenticated, error, user } = useSelector(state => state.auth);
	const { loading:otpLoading, isUpdated } = useSelector(state => state.user);



	const submitHandler = (e) => {
		e.preventDefault();
		const formData = new FormData();
         
            formData.set('otp',otp);

        dispatch(checkOtp(formData))
	}

	const refreshOtpHandler = (e) => {
		e.preventDefault();

        dispatch(refreshOtp())
	}

	useEffect(()=>{

		if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

       if(user === undefined){
        dispatch(loadUser())
       }

       console.log(user === undefined)

       if(isUpdated){
       	 alert.success("Code Successfully Sent To Your Email")
       	 dispatch({type: UPDATE_USER_RESET})
       }

        if((user&&user.otp_status === "Verified") || localStorage.getItem("user")&&JSON.parse(localStorage.getItem("user")).otp_status === "Verified"){
           	dispatch(loadUser())
            if((user&&user.role === "administrator")|| JSON.parse(localStorage.getItem("user")).role === "administrator"){
            	navigate('/admin/dashboard')
            }
            else if((user&&user.role === "garbageCollector")|| JSON.parse(localStorage.getItem("user")).role === "garbageCollector"){
            	navigate('/collector/profile')
            }
            else if((user&&user.role === "barangayAdministrator")|| JSON.parse(localStorage.getItem("user")).role === "barangayAdministrator"){
            	navigate('/barangay/profile')
            }
            else if((user&&user.role === "user")|| JSON.parse(localStorage.getItem("user")).role === "user"){
               navigate('/newsfeed')
            }
            else if((user&&user.role === "newUser")|| JSON.parse(localStorage.getItem("user")).role === "newUser"){
               navigate('/newsfeed')
            }
        }


	},[dispatch,loading, isAuthenticated, error, user, otpLoading, isUpdated])
// dispatch,loading, isAuthenticated, error, user, otpLoading, isUpdated
	return(
		<Fragment>
			{/*{loading?<Loader/>:*/}
			<div className="bh-register">
				<h1>Sign up</h1>
				<form onSubmit={submitHandler}>
					<div className="otp-box">
						<h2 className="fw-bold">Enter 6-digit code</h2>
						<p>Your code was sent to {localStorage.getItem("user")&&JSON.parse(localStorage.getItem("user")).email}</p>
							{/*https://www.npmjs.com/package/react-otp-input*/}
							<OtpInput
								onChange={(otp)=>setOtp(otp)}
								numInputs={6}
								inputStyle="otp-input"
								focusStyle="otp-focus"
								separator={<span>&nbsp;&nbsp;</span>}
								value={otp}
								isInputNum
							/>
							<br/>
							{otpLoading?<b>Code Sending...</b>:
							<a href="#" onClick={refreshOtpHandler} ><b>Resend Code</b></a>
							}
						<button className="btn bh-submitBtn" type="submit">Submit</button>
					</div>
				</form>
			</div>
			{/*}*/}
		</Fragment>
		)
}


export default RegisterOTP;