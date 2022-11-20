import React, {Fragment, useEffect} from 'react';
import SidebarCollector from '../../components/layouts/sidebar-collector';
import { loadUser, clearErrors} from '../../actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { Link, useNavigate} from 'react-router-dom'
import MetaData from '../../components/layouts/MetaData'
	
const CollectorProfile = () => {

	const alert = useAlert();
    const dispatch = useDispatch();
	let navigate = useNavigate() 

	const { loading, user, isAuthenticated, error} = useSelector(state => state.auth)
  
	const ageCounter = (user) => {
		let age = null;
		if(user) {
			const dateToday = new Date();
			const birthDate = new Date(user.birthday);
			age = dateToday.getFullYear() - birthDate.getFullYear();
		}
		return age;
	}
	
	useEffect(()=>{
		if(localStorage.getItem("isAuthenticated") &&!localStorage.getItem("user")){
  		 dispatch(loadUser())
  		}

  		if(error){
  		alert.error(error)
  		dispatch(clearErrors())
  		}



	},[ dispatch, user, isAuthenticated])

	return(
		<Fragment>
		<MetaData title={`${user&&user.first_name} ${user&&user.last_name}`} />
			<div className="bh-container">
				<div>
					<SidebarCollector/>
				</div>
				<div className="bh-container-3 px-3 m-auto">
					<div className="bh-profile row">
						<div className="profile-info col-md-8 col-sm-12 mx-auto">
							<div className="profile-img" style={{backgroundImage: `url(${user && user.avatar && user.avatar.url})`}}></div>
							<h3 className="text-center">{user && (user.first_name + " " + user.last_name)} <Link to="/collector/profile/update"><i className="bi bi-pen table-icons"></i></Link> <Link to="/collector/password/update"><i class="bi bi-key table-icons" style={{fontSize:"25px", position:"relative", top:"3px"}}></i></Link> </h3>
							<div className="row row-cols-2 mx-xl-5 mx-auto px-lg-5 ">
								<div className="col-5">
									<p>Role:</p>
								</div>
								<div className="col-7">
									<p>Garbage Collector <b>({user&&user.jobDesc})</b></p>
								</div>
								<div className="col-5">
									<p>Email:</p>
								</div>
								<div className="col-7">
									<p>{user && user.email}</p>
								</div>
								<div className="col-5">
									<p>Phone No.:</p>
								</div>
								<div className="col-7">
									<p>{user&&user.phone_number&&user.phone_number.substring(0,2)==="63"?`+${user.phone_number}`:`${user.phone_number}`}</p>
								</div>
								<div className="col-5">
									<p>Age:</p>
								</div>
								<div className="col-7">
									<p>{ageCounter(user)}</p>
								</div>
								<div className="col-5">
									<p>Gender:</p>
								</div>
								<div className="col-7">
									<p>{user && user.gender}</p>
								</div>
								<div className="col-5">
									<p>Address:</p>
								</div>
								<div className="col-7">
									<p>{user && (user.house_number + " " + user.street + ", " + user.barangay)}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
		)
}

export default CollectorProfile