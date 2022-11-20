import React, { Fragment, useEffect, useState } from 'react';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { login, loadUser, clearErrors } from '../../actions/userActions'
import Loader from '../layouts/Loader'
import { useNavigate, Link } from 'react-router-dom';
import MetaData from '../../components/layouts/MetaData'


const Login = () => {

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState('')


	const alert = useAlert();
	const dispatch = useDispatch();
	const { loading, isAuthenticated, user, error } = useSelector(state => state.auth)
	let navigate = useNavigate()

	useEffect(() => {

		if (isAuthenticated || localStorage.getItem("isAuthenticated")) {
			dispatch(loadUser())
			if (user && user.otp_status === "Verified" || JSON.parse(localStorage.getItem("user")).otp_status === "Verified") {
				if (user && user.role === "administrator" || JSON.parse(localStorage.getItem("user")).role === "administrator") {
					navigate('/admin/dashboard')
				}
				else if (user && user.role === "garbageCollector" || JSON.parse(localStorage.getItem("user")).role === "garbageCollector") {
					navigate('/collector/profile')
				}
				else if (user && user.role === "barangayAdministrator" || JSON.parse(localStorage.getItem("user")).role === "barangayAdministrator") {
					navigate('/barangay/dashboard')
				}
				else if (user && user.role === "user" || JSON.parse(localStorage.getItem("user")).role === "user") {
					navigate('/newsfeed')
				}
				else if (user && user.role === "newUser" || JSON.parse(localStorage.getItem("user")).role === "newUser") {
					navigate('/newsfeed')
				}
				else if (user && user.role === "banned" || JSON.parse(localStorage.getItem("user")).role === "banned") {
					navigate('/user-banned')
				}

			} else {
				navigate('/register/email-verification')
			}
		}


		// if(isAuthenticated || localStorage.getItem("isAuthenticated")){
		// 	// dispatch(loadUser())
		// 		 //       navigate('/register/email-verification')
		//    }
		if (error) {
			setErrorMessage(error)
			alert.error(error)
			dispatch(clearErrors())
		}
	}, [error, isAuthenticated])


	const submitEventHandler = (e) => {
		e.preventDefault();
		dispatch(login(email, password))
	}

	return (
		<Fragment>
			<MetaData title={"Login"} />
			{loading && loading ? <Loader /> :
				<div className="bh-login">
					<div className="row m-auto">
						<div className="col-lg col-md-auto col-sm-auto col-auto login-box">
							{errorMessage === ''?"":<div class="alert alert-danger" role="alert" style={{ fontSize: "12px", padding: "8px" }}>
								{errorMessage}
							</div>
							}
							<h1 className="text-center">Login</h1>
							<form onSubmit={submitEventHandler}>
								<p className="m-0">Email</p>
								<input type="email" onChange={(e) => { setEmail(e.target.value) }} className="form-control" required />

								<p className="m-0">Password</p>
								<input type="password" onChange={(e) => { setPassword(e.target.value) }} className="form-control" required />

								<button type="submit" className="btn bh-loginBtn">Login</button>

								<p className="m-0 text-center"><Link to="/forgot-password">Forgot Password?</Link></p>
								<p className="m-0 text-secondary text-center">Don't have an account? <Link to="/register">Sign up</Link></p>
							</form>
						</div>
						<div className="col-lg-auto col-md-auto col-sm-auto col-auto login-title">
							<p className="login-title-1 user-select-none">WELCOME TO</p>
							<p className="login-title-2 user-select-none">BasuraHunt!</p>
						</div>
					</div>
				</div>
			}
		</Fragment>
	)
}
export default Login