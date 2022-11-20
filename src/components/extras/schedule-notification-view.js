import React, {Fragment, useEffect, useState} from 'react';
import SidebarUser from '../../components/layouts/sidebar-user';
import SidebarBarangay from '../../components/layouts/sidebar-barangay';
import SidebarCollector from '../../components/layouts/sidebar-collector';
import Sidebar from '../../components/layouts/sidebar';
import { updateProfile, loadUser, clearErrors} from '../../actions/userActions'
import { Link, useParams} from 'react-router-dom'
import LoaderNoBg from '../layouts/LoaderNoBg'
import { useSelector } from 'react-redux'

const ScheduleNotificationView = () => {

	const {user } = useSelector(state => state.auth)
	const {title} = useParams()
	return(
			<Fragment>
				<div className="bh-dashboard">
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
				<div className="bh-dashboard-section">
					<h3 className="fw-bold text-center" style={{backgroundColor:"Green", padding:"24px", color:"white"}}>{title.split("|")[0]}</h3>
					<br/>
					<h4 className="fw-bold text-center">{title.split("|")[1]}</h4>
					<h4 className="fw-bold text-center">{title.split("|")[2]}</h4>
					<h4 className="fw-bold text-center">{title.split("|")[3]}</h4><br/>
					{user&&user.role === "garbageCollector"?
						<h4 className="fw-bold text-center"><Link to={'/collector/schedule/today'} className="btn btn-success"><b>Show Collection Today</b></Link></h4>:
						<h4 className="fw-bold text-center"><Link to={'/schedule/today'} className="btn btn-success"><b>Show Collection Today</b></Link></h4>
						
					}
					</div>
			</div>
		</Fragment>


		)


}

export default ScheduleNotificationView