import React, { Fragment, useEffect, useState } from 'react';
import SidebarUser from '../../components/layouts/sidebar-user';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser, getLevelExp, clearErrors } from '../../actions/userActions'
import { Link, useNavigate } from 'react-router-dom'
import LoaderNoBg from '../layouts/LoaderNoBg'
import PDFFile from '../PDFFile'
import MetaData from '../../components/layouts/MetaData'
import { SOCKET_PORT } from '../../constants/socketConstants'
import io from "socket.io-client";
const socket = io.connect(SOCKET_PORT);

const Profile = () => {

	const alert = useAlert();
	const dispatch = useDispatch();
	let navigate = useNavigate()
	const { loading, user, isAuthenticated, userBrgyRank, userCityRank, error } = useSelector(state => state.auth)
	const { levelExp } = useSelector(state => state.levelExp)


	useEffect(() => {
		dispatch(getLevelExp())
		if (localStorage.getItem("isAuthenticated") && !localStorage.getItem("user")) {
			dispatch(loadUser())
		}

		if (user && !user.email) {
			dispatch(loadUser())
		}

		if (error) {
			alert.error(error)
			dispatch(clearErrors())
		}




	}, [dispatch, error, levelExp])

	useEffect(() => {
		socket.on("receive_message", (data) => {
			console.log(data)
			if (data.category === "illegalDump-update-status" || data.category === "illegalDump-update") {
				dispatch(loadUser())
			}
		})
	}, [socket])


	const getAge = (d1, d2) => {
		d2 = d2 || new Date();
		var diff = d2.getTime() - d1.getTime();
		return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
	}

	const getLvlTotalExp = (level) => {
		let lvlTotalExp = 0

		if (level >= 1 && level <= 5) {
			lvlTotalExp = 200
		}
		if (level >= 6 && level <= 10) {
			lvlTotalExp = 300
		}
		if (level >= 11 && level <= 15) {
			lvlTotalExp = 400
		}
		if (level >= 16 && level <= 20) {
			lvlTotalExp = 500
		}

		return lvlTotalExp
	}

	const getOldExp = (level) => {
		let oldExp = 0

		if (level >= 2 && level <= 5) {
			oldExp = (level - 1) * 200
		}

		if (level === 6) {
			oldExp = 1000
		}
		if (level === 7) {
			oldExp = 1300
		}
		if (level === 8) {
			oldExp = 1600
		}
		if (level === 9) {
			oldExp = 1900
		}
		if (level === 10) {
			oldExp = 2200
		}
		if (level === 11) {
			oldExp = 2500
		}
		if (level === 12) {
			oldExp = 2900
		}
		if (level === 13) {
			oldExp = 3300
		}
		if (level === 14) {
			oldExp = 3700
		}
		if (level === 15) {
			oldExp = 4100
		}
		if (level === 16) {
			oldExp = 4500
		}
		if (level === 17) {
			oldExp = 5000
		}
		if (level === 18) {
			oldExp = 5500
		}
		if (level === 19) {
			oldExp = 6000
		}
		if (level === 20) {
			oldExp = 6500
		}


		return oldExp

	}




	return (
		<Fragment>
			<MetaData title={`${user && user.first_name} ${user && user.last_name}`} />
			<div className="bh-container">
				<div>
					<SidebarUser />
				</div>
				{loading ? <LoaderNoBg /> :
					<div className="bh-container-3 px-3 m-auto">
						<div className="bh-profile row g-0">
							<div className="profile-info col-md-5 col-sm-12">
								<div className="profile-img" style={{ backgroundImage: `url(${user && user.avatar && user.avatar.url})` }}></div>
								<h3 className="text-center">{user && user.first_name} {user && user.last_name} <Link to={`/${user && user.alias}/update`}><i className="bi bi-pen table-icons"></i></Link>  <Link to={`/${user && user.alias}/update/password`}><i class="bi bi-key table-icons" style={{ fontSize: "25px", position: "relative", top: "3px" }}></i></Link>  </h3>
								<div className="row row-cols-2 mx-auto">
									<div className="col-5">
										<p>Alias:</p>
									</div>
									<div className="col-7">
										<p>{user && user.alias}</p>
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
										{user && user.phone_number === undefined || user && user.phone_number === "undefined" ?
											<p style={{ color: "gray" }}><i>undefined</i></p> :
											<p>{user && user.phone_number && user.phone_number.substring(0, 2) === "63" ? `+${user.phone_number}` : `${user.phone_number}`}</p>
										}
									</div>
									<div className="col-5">
										<p>Age:</p>
									</div>
									<div className="col-7">
										<p>{getAge(new Date(user && user.birthday))}</p>
									</div>
									<div className="col-5">
										<p>Gender:</p>
									</div>
									<div className="col-7">
										{user && user.phone_number === undefined || user && user.phone_number === "undefined" ?
											<p style={{ color: "gray" }}><i>undefined</i></p> :
											<p>{user && user.gender}</p>
										}
									</div>
									<div className="col-5">
										<p>Address:</p>
									</div>
									<div className="col-7">
										<p>{user && user.house_number} {user && user.street} {user && user.barangay}, Taguig City</p>
									</div>
									{user && user.level && user.level >= 6 ?
										<PDFFile first_name={user && user.first_name} last_name={user && user.last_name} level={levelExp && levelExp.level} /> : ""
									}
								</div>

							</div>
							<div className="profile-status col-md-7 col-sm-12">
								<div className="row row-cols-1 w-100 g-0">
									<div className="profile-level d-flex flex-column col">
										<div className="my-auto">
											<h4 className="fw-bold m-0">Level {levelExp && levelExp.level}</h4>
											<div className="progress my-3">
												<div className="progress-bar profile-exp" role="progressbar" aria-label="Exp" style={{ width: `${((levelExp && levelExp.exp - getOldExp(levelExp && levelExp.level)) / getLvlTotalExp(levelExp && levelExp.level)) * 100}%` }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
											</div>
											<p className="m-0 float-sm-start">EXP: {levelExp && levelExp.exp - getOldExp(levelExp && levelExp.level)} </p>
											<p className="m-0 float-sm-end">{getLvlTotalExp(levelExp && levelExp.level) - (levelExp && levelExp.exp - getOldExp(levelExp && levelExp.level))} exp to reach next level!</p>
										</div>
									</div>
									<div className="profile-rank d-flex flex-column col">
										<div className="my-auto">
											<h4 className="fw-bold m-0">Rank</h4>
											<div className="user-badges">

												{levelExp && levelExp.level && levelExp.level >= 1 && levelExp && levelExp.level && levelExp.level <= 5 ?
													<div className="user-badge-container">
														<div className="user-badge" style={{ backgroundImage: "url('https://res.cloudinary.com/basurahunt/image/upload/v1659103339/BasuraHunt/Badges/badge1_xokt97.png')" }}></div>
														<small>Eco Warrior <br /><span style={{ fontSize: "12px" }}><i>(current rank)</i></span></small>
													</div> : ""
												}

												{levelExp && levelExp.level && levelExp.level >= 6 && levelExp && levelExp.level && levelExp.level <= 10 ?
													<Fragment>
														<div className="user-badge-container">
															<div className="user-badge" style={{ backgroundImage: "url('https://res.cloudinary.com/basurahunt/image/upload/v1659103339/BasuraHunt/Badges/badge1_xokt97.png')" }}></div>
															<small>Eco Warrior</small>
														</div>
														<div className="user-badge-container">
															<div className="user-badge" style={{ backgroundImage: "url('https://res.cloudinary.com/basurahunt/image/upload/v1659103339/BasuraHunt/Badges/badge2_wdxfex.png')" }}></div>
															<small>Eco Master <br /><span style={{ fontSize: "12px" }}><i>(current rank)</i></span></small>
														</div>
													</Fragment>
													: ""
												}

												{levelExp && levelExp.level && levelExp.level >= 11 && levelExp && levelExp.level && levelExp.level <= 15 ?
													<Fragment>
														<div className="user-badge-container">
															<div className="user-badge" style={{ backgroundImage: "url('https://res.cloudinary.com/basurahunt/image/upload/v1659103339/BasuraHunt/Badges/badge1_xokt97.png')" }}></div>
															<small>Eco Warrior</small>
														</div>
														<div className="user-badge-container">
															<div className="user-badge" style={{ backgroundImage: "url('https://res.cloudinary.com/basurahunt/image/upload/v1659103339/BasuraHunt/Badges/badge2_wdxfex.png')" }}></div>
															<small>Eco Master</small>
														</div>
														<div className="user-badge-container">
															<div className="user-badge" style={{ backgroundImage: "url('https://res.cloudinary.com/basurahunt/image/upload/v1659103339/BasuraHunt/Badges/badge3_fuljyi.png')" }}></div>
															<small>Eco King <br /><span style={{ fontSize: "12px" }}><i>(current rank)</i></span></small>
														</div>
													</Fragment>
													: ""
												}

												{levelExp && levelExp.level && levelExp.level >= 16 && levelExp && levelExp.level && levelExp.level <= 20 ?
													<Fragment>
														<div className="user-badge-container">
															<div className="user-badge" style={{ backgroundImage: "url('https://res.cloudinary.com/basurahunt/image/upload/v1659103339/BasuraHunt/Badges/badge1_xokt97.png')" }}></div>
															<small>Eco Warrior</small>
														</div>
														<div className="user-badge-container">
															<div className="user-badge" style={{ backgroundImage: "url('https://res.cloudinary.com/basurahunt/image/upload/v1659103339/BasuraHunt/Badges/badge2_wdxfex.png')" }}></div>
															<small>Eco Master</small>
														</div>
														<div className="user-badge-container">
															<div className="user-badge" style={{ backgroundImage: "url('https://res.cloudinary.com/basurahunt/image/upload/v1659103339/BasuraHunt/Badges/badge3_fuljyi.png')" }}></div>
															<small>Eco King</small>
														</div>
														<div className="user-badge-container">
															<div className="user-badge" style={{ backgroundImage: "url('https://res.cloudinary.com/basurahunt/image/upload/v1659103340/BasuraHunt/Badges/badge4_x95wme.png')" }}></div>
															<small>Eco Hero <br /><span style={{ fontSize: "12px" }}><i>(current rank)</i></span></small>
														</div>
													</Fragment>
													: ""
												}
											</div>
											<h4 className="fw-bold">Statistics</h4>
											<div className="user-stats">
												<div className="user-stat-container">
													<div className="user-stat">{user && user.reported_dumps && user.reported_dumps.length}</div>
													<small>Reported Dumps</small>
												</div>
												<div className="user-stat-container">
													<div className="user-stat">{user && user.donated_items && user.donated_items.length}</div>
													<small>Donated Items</small>
												</div>
												<div className="user-stat-container">
													<div className="user-stat">{userBrgyRank && userBrgyRank}</div>
													<small>Barangay Ranking</small>
												</div>
												<div className="user-stat-container">
													<div className="user-stat">{userCityRank && userCityRank}</div>
													<small>Overall Ranking</small>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				}
			</div>
		</Fragment>
	)
}

export default Profile