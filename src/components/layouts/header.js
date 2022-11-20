import React, {Fragment,useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import {loadUser, readNofication, logout, clearErrors} from '../../actions/userActions'
import { READ_NOTIFICATION_RESET } from '../../constants/userConstants'
import moment from 'moment';
import { SOCKET_PORT } from '../../constants/socketConstants'
import io from "socket.io-client";
const socket = io.connect(SOCKET_PORT);

const Header = () => {

  const alert = useAlert();
  const dispatch = useDispatch();
  let navigate = useNavigate() 

  const { loading, user, isAuthenticated, error} = useSelector(state => state.auth)
  const { isRead } = useSelector(state => state.notification)
  const [notificationList, setNotificationList] = useState([])
  let unReadNotificationCounter = 0
  const audio = new Audio('/sounds/notification.mp3');
  useEffect(()=>{

  	// console.log(Object.keys(user).length === 0)

  	if(localStorage.getItem("isAuthenticated") &&!localStorage.getItem("user")){
  		 
  		 dispatch(loadUser())
  	}

  	if(user&&!user._id){		
  		 dispatch(loadUser())
  	}
  	setNotificationList([])
  	user&&user.notifications&&user.notifications.forEach(data => {
									setNotificationList((list)=>[...list,data]);
			})


  	if(isRead){
  		dispatch({ type: READ_NOTIFICATION_RESET });
  	}

  	if(error){
  		alert.error(error)
  		dispatch(clearErrors())
  	}

  	if(!localStorage.getItem("user")&&isAuthenticated===false){
  		navigate("/login")
  	}

  	socket.emit("join_room", 'basurahunt-notification-3DEA5E28CE9B6E926F52AF75AC5F7-94687284AF4DF8664C573E773CF31')


  },[isAuthenticated])



   useEffect(()=>{
			socket.on("receive_message", (data) => {
				console.log(data)

				

				if(JSON.parse(localStorage.getItem("user")).role === "administrator"){
						if(data.category === "schedule"){
								if(String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  					audio.play()
											setNotificationList((list)=>[...list,data]);
									}
						}
						if(data.category === "illegalDump-new"){
									audio.play()
									setNotificationList((list)=>[...list,data]);
						}
						if(data.category === "illegalDump-new-message"){
								if(data.sender !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
								}
						}
						if(data.category === "donation-new"){
								if(String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
							  			audio.play()
											setNotificationList((list)=>[...list,data]);
								}

						}
						if(data.category === "collection-mass-add"){
								if(String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
							  			audio.play()
											setNotificationList((list)=>[...list,data]);
								}
								
						}
						if(data.category === "feedback-new"){
								if(String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
							  			audio.play()
											setNotificationList((list)=>[...list,data]);
								}
								
						}
				}

				if(JSON.parse(localStorage.getItem("user")).role === "garbageCollector"){
						if(data.category === "schedule"){
								if( String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)){	
					  					audio.play()
											setNotificationList((list)=>[...list,data]);
									}
						}
						if(data.category === "illegalDump-update"){
								if( String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
								}
						}
				}

				if(JSON.parse(localStorage.getItem("user")).role === "user"){
					if(data.category === "schedule" || data.category === "live"){
						if(!data.receiver && data.barangay === JSON.parse(localStorage.getItem("user")).barangay){	
	  					audio.play()
							setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "illegalDump-update"){
						if( String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "illegalDump-update-status"){
						if( String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "illegalDump-new-message"){
						if(String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "illegalDump-new-comment"){
						if(String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)&&String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "donation-new"){
						if(String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "donation-update-claim"){
						if(String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)&&String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "donation-update-cancel"){
						if(String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)&&String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "donation-update-confirm"){
						if(String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)&&String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "donation-update-receive"){
						if(String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)&&String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "donation-new-message"){
						if(String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)&&String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "newsfeeds-add"){
						if(String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "user-verified"){
						if(String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
						}
					}
				}

				if(JSON.parse(localStorage.getItem("user")).role === "newUser"){
					if(data.category === "schedule" || data.category === "live"){
						if(!data.receiver && data.barangay === JSON.parse(localStorage.getItem("user")).barangay){	
	  					audio.play()
							setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "illegalDump-update"){
						if( String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "illegalDump-update-status"){
						if( String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "illegalDump-new-message"){
						if(String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "illegalDump-new-comment"){
						if(String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)&&String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "newsfeeds-add"){
						if(String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "user-verified"){
						if(String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			audio.play()
									setNotificationList((list)=>[...list,data]);
						}
					}
				}


				if(JSON.parse(localStorage.getItem("user")).role === "barangayAdministrator"){
					if(data.category === "schedule" || data.category === "live"){
						if(!data.receiver && data.barangay === JSON.parse(localStorage.getItem("user")).barangay){	
	  					audio.play()
							setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "illegalDump-new"){
									if( data.barangay === JSON.parse(localStorage.getItem("user")).barangay){	
					  					audio.play()
											setNotificationList((list)=>[...list,data]);
									}
						}
				}
				

			})
		},[socket])



  const logoutHandler = (e) => {
  		e.preventDefault()
  		dispatch(logout())
  		localStorage.clear()
  }

	const userTab = () => {
		if(document.getElementById("user-tab").classList.contains("visually-hidden")){
			document.getElementById("user-tab").classList.remove("visually-hidden");
		}
		else{
			document.getElementById("user-tab").classList.add("visually-hidden");
		}
	}
	const notifTab = () => {
		if(document.getElementById("notif-tab").classList.contains("visually-hidden")){
			document.getElementById("notif-tab").classList.remove("visually-hidden");
		}
		else{
			document.getElementById("notif-tab").classList.add("visually-hidden");
		}
	}

	document.addEventListener('click', function handleClickOutsideTab(event){
		const userTab = document.getElementById("user-tab");
		const userBtn = document.getElementById("bh-userBtn");
		const notifTab = document.getElementById("notif-tab");
		const notifBtn = document.getElementById("bh-notifBtn");

		if((!userTab.contains(event.target))&(!userBtn.contains(event.target))){
			userTab.classList.add("visually-hidden");
		}
		if((!notifTab.contains(event.target))&(!notifBtn.contains(event.target))){
			notifTab.classList.add("visually-hidden");
		}
	});

	const read = (notifCode) =>{
			let refreshNotif = []

			for (var i = 0; i < notificationList.length; i++) {
					const notif = notificationList[i]
					if(notif.notifCode === notifCode){
						notif.status = 'read'
						refreshNotif.push(notif)
					}else{
						refreshNotif.push(notif)
					}

			}
			
			setNotificationList(refreshNotif);

		  console.log("notifCode",notifCode)
		  const formData = new FormData();
        formData.set('notifCode', notifCode);
        

			dispatch(readNofication(formData))
			 notifTab()
	}

	const getNotifLink = (notifObj) => {

			let link = notifObj.link

			if(notifObj.category === "illegalDump-new"){
					if(JSON.parse(localStorage.getItem("user")).role === 'administrator'){
								return link = `/admin${notifObj.link}`
						}
					if(JSON.parse(localStorage.getItem("user")).role === 'barangayAdministrator'){
								return link = `/barangay${notifObj.link}`
					}	
			}

			if(notifObj.category === "illegalDump-update"){
					if(JSON.parse(localStorage.getItem("user")).role === 'administrator'){
								return link = `/admin${notifObj.link}`
						}
					if(JSON.parse(localStorage.getItem("user")).role === 'garbageCollector'){
								return link = `/collector${notifObj.link}`
					}	

			}

			if(notifObj.category === "illegalDump-new-message"){
					if(JSON.parse(localStorage.getItem("user")).role === 'administrator'){
								return link = `/admin${notifObj.link}`
						}
			}

			if(notifObj.category === "donation-new"){
					if(JSON.parse(localStorage.getItem("user")).role === 'administrator'){
								return link = `/admin${notifObj.link}`
						}
			}

			if(notifObj.category === "feedback-new"){
					if(JSON.parse(localStorage.getItem("user")).role === 'administrator'){
								return link = `/admin${notifObj.link}`
						}
			}

			return link
	}

const notifIcon = (data) => {
	const category = data.category
	if(category === "schedule"){
   	return <span className="bi bi-calendar3"/>
  }
  if(category === "live"){
    	return <i class="bi bi-geo-alt"></i>
  }

  if(category === "illegalDump-new"){
     return <span className="bi bi-trash"/>
  }
  if(category === "illegalDump-update"){
     return <span className="bi bi-trash"/>
  }

  if(category === "illegalDump-update-status"){
     return <span className="bi bi-trash"/>
  }

   if(category === "illegalDump-new-message"){
   		if(data.status === 'unread'){
   			return <i class="bi bi-envelope"></i>
   		}else{
   			return <i class="bi bi-envelope-open"></i>
   		}
  }

   if(category === "illegalDump-new-comment"){
    	return <i class="bi bi-chat-right-dots"></i>
  }

   if(category === "donation-new"){
     return <span className="bi bi-box2"/>
  }

   if(category === "donation-update-claim"){
     return <span className="bi bi-box2"/>
  }

  if(category === "donation-update-cancel"){
     return <span className="bi bi-box2"/>
  }

  if(category === "donation-update-confirm"){
     return <span className="bi bi-box2"/>
  }

  if(category === "donation-update-receive"){
     return <span className="bi bi-box2"/>
  }

  if(category === "donation-new-message"){
     	if(data.status === 'unread'){
   			return <i class="bi bi-envelope"></i>
   		}else{
   			return <i class="bi bi-envelope-open"></i>
   		}
  }

  if(category === "collection-mass-add"){
     return <i class="bi bi-truck"></i>
  }

  if(category === "newsfeeds-add"){
   	return <i class="bi bi-newspaper"></i>
  }
   if(category === "feedback-new"){
   	return <i class="bi bi-chat-quote"></i>
  }

  if(category === "user-verified"){
	return <i class="bi bi-person-check-fill"></i>
  }
}

	return(
		<Fragment>
		{/*{console.log(localStorage.getItem("user")&&JSON.parse(localStorage.getItem("user"))[0]&&JSON.parse(localStorage.getItem("user"))[0].first_name)}*/}
		{console.log(user)}
			<div className="bh-header">
				<nav className="navbar navbar-expand-sm navbar-dark">
					<div className="container-fluid">
						
						{user&&user.role === "administrator"?
						<div className="position-relative">
							<Link className="navbar-brand" to="/admin/dashboard">
								<img className="fs-1" alt="BasuraHunt Logo" src="https://res.cloudinary.com/basurahunt/image/upload/v1658224082/BasuraHunt/Static/BasuraHunt_-_logo_v2aymh.png"/>
								<ul>
									<li className="fs-1">BasuraHunt</li>
									<li className="navbar-role">For Administrator</li>
								</ul>
							</Link>
						</div>:
						user&&user.role === "garbageCollector"?
						<div className="position-relative">
							<Link className="navbar-brand" to="/collector/schedule/today">
								<img className="fs-1" alt="BasuraHunt Logo" src="https://res.cloudinary.com/basurahunt/image/upload/v1658224082/BasuraHunt/Static/BasuraHunt_-_logo_v2aymh.png"/>
								<ul>
									<li className="fs-1">BasuraHunt</li>
									<li className="navbar-role">For Collectors</li>
								</ul>
							</Link>
						</div>:
						user&&user.role === "barangayAdministrator"?
						<div className="position-relative">
							<Link className="navbar-brand" to="/barangay/dashboard">
								<img className="fs-1" alt="BasuraHunt Logo" src="https://res.cloudinary.com/basurahunt/image/upload/v1658224082/BasuraHunt/Static/BasuraHunt_-_logo_v2aymh.png"/>
								<ul>
									<li className="fs-1">BasuraHunt</li>
									<li className="navbar-role">For Barangay</li>
								</ul>
							</Link>
						</div>:
						user&&user.role === "user"?
						<Link className="navbar-brand fs-1" to="/newsfeed">
							<img alt="BasuraHunt Logo" src="https://res.cloudinary.com/basurahunt/image/upload/v1658224082/BasuraHunt/Static/BasuraHunt_-_logo_v2aymh.png"/>BasuraHunt
						</Link>:
						user&&user.role === "newUser"?
						<Link className="navbar-brand fs-1" to="/newsfeed">
							<img alt="BasuraHunt Logo" src="https://res.cloudinary.com/basurahunt/image/upload/v1658224082/BasuraHunt/Static/BasuraHunt_-_logo_v2aymh.png"/>BasuraHunt
						</Link>:
						user&&user.role === "banned"?
						<Link className="navbar-brand fs-1" to="/user-banned">
							<img alt="BasuraHunt Logo" src="https://res.cloudinary.com/basurahunt/image/upload/v1658224082/BasuraHunt/Static/BasuraHunt_-_logo_v2aymh.png"/>BasuraHunt
						</Link>:
						""
						}
						{!user?
						<Link className="navbar-brand fs-1" to="/">
							<img alt="BasuraHunt Logo" src="https://res.cloudinary.com/basurahunt/image/upload/v1658224082/BasuraHunt/Static/BasuraHunt_-_logo_v2aymh.png"/>BasuraHunt
						</Link>:""
						}
						

						<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bh-header" aria-controls="bh-header" aria-expanded="false" aria-label="Toggle navigation">
							<span className="navbar-toggler-icon"></span>
						</button>
						<div className="collapse navbar-collapse" id="bh-header">

		{/*			{localStorage.getItem("isAuthenticated")?
							<div className="navbar-nav ms-auto logged-in">
								<a className="nav-link me-2" href="/" id="bh-notifBtn"><span className="bi bi-bell-fill"/></a>
								<a className="nav-link" href="/" id="bh-userBtn"><div style={{backgroundImage: `url(${user&&user.avatar&&user.avatar.url})`}}/>{user&&user.first_name} {user&&user.last_name}</a>
							</div>:
							<div className="navbar-nav ms-auto guest">
								<Link className="nav-link" to="/login" id="bh-loginBtn">Login</Link>
								<Link className="nav-link" to="/register" id="bh-registerBtn">Sign Up</Link>
							</div>
					}*/}
						{localStorage.getItem("isAuthenticated")?
								<Fragment>

							
								<span className="nav-span nav-link" id="bh-notifBtn" onClick={()=>notifTab()}> 
								{JSON.parse(localStorage.getItem("user")).role !== "banned" && user&&user.otp_status === "Verified"?
								<Fragment>
								<span className="bi bi-bell-fill"/>  
									{notificationList.map((notification)=>{
											if(notification.status === "unread"){
												unReadNotificationCounter +=1
											}
										})}
								{unReadNotificationCounter >=1?
									<span class="badge badge-pill badge-danger" style={{backgroundColor:"red", fontSize:"10px", margin:"0", padding:"5px", position:"relative", bottom:"14px", right:"6px" }}>
										{unReadNotificationCounter}

									</span>:""
								}
								<span className="notif-text"> Notifications</span>
								</Fragment>
								:""
								}
								
								</span>
								

								
								<div className="bh-notif-tab nav flex-column visually-hidden" id="notif-tab">
									<p className="my-1">Notifications</p>
									<div className="notif-container">
									{notificationList.length>0?notificationList.map((notification)=>{
										return(
												<Fragment key={Math.random().toString(36)}>
												<hr/>
													<Link onClick={()=>{read(notification.notifCode)}} className={`nav-link notif-${notification.status}`} to={getNotifLink(notification)} data-toggle="tooltip" data-placement="top" title={notification.title}>{notifIcon(notification)}&nbsp;{notification.title}<br/>
														<small><i>{moment(notification.time).fromNow()}</i></small>
													</Link>
												</Fragment>
											)
									}).reverse(): <Fragment>
												<hr/><div style={{margin:"24px", color:"#c1c1c1"}}><i>No Notifications Found</i></div>
												</Fragment>
									}

										
									
										<hr/>
									</div>
									<Link to="/notifications" className="notif-showAll-btn">Show All</Link>
								</div>
								<span className="nav-span nav-link" id="bh-userBtn" onClick={()=>userTab()}><div style={{backgroundImage: `url(${user&&user.avatar&&user.avatar.url})`}}/><span className="bh-header-user">{user&&user.first_name} {user&&user.last_name}</span><span className="user-caret ms-2 text-end bi bi-caret-down-fill"/></span>
								<div className="bh-user-tab nav flex-column visually-hidden" id="user-tab">
									
								{user&&user.otp_status === "Verified"?	
									<Fragment>
										{user&&user.role === "administrator"?
						       	 	<Link to="/admin/profile" className="nav-link">Profile</Link>:
						       	  user&&user.role === "newUser" || user&&user.role === "user"?
						       	  <Link to={"/"+user&&user.alias} className="nav-link">Profile</Link>:
						       	  user&&user.role === "barangayAdministrator"?
						       	  	<Link to="/barangay/profile" className="nav-link">Profile</Link>:
						       	  user&&user.role === "garbageCollector"?
						       	   	<Link to="/collector/profile" className="nav-link">Profile</Link>:""
						       	 	}
						       	 	{user&&user.role === "user"?
						       	 	<Fragment>
											<Link to={`/${user&&user.alias}/reports`} className="nav-link">Reported Illegal Dumps</Link>
											<Link to={`/${user&&user.alias}/donated-items`} className="nav-link">Donated Items</Link>
											<Link to={`/${user&&user.alias}/claimed-donated-items`} className="nav-link">Claimed Items</Link>
											<Link to={`/${user&&user.alias}/received-donated-items`} className="nav-link">Received Donations</Link>
										</Fragment>:""
										}
										{user&&user.role === "newUser"?
						       	 	<Fragment>
											<Link to={`/${user&&user.alias}/reports`} className="nav-link">Reported Illegal Dumps</Link>
										</Fragment>:""
										}
									</Fragment>:""
								}

									<a onClick={logoutHandler} className="nav-link">Logout</a>
								</div>

								</Fragment>
								:
								<div className="navbar-nav ms-auto guest">
									<Link className="nav-link" to="/login" id="bh-loginBtn">Login</Link>
									<Link className="nav-link" to="/register" id="bh-registerBtn">Sign Up</Link>
								</div>
								}
						</div>
					</div>
				</nav>
			</div>
		</Fragment>


		)
}

export default Header