import React, {Fragment, useEffect} from 'react';
import Sidebar from '../../../components/layouts/sidebar';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, clearErrors} from '../../../actions/userActions'
import { Link, useNavigate, useParams} from 'react-router-dom'
import Loader from '../../layouts/Loader'
import MetaData from '../../../components/layouts/MetaData'
	
const UsersView = () => {
	const alert = useAlert();
    const dispatch = useDispatch();
    const {id} = useParams()

    const { loading, user, error, userBrgyRank, userCityRank} = useSelector(state => state.userDetails)

    let navigate = useNavigate() 

    useEffect(()=>{
        if(error){
         alert.error(error)
        }  
       
       dispatch(getUserDetails(id));

       // console.log("user",user&&user.size())
       // console.log("userDumps",userDumps.success)
       // console.log("userDonatedItems",userDonatedItems)

    }, []);

	return(
		<Fragment>
		<MetaData title={`${user&&user.first_name} ${user&&user.last_name}`} />
			<div className="bh-dashboard">
				<div>
					<Sidebar/>
				</div>
				

				{loading?<Loader/>:
				<div className="bh-dashboard-section">
				{console.log("user",user.donated_items&&user.donated_items.length)}
					<h5 className="py-2 px-3">
					User Information</h5>
					<hr className="m-0"/>
					<div className="contents">
						<p className="section">Account</p>
						<div className="account">
							<div className="row m-auto">
								<div className="col-lg-auto col-sm-12 m-auto">
									<div className="account-img mb-1" style={{backgroundImage: `url(${user&&user.avatar&&user.avatar.url})`}}></div>
								</div>
								<div className="col-lg-9 col-sm-12 m-auto">
									<div className="row row-cols-lg-4 row-cols-md-4 row-cols-2">
										<div className="col"><b>ID:</b></div>
										<div className="col">{user._id}</div>
										<div className="col"><b>EMAIL:</b></div>
										<div className="col">{user.email}</div>
										<div className="col"><b>ALIAS/USERNAME:</b></div>
										<div className="col">{user.alias}</div>
										<div className="col"><b>ROLE:</b></div>
										<div className="col">{user.role}</div>
										{user&&user.role === 'garbageCollector'?
										<Fragment>
										<div className="col"><b>JOB DESC:</b></div>
										<div className="col">{user.jobDesc}</div>
										</Fragment>
											:""
										}
										<div className="col"><b>DATE CREATED:</b></div>
										<div className="col">{new Date(user.createdAt).toDateString()}</div>
									</div>
								</div>
							</div>
						</div>
						<p className="section">Statistics</p>
						<div className="statistics">
							<span className="statistics-item"><p className="statistics-number">{user.reported_dumps&&user.reported_dumps.length}</p>Reported Dumps</span>
							<span className="statistics-item"><p className="statistics-number">{user.donated_items&&user.donated_items.length}</p>Donated Items</span>
							<span className="statistics-item"><p className="statistics-number">{userBrgyRank}</p>Barangay Rank</span>
							<span className="statistics-item"><p className="statistics-number">{userCityRank}</p>City Rank</span>
							<span className="statistics-item"><p className="statistics-number level">{user.level}</p>Level</span>
							<span className="statistics-item"><p className="statistics-number">{user.exp}</p>Exp.</span>
						</div>
						<p className="section">Personal</p>
						<div className="row row-cols-lg-4 row-cols-md-4 row-cols-2 m-auto">
							<div className="col"><b>FIRST NAME:</b></div>
							<div className="col">{user.first_name}</div>
							<div className="col"><b>MIDDLE NAME:</b></div>
							<div className="col">{user.middle_name}</div>
							<div className="col"><b>LAST NAME:</b></div>
							<div className="col">{user.last_name}</div>
							<div className="col"><b>SUFFIX:</b></div>
							<div className="col">{user.suffix?user.suffix:"None"}</div>
							<div className="col"><b>BIRTHDATE:</b></div>
							<div className="col">{new Date(user.birthday).toDateString()}</div>
							<div className="col"><b>AGE:</b></div>
							<div className="col">{new Date().getFullYear()- new Date(user.birthday).getFullYear()}</div>
							<div className="col"><b>GENDER:</b></div>
							{user&&user.gender === undefined ||user&&user.gender === "undefined"?
								<div className="col" style={{color:"gray"}}><i>undefined</i></div>:
								<div className="col">{user.gender}</div>
							}
							<div className="col"><b>PHONE NUMBER:</b></div>
							{user&&user.phone_number === undefined ||user&&user.phone_number === "undefined"?
								<div className="col" style={{color:"gray"}}><i>undefined</i></div>:
								<p>{user && user.phone_number && user.phone_number.substring(0, 2) === "63" ? `+${user.phone_number}` : `${user.phone_number}`}</p>
										
							}
						</div>
						<p className="section">Address</p>
							<div className="row row-cols-lg-4 row-cols-md-4 row-cols-2 m-auto">
								<div className="col"><b>HOUSE NUMBER:</b></div>
								<div className="col">{user.house_number}</div>
								<div className="col"><b>STREET/BUILDING:</b></div>
								<div className="col">{user.street}</div>
								<div className="col"><b>BARANGAY:</b></div>
								<div className="col">{user.barangay}</div>
							</div>		
					</div>
					<hr className="m-0"/>
						<Link to={`/admin/user/${user._id}/edit`} className="btn bh-submitBtn m-3" >Edit</Link>
				</div>
				}

			</div>
		</Fragment>
		)
}

export default UsersView