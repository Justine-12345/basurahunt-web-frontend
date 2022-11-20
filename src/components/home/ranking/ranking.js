import React, {Fragment, useEffect, useState} from 'react';
import SidebarUser from '../../../components/layouts/sidebar-user';
import SidebarBarangay from '../../../components/layouts/sidebar-barangay';
import SidebarCollector from '../../../components/layouts/sidebar-collector';
import Sidebar from '../../../components/layouts/sidebar';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import LoaderNoBg from '../../layouts/LoaderNoBg'
import { rankings, clearErrors} from '../../../actions/dumpActions'
import Kapitan from './kapitan'
import MetaData from '../../../components/layouts/MetaData'

const Ranking = () => {

	const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, mostReportedBrgyDone, mostReportedBrgyUndone, topBrgyUser, topCityUser } = useSelector(state => state.ranking)
    const { user } = useSelector(state => state.auth)
  
    useEffect(()=>{

     	dispatch(rankings());

	},[])

    useEffect(()=>{

		if (error) {
            return alert.error(error)
        }

     	dispatch(rankings());

	},[error])

	return(
		<Fragment>
		<MetaData title={"Ranking"} />
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
				<div className="bh-container-3 px-md-3 px-0 pb-sm-0 pb-3">
					<h3 className="px-md-0 px-3">Ranking</h3>

					{/*Barangays*/}
					<div className="bh-ranking pb-3">
						<h3>Barangays with Most Reported Illegal Dumps</h3>
						
						<div className="row row-cols-2 text-center fw-bold m-auto">
							<div className="col-lg-4 col-sm-6">
								<p>Barangay</p>
							</div>
							<div className="col-lg-4 col-sm-3">
								<p>Report Count</p>
							</div>
						</div>
						{mostReportedBrgyUndone&&mostReportedBrgyUndone.map((brgy)=>{
							return(
									<Fragment>
									<hr/>
									<div className="row row-cols-2 text-center m-auto">
										<div className="col-lg-4 col-sm-6">
											<p className="rank-barangay m-0 fw-bold">{brgy._id}</p>
											<p className="rank-brgy-cap">Kap. <Kapitan barangay={brgy._id}/></p>
										</div>
										<div className="col-lg-4 col-sm-3">
											<p>{brgy.count}</p>
										</div>
									</div>
									
									</Fragment>
								)
						})
						}
					</div>
					<br/>
					{/*Barangays Cleaned*/}
					<div className="bh-ranking pb-3">
						<h3>Barangays with Most Cleaned Illegal Dumps</h3>
						
						<div className="row row-cols-3 text-center fw-bold m-auto">
							<div className="col-lg-4 col-sm-6">
								<p>Barangay</p>
							</div>
							<div className="col-lg-4 col-sm-3">
								<p>Cleaned Count</p>
							</div>
						</div>

						{mostReportedBrgyDone&&mostReportedBrgyDone.map((brgy)=>{
							return(
									<Fragment>
										<hr/>
										<div className="row row-cols-3 text-center m-auto">
											<div className="col-lg-4 col-sm-6">
												<p className="rank-barangay m-0 fw-bold">{brgy._id}</p>
												<p className="rank-brgy-cap">Kap. <Kapitan barangay={brgy._id}/></p>
											</div>
											<div className="col-lg-4 col-sm-3">
												<p>{brgy.count}</p>
											</div>
										</div>
									</Fragment>
								)
						})
						}

					</div>





					{/*Specific Barangay*/}
					<div className="bh-ranking my-3">
						<h3>Barangay {user&&user.barangay} Top 10 Users</h3>
						
						<div className="row row-cols-3 text-center fw-bold m-auto">
							<div className="col-lg-4 col-sm-5 col-6">
							</div>
							<div className="col-lg-4 col-sm-4 col-3">
								<p>Level</p>
							</div>
							<div className="col-lg-4 col-sm-3 col-3">
								<p>Current Rank</p>
							</div>
						</div>

						{topBrgyUser&&topBrgyUser.map((userDetail)=>{
							let user = userDetail._id
							console.log(user)
							return(
									<Fragment>
										<hr/>
										<div className="row row-cols-3 text-center m-auto">
										<div className="col-lg-4 col-sm-5 col-6">
											<p className="m-0 rank-name">{user.alias}</p>
										</div>
										<div className="col-lg-4 col-sm-4 col-3">
											<p>Level {user.level}</p>
										</div>
										<div className="col-lg-4 col-sm-3 col-3">
											{user.level>=1 && user.level<=5?
												<div className="rank-badge" style={{backgroundImage:"url('https://res.cloudinary.com/basurahunt/image/upload/v1659106961/BasuraHunt/Badges/badge1-sm_ufs5x3.png')"}}/>:""
											}
											{user.level>=6 && user.level<=10?
												<div className="rank-badge" style={{backgroundImage:"url('https://res.cloudinary.com/basurahunt/image/upload/v1659106961/BasuraHunt/Badges/badge2-sm_dqizcs.png')"}}/>:""
											}
											{user.level>=11 && user.level<=15?
												<div className="rank-badge" style={{backgroundImage:"url('https://res.cloudinary.com/basurahunt/image/upload/v1659106961/BasuraHunt/Badges/badge3-sm_uqgaye.png')"}}/>:""
											}
											{user.level>=16 && user.level<=20?
												<div className="rank-badge" style={{backgroundImage:"url('https://res.cloudinary.com/basurahunt/image/upload/v1659106961/BasuraHunt/Badges/badge4-sm_mwrk05.png')"}}/>:""
											}
										</div>
										</div>
									</Fragment>
								)
						})
						}
					</div>

				{/*Taguig City*/}
					<div className="bh-ranking">
						<h3>Taguig City Top 10 Users</h3>
						
						<div className="row row-cols-3 text-center fw-bold m-auto">
							<div className="col-lg-4 col-sm-5 col-6">
							</div>
							<div className="col-lg-4 col-sm-4 col-3">
								<p>Level</p>
							</div>
							<div className="col-lg-4 col-sm-3 col-3">
								<p>Current Rank</p>
							</div>
						</div>
						
						{topCityUser&&topCityUser.map((userDetail)=>{
							let user = userDetail._id
							console.log(user)
							return(
									<Fragment>
										<hr/>
										<div className="row row-cols-3 text-center m-auto">
										<div className="col-lg-4 col-sm-5 col-6">
											<p className="m-0 rank-name">{user.alias}</p>
										</div>
										<div className="col-lg-4 col-sm-4 col-3">
											<p>Level {user.level}</p>
										</div>
										<div className="col-lg-4 col-sm-3 col-3">
											{user.level>=1 && user.level<=5?
												<div className="rank-badge" style={{backgroundImage:"url('https://res.cloudinary.com/basurahunt/image/upload/v1659106961/BasuraHunt/Badges/badge1-sm_ufs5x3.png')"}}/>:""
											}
											{user.level>=6 && user.level<=10?
												<div className="rank-badge" style={{backgroundImage:"url('https://res.cloudinary.com/basurahunt/image/upload/v1659106961/BasuraHunt/Badges/badge2-sm_dqizcs.png')"}}/>:""
											}
											{user.level>=11 && user.level<=15?
												<div className="rank-badge" style={{backgroundImage:"url('https://res.cloudinary.com/basurahunt/image/upload/v1659106961/BasuraHunt/Badges/badge3-sm_uqgaye.png')"}}/>:""
											}
											{user.level>=16 && user.level<=20?
												<div className="rank-badge" style={{backgroundImage:"url('https://res.cloudinary.com/basurahunt/image/upload/v1659106961/BasuraHunt/Badges/badge4-sm_mwrk05.png')"}}/>:""
											}
										</div>
										</div>
									</Fragment>
								)
						})
						}
						
					</div>
				</div>
			}
			</div>
		</Fragment>
		)
}

export default Ranking