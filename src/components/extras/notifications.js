import React, {Fragment,useEffect, useState} from 'react';
import SidebarUser from '../../components/layouts/sidebar-user';
import SidebarBarangay from '../../components/layouts/sidebar-barangay';
import SidebarCollector from '../../components/layouts/sidebar-collector';
import Sidebar from '../../components/layouts/sidebar';
import {Link, useNavigate} from 'react-router-dom';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import {loadUser, readNofication, logout, clearErrors} from '../../actions/userActions'
import { READ_NOTIFICATION_RESET } from '../../constants/userConstants'
import { SOCKET_PORT } from '../../constants/socketConstants'
import moment from 'moment';
import MetaData from '../../components/layouts/MetaData'

import io from "socket.io-client";
const socket = io.connect(SOCKET_PORT);

const Notifications = () => {

	const alert = useAlert();
  	const dispatch = useDispatch();
  	let navigate = useNavigate() 

	const {user, isAuthenticated} = useSelector(state => state.auth)
	const { isRead } = useSelector(state => state.notification)
  	const [notificationList, setNotificationList] = useState([])

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
  		dispatch(loadUser())
  		dispatch({ type: READ_NOTIFICATION_RESET });
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
						if(data.category === "schedule" || data.category === "live"){
								if(String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  					
											setNotificationList((list)=>[...list,data]);
									}
						}
						if(data.category === "illegalDump-new"){
									
									setNotificationList((list)=>[...list,data]);
						}
						if(data.category === "illegalDump-new-message"){
								if(data.sender !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			
									setNotificationList((list)=>[...list,data]);
								}
						}
						if(data.category === "donation-new"){
								if(String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
							  			
											setNotificationList((list)=>[...list,data]);
								}

						}
						if(data.category === "collection-mass-add"){
								if(String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
							  			
											setNotificationList((list)=>[...list,data]);
								}
								
						}
						if(data.category === "feedback-new"){
								if(String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
							  	
											setNotificationList((list)=>[...list,data]);
								}
								
						}
				}

				if(JSON.parse(localStorage.getItem("user")).role === "garbageCollector"){
						if(data.category === "schedule"){
								if( String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)){	
					  					
											setNotificationList((list)=>[...list,data]);
									}
						}
						if(data.category === "illegalDump-update"){
								if( String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			
									setNotificationList((list)=>[...list,data]);
								}
						}
				}

				if(JSON.parse(localStorage.getItem("user")).role === "user"){
					if(data.category === "schedule" || data.category === "live"){
						if(!data.receiver && data.barangay === JSON.parse(localStorage.getItem("user")).barangay){	
	  					
							setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "illegalDump-update"){
						if( String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "illegalDump-update-status"){
						if( String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "illegalDump-new-message"){
						if(String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "illegalDump-new-comment"){
						if(String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)&&String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "donation-new"){
						if(String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "donation-update-claim"){
						if(String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)&&String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "donation-update-cancel"){
						if(String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)&&String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "donation-update-confirm"){
						if(String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)&&String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "donation-update-receive"){
						if(String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)&&String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "donation-new-message"){
						if(String(data.receiver) === String(JSON.parse(localStorage.getItem("user"))._id)&&String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			
									setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "newsfeeds-add"){
						if(String(data.sender) !== String(JSON.parse(localStorage.getItem("user"))._id)){	
					  			
									setNotificationList((list)=>[...list,data]);
						}
					}
				}

				if(JSON.parse(localStorage.getItem("user")).role === "barangayAdministrator"){
					if(data.category === "schedule" || data.category === "live"){
						if(!data.receiver && data.barangay === JSON.parse(localStorage.getItem("user")).barangay){	
	  					
							setNotificationList((list)=>[...list,data]);
						}
					}
					if(data.category === "illegalDump-new"){
									if( data.barangay === JSON.parse(localStorage.getItem("user")).barangay){	
					  					
											setNotificationList((list)=>[...list,data]);
									}
						}
				}
				

			})
		},[socket])


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
     return <span className="bi bi-box2"/>
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
}


	return(
		<Fragment>
		<MetaData title={"Notifications"} />

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
				<div className="bh-container-3 px-3">
					<h3>Notifications</h3>
					<div className="mx-md-5">
						
{/*
						<a href="/report/id" className="all-notif-container notif-unread">
							<h5>Asd commented on your report</h5>
							<p>"asadsdasdsadsdasdsadsdasdasdsadsdasdsadsdasdsadsdasdsadsdasdsadsdasdsadsdasdsadsdasdsadsdasdsadsdasdsadsdasdsadsdasdsadsdasdsadsdasdsadsdasdsadsdasdsad"</p>
							<small className="float-end">July 30,2022</small>
						</a>*/}

						{notificationList.length>0?notificationList.map((notification)=>{
										return(
												<Fragment key={Math.random().toString(36)}>
												<hr/>
													<Link onClick={()=>{read(notification.notifCode)}} className={`all-notif-container notif-${notification.status}`} to={getNotifLink(notification)} data-toggle="tooltip" data-placement="top" title={notification.title}><h5>{notifIcon(notification)}&nbsp;{notification.title}</h5>
														<small><i>{moment(notification.time).fromNow()}</i></small>
													</Link>
												</Fragment>
											)
									}).reverse(): <Fragment>
												<hr/><div style={{margin:"24px", color:"#c1c1c1"}}><i>No Notifications Found</i></div>
												</Fragment>
						}

					

					</div>
					
				</div>
			</div>
		</Fragment>
		)
}

export default Notifications