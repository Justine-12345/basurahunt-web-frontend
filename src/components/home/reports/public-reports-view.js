import React, { useRef, Fragment, useEffect, useState } from 'react';
import SidebarUser from '../../../components/layouts/sidebar-user';
import Sidebar from '../../../components/layouts/sidebar';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from '../../layouts/Loader'
import LoaderNoBg from '../../layouts/LoaderNoBg'
import { getSingleDump, getComment, addComment, clearErrors } from '../../../actions/dumpActions'
import { getChat, updateChat } from '../../../actions/chatActions'
import { UPDATE_DUMP_RESET, UPDATE_DUMP_STATUS_RESET, DUMP_DETAILS_RESET } from '../../../constants/dumpConstants'
import { GET_CHAT_RESET } from '../../../constants/chatConstants'
import ScrollToBottom from "react-scroll-to-bottom";
// import { Icon } from '@iconify/react';
import MetaData from '../../../components/layouts/MetaData'

import cryptoRandomString from 'crypto-random-string';
import NotificationSender from '../../../notificationSender';

import { SOCKET_PORT } from '../../../constants/socketConstants'
import io from "socket.io-client";
import MapView from '../../maps/MapView';

import '../../../Map.css';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import 'mapbox-gl/dist/mapbox-gl.css'
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

mapboxgl.accessToken =
	'pk.eyJ1IjoianVzdGluZS0iLCJhIjoiY2wzZnl6NHJsMDRudjNmbHZvOGgwNGx4bSJ9.mwFsZ1bz00QuUmMr_MMOxg';

const socket = io.connect(SOCKET_PORT);


const swearjarEng = require('swearjar-extended2');
const swearjarFil = require('swearjar-extended2');



const PublicReportsView = () => {

	const mapContainerRef = useRef(null);

	const [lng, setLng] = useState('0');
	const [lat, setLat] = useState('0');
	const [zoom, setZoom] = useState(17);

	const [currentMessage, setCurrentMessage] = useState("")
	const [messageList, setMessageList] = useState([])

	const alert = useAlert();
	const dispatch = useDispatch();
	let navigate = useNavigate()

	const { loading, dump: dumpData, error, chat: chatData } = useSelector(state => state.dumpDetails)
	const { isUpdated, isUpdatedStatus } = useSelector(state => state.dump)
	const { loading: commentLoading, comments, error: commentError } = useSelector(state => state.dumpComment)
	const { user } = useSelector(state => state.auth)
	const { chat, loading: chatLoading } = useSelector(state => state.chatDetails)


	const { id, long, lati, view } = useParams();
	const [waste_type, setWaste_type] = useState([])
	const [author, setAuthor] = useState('')
	const [comment, setComment] = useState('')
	const [showChat, setShowChat] = useState(true)
	const [showChat1, setShowChat1] = useState(false)
	const [room, setRoom] = useState("")
	const [status, setStatus] = useState("")
	const [chatID, setChatID] = useState("")
	const [allComments, setAllComments] = useState([])
	const [dump, setDump] = useState({})
	const [flag, setFlag] = useState(0)



	useEffect(() => {
		socket.disconnect()

		if (dump && dump._id !== id || isUpdated || isUpdatedStatus || chatData && chatData.length > messageList && messageList.length) {
			dispatch(getSingleDump(id));
			dispatch(getComment(id))

		} else {
			dispatch(getSingleDump(id));
		}

		// 	dispatch(getChat(dump&&dump.chat_id&&dump.chat_id._id))
		// setMessageList(chat&&chat.chats)
		console.log("chatData", chatData && chatData.length)
		console.log("message list", messageList && messageList.length)

		// if (chatData && chatData.length > messageList && messageList.length) {
		// 	dispatch(getSingleDump(id));
		// 	setMessageList(chatData)
		// }


		if (loading) {
			setMessageList(chatData)
		}


		if (dump && dump.chat_id && dump.chat_id.room) {
			setRoom(dump && dump.chat_id && dump.chat_id.room)
		}
		socket.connect()
		socket.emit("join_room", [dump && dump.chat_id && dump.chat_id.room, 'basurahunt-notification-3DEA5E28CE9B6E926F52AF75AC5F7-94687284AF4DF8664C573E773CF31'])

	}, [dump, socket, room, id])


	useEffect(() => {
		if (dump && dump._id !== id || isUpdated || isUpdatedStatus || chatData && chatData.length > messageList && messageList.length) {
			setShowChat(view)
			dispatch(getSingleDump(id));
			// dispatch(getChat(dump&&dump.chat_id&&dump.chat_id._id))
			dispatch(getComment(id))
			setAllComments([])
			setDump(dumpData)
			setMessageList(chatData)
		}

		// if(loading){

		// if (loading && (view === "true" || view === true)) {
			setMessageList(chatData)
		// }
		// }

		setWaste_type([])
		setAllComments(comments && comments)


		dump && dump.waste_type && dump.waste_type.forEach(type => {
			setWaste_type(oldArray => [...oldArray, type.type])
		})
		console.log(chatData && chatData)

		//  	if(messageList&&messageList.length<=0){
		// 	setMessageList(dump&&dump.chat_id&&dump&&dump.chat_id.chats)
		// }
		setStatus(dump && dump.status)

		if (error) {
			// alert.error(error)
			alert.error("This Dumps is deleted")
			navigate("/reports")
			dispatch(clearErrors())
		}

		if (isUpdated) {
			dispatch({ type: UPDATE_DUMP_RESET })
		}

		if (isUpdatedStatus) {
			dispatch({ type: UPDATE_DUMP_STATUS_RESET })
		}


	}, [room, showChat, loading, error, comments, dump, long, lati, id])


	useEffect(() => {
		socket.on("receive_message", (data) => {
			// console.log(data)
			if (data.type) {
				if (data.type === "status") {
					setStatus(data.message)
				}
				if (data.type === "comment") {
					setAllComments((oldComment) => [...oldComment, data])
				}
				if (data.type === "admin-updated-dump") {
					setDump(data.dump)
				}
			}
			else {
				if (data.message) {
					setMessageList((list) => [...list, data])
				}
			}

		}
		)

	}, [socket])


	useEffect(() => {
		socket.on("receive_message", (data) => {


			// if(data.category){
			// 	if(data.link.split("/")[2] === id && data.category ==='illegalDump-update' ){
			// 			dispatch(getSingleDump(id));
			// 	}
			// 	// if(data.link.split("/")[2] === id && data.category ==='illegalDump-new-comment'){
			//  //      dispatch(getComment(id));
			//  //         setAllComments(comments&&comments)
			// 	// }
			// }

		}
		)

	}, [socket])


	//  useEffect(()=>{

	//  		dispatch(getChat(dump&&dump.chat_id&&dump.chat_id._id))
	// //  		if(!showChat){
	//  // 			if(String(dump&&dump.chat_id&&dump.chat_id.room) === String(chat&&chat.chats&&chat.chats[0]&&chat.chats[0].room)){
	//  // 		setMessageList(chat&&chat.chats)
	// 	// }
	// // }


	//  },[showChat, chat]) 


	const sendMessage = async () => {

		if (currentMessage !== "") {
			const chatTime = new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()

			const messageData = {
				room: room,
				author: user && user._id,
				message: currentMessage,
				time: chatTime
			}

			const linkForNotif = `/report/${dump._id}/${dump && dump.coordinates && dump.coordinates.longtitude}/${dump && dump.coordinates && dump.coordinates.latitude}/true`
			let notifCodeForChat = cryptoRandomString({ length: 20, type: 'url-safe' })

			const formData = new FormData();
			formData.set('message', currentMessage);
			formData.set('notifCode', notifCodeForChat);
			formData.set('link', linkForNotif)
			formData.set('time', chatTime)
			dispatch(updateChat(dump && dump.chat_id && dump.chat_id._id, formData))
			await socket.emit("send_message", messageData);

			setCurrentMessage("")

			if (messageList === undefined) {
				setMessageList([messageData])
				setCurrentMessage("");
			} else {
				setMessageList((list) => [...list, messageData]);
			}


			NotificationSender(`New Message From ${user.first_name}: ${currentMessage}`, dump && dump.user_id && dump.user_id._id, null, dump && dump.barangay, 'illegalDump-new-message', notifCodeForChat, dump && dump)


		}
	}



	// useEffect(() => {
	// 	// let counter = 0

	// 	const map = new mapboxgl.Map({
	// 		container: mapContainerRef.current,
	// 		style: 'mapbox://styles/justine-/cl3g09pgu000714l6jzlyn2mm',
	// 		center: [dump && dump.coordinates && dump.coordinates.longtitude ? dump.coordinates.longtitude : long, dump && dump.coordinates && dump.coordinates.latitude ? dump.coordinates.latitude : lati],
	// 		zoom: zoom,
	// 		interactive: false
	// 	});



	// 	map.on('move', () => {
	// 		setLng(map.getCenter().lng.toFixed(4));
	// 		setLat(map.getCenter().lat.toFixed(4));
	// 		setZoom(map.getZoom().toFixed(2));
	// 	});


	// 	map.addControl(new mapboxgl.NavigationControl(), 'top-right');

	// 	//Dragabble marker
	// 	const coordinates = document.getElementById('coordinates');
	// 	const marker = new mapboxgl.Marker({
	// 		draggable: false
	// 	})
	// 		.setLngLat([121.050865, 14.517618])
	// 		.addTo(map);

	// 	map.on('load', function (e) {
	// 		marker.setLngLat(map.getCenter());
	// 	});

	// 	map.on('move', function (e) {
	// 		marker.setLngLat(map.getCenter());
	// 	});


	// 	const input = document.getElementById("MapTypesSelect");

	// 	input.onchange = (layer) => {
	// 		const layerId = layer.target.value;
	// 		map.setStyle('mapbox://styles/mapbox/' + layerId);
	// 	};

	// 	// Clean up on unmount
	// 	return () => map.remove();


	// }, [long, lati, id, socket]); // eslint-disable-line react-hooks/exhaustive-deps


	let imageCount = 0
	let imgIndicatorCount = 0


	const commentSubmit = (e) => {
		e.preventDefault()

		let authorForNotif

		if (author === "Anonymous") {
			authorForNotif = "Anonymous"
		}
		else if (author === "Real Name") {
			authorForNotif = `${user.first_name} ${user.last_name}`
		}
		else if (author === "Alias") {
			authorForNotif = `${user.alias}`
		}


		if (comment === "") {
			alert.error("Please enter your comment")
		}
		else if (author === "") {
			alert.error("Please select your preferred identity")
		} else {
			const formData = new FormData();
			const linkForNotif = `/report/${dump._id}/${dump && dump.coordinates && dump.coordinates.longtitude}/${dump && dump.coordinates && dump.coordinates.latitude}/#Comments`

			swearjarEng.setLang("en");
			const cleanCommentEng = swearjarEng.censor(comment);
			swearjarFil.setLang("ph");
			const cleanCommentFil = swearjarEng.censor(cleanCommentEng);


			const commentData = {
				room: room,
				author: authorForNotif,
				comment: cleanCommentFil,
				createdAt: new Date(Date.now()),
				type: "comment"
			}
			socket.emit("send_message", commentData);



			let notifCodeForComment = cryptoRandomString({ length: 20, type: 'url-safe' })
			formData.set('link', linkForNotif)
			formData.set('author', author);
			formData.set('comment', comment);
			formData.set('notifCode', notifCodeForComment);

			dispatch(addComment(id, formData))
			setAuthor("")
			setComment("")


			NotificationSender(`${authorForNotif} commented on your reported illegal dump: ${cleanCommentFil}`, user._id, dump && dump.user_id && dump.user_id._id, dump && dump.barangay, 'illegalDump-new-comment', notifCodeForComment, dump && dump)

		}

	}

	function formatAMPM(time) {
		const timeArray = time.split(":");
		var hours = timeArray[0];
		var minutes = timeArray[1];
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	}

	return (
		<Fragment>
			<MetaData title={dump && dump.complete_address} />
			<div className="bh-container">
				<div>

					<SidebarUser />
				</div>
				<div className="bh-container-3 px-3">

					{loading ? <LoaderNoBg /> :
						<Fragment>
							<h3>Illegal Dump ID. {dump && dump._id}</h3>
							<div className="row row-cols-sm-2 row-cols-1">
								<div className="col">
									<p className="m-0">{new Date(dump && dump.createdAt).toDateString()}</p>
								</div>
								<div className="col text-sm-end">
									<p className="m-0 fw-bold">Status: {status === "newReport" ? "New Report" : status}</p>
								</div>
							</div>
						</Fragment>
					}
					<div className="row w-100 m-auto">
						{/* <div className="col-md-8 my-1" style={{ zIndex: "0" }}>
							<div className="bh-report-map">


								<select className="form-select" aria-label="Default select example" id="MapTypesSelect" >
									<option id="satellite-v9" type="radio" name="rtoggle1" value="satellite-v9">Satellite</option>
									<option id="streets-v11" type="radio" name="rtoggle1" value="streets-v11">Streets</option>
									<option id="light-v10" type="radio" name="rtoggle1" value="light-v10">Light</option>
									<option id="dark-v10" type="radio" name="rtoggle1" value="dark-v10">Dark</option>
									<option id="outdoors-v11" type="radio" name="rtoggle1" value="outdoors-v11">Outdoors</option>
								</select>

								<div style={{ overflowY: "hidden", width: "100%", height: "50vh" }} className="map-container" ref={mapContainerRef} />
								<pre id="coordinates" className="coordinates" style={{ zIndex: "0", visibility: "hidden", height: "0px" }}></pre>

							</div>
						</div> */}

						<div className="col-md-8 my-1" style={{ zIndex: "0" }}>
							<div className="bh-report-map">
								<MapView divHeight={"40vh"} mapCSS={{ height: "50vh", postion: "relative", top: "-5px" }} latitude={dump && dump.coordinates && dump.coordinates.latitude} longtitude={dump && dump.coordinates && dump.coordinates.longtitude} iconLink={"/images/trash.png"} />
							</div>
						</div>


						{loading ? <LoaderNoBg /> :
							<div className="col-md-4 my-1" style={{ zIndex: "0" }}>
								<div id="img-carousel" className="carousel slide" data-bs-ride="true">
									<div className="carousel-indicators" >

										{dump && dump.images && dump.images.map((image) => {
											imgIndicatorCount += 1

											return (
												<button type="button" data-bs-target="#img-carousel" data-bs-slide-to={imgIndicatorCount - 1} className={imgIndicatorCount === 1 ? "active" : ""} aria-current="true" aria-label={`Slide ${imgIndicatorCount}`}></button>
											)
										})

										}

									</div>
									<div className="carousel-inner" >
										{dump && dump.images && dump.images.map((image) => {
											imageCount += 1

											return (
												<div key={image.url} className={`carousel-item ${imageCount === 1 ? "active" : ""}`}>
													<div className="img-carousel-item">
														<a className="image-link" target="_blank" href={image.url}><img src={image.url} /></a>
													</div>
												</div>
											)
										})

										}

									</div>
									<button className="carousel-control-prev" type="button" data-bs-target="#img-carousel" data-bs-slide="prev">
										<span className="carousel-control-prev-icon" aria-hidden="true" />
										<span className="visually-hidden">Previous</span>
									</button>
									<button className="carousel-control-next" type="button" data-bs-target="#img-carousel" data-bs-slide="next">
										<span className="carousel-control-next-icon" aria-hidden="true" />
										<span className="visually-hidden">Next</span>
									</button>
								</div>
							</div>
						}
					</div>
					{loading ? <LoaderNoBg /> :
						<div className="mx-3">
							<p className="fw-bold m-0">{dump && dump.complete_address}<small className="fw-normal"> (nearest landmark: {dump && dump.landmark})</small></p>
							<p>Barangay {dump && dump.barangay}</p>
							<p className="fw-bold m-0">Type</p>
							<div className="crud-checkboxes text-start">
								{waste_type.includes("Animal Corpse") ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-cone-striped" /> Animal Corpse</label>
									</Fragment>
									: ""}

								{waste_type.includes("Automotive") ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-car-front" /> Automotive</label>
									</Fragment>
									: ""}

								{waste_type.includes("Burned") ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-fire" /> Burned</label>
									</Fragment>
									: ""}

								{waste_type.includes("Construction") ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-hammer" /> Construction</label>
									</Fragment>
									: ""}

								{waste_type.includes("Electronics") ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-pc-display" /> Electronics</label>
									</Fragment>
									: ""}

								{waste_type.includes("Hazardous") ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-exclamation-triangle-fill" /> Hazardous</label>
									</Fragment>
									: ""}

								{waste_type.includes("Household") ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-house" /> Household</label>
									</Fragment>
									: ""}

								{waste_type.includes("Liquid Waste") ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-droplet-fill" /> Liquid Waste</label>
									</Fragment>
									: ""}

								{waste_type.includes("Metal/Can") ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-trash" /> Metal/Can</label>
									</Fragment>
									: ""}

								{waste_type.includes("Paper") ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-newspaper" /> Paper</label>
									</Fragment>
									: ""}

								{waste_type.includes("Plastic") ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-cup-straw" /> Plastic</label>
									</Fragment>
									: ""}

								{waste_type.includes("Glass Bottle") ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-exclamation-triangle" /> Glass Bottle</label>
									</Fragment>
									: ""}

								{waste_type.includes("Organic/Food") ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-egg-fried" /> Organic/Food</label>
									</Fragment>
									: ""}

								{waste_type.includes("Other") ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-question-circle" /> Other: <i>{dump && dump.waste_desc}</i></label>
									</Fragment>
									: ""}



							</div><hr />
							<p className="fw-bold m-0">Size</p>
							<div className="crud-checkboxes text-start">
								{dump && dump.waste_size === "Trash Bin" ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-trash" /> Trash Bin</label>
									</Fragment>
									: ""}

								{dump && dump.waste_size === "Dump Truck" ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-truck" /> Dump Truck</label>
									</Fragment>
									: ""}
							</div><hr />
							<p className="fw-bold m-0">Accessible by</p>
							<div className="crud-checkboxes text-start">
								{dump && dump.accessible_by === "People Only" ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-person" /> People</label>
									</Fragment>
									: ""}

								{dump && dump.accessible_by === "Tricycle" ?
									<Fragment>
										<label className="btn view-checkbox">
											<img src="https://img.icons8.com/ios-filled/21/ffffff/auto-rickshaw.png" />&nbsp;
											Tricycle</label>
									</Fragment>
									: ""}

								{dump && dump.accessible_by === "Motorcycle" ?
									<Fragment>
										<label className="btn view-checkbox">
											<img src="https://img.icons8.com/metro/22/ffffff/motorcycle.png" />&nbsp;
											Motorcycle</label>
									</Fragment>
									: ""}

								{dump && dump.accessible_by === "Truck/Car" ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-truck" /> Truck/Car</label>
									</Fragment>
									: ""}

								{dump && dump.accessible_by === "Boat" ?
									<Fragment>
										<label className="btn view-checkbox">
											<span className="bi bi-water" /> Boat</label>
									</Fragment>
									: ""}

							</div><hr />
							<p className="fw-bold m-0">Category of Violation</p>
							<p>{dump && dump.category_violation}</p>
							<hr />
							<p className="fw-bold m-0">Additional Details</p>
							<p>{dump && dump.additional_desciption}</p>
							<hr />
							<p className="fw-bold m-0">Reported by</p>
							<p>{dump && dump.report_using}</p>
						</div>
					}
					<hr />
					{user && user.role === "user" ?
						<form onSubmit={commentSubmit}>
							<div className="overflow-auto">
								<select value={author} className="form-select" onChange={(e) => { setAuthor(e.target.value) }}>
									<option value="">---Select Identity---</option>
									<option value="Anonymous">Anonymous</option>
									<option value="Real Name">Real name</option>
									<option value="Alias">Alias/Username</option>
								</select>
								<textarea value={comment} className="form-control" placeholder="Type your comment here..." onChange={(e) => { setComment(e.target.value) }} />
								<button className="btn bh-submitBtn mb-2" type="submit" disabled={commentLoading ? true : ""}>Post</button>
							</div>
						</form> : ""
					}
					<p id="Comments">Comments</p>
					{commentLoading ? <LoaderNoBg /> :
						<div className="bh-comments">
							{/*{	console.log("comments",allComments)}	*/}
							{allComments && allComments.map((comment) => {
								return (
									<div className="bh-comment">
										<p className="fw-bold m-0">{comment.author}</p>
										<p className="m-0">{comment.comment}</p>
										<small className="text-secondary float-end">{new Date(comment && comment.createdAt).toDateString()}</small>
									</div>
								)
							}).reverse()
							}
						</div>
					}


					{loading ? "" :
						String(user && user._id) === String(dump && dump.user_id && dump.user_id._id) ?
							<div className="chatAccordion" style={{ zIndex: "100" }}>
								<div class="accordion" id="accordionExample" style={{ width: "fit-content", padding: "0", margin: "0" }}>
									<div class="accordion-item">
										<h2 class="accordion-header" id="headingOne" >

											<button onClick={e => setShowChat(false)} style={{ fontWeight: "600", backgroundColor: "#191a19", color: "white" }} class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
												Chat With Admin &nbsp; &nbsp; &nbsp; &nbsp;
											</button>

										</h2>
										<div id="collapseOne" class={`accordion-collapse collapse show`} aria-labelledby="headingOne" data-bs-parent="#accordionExample">
											<div style={{ padding: "0", margin: "0", height: "fit-content" }} class="accordion-body">
												<div className="chat-window">
													<div className="chat-body">
														<ScrollToBottom className="message-container">

															{messageList && messageList.map((messageContent) => {
																{/*console.log(String(messageContent.author) ===  String(user&&user._id))*/ }

																{
																	return (
																		<div
																			key={Math.random().toString(36)}
																			className="message"
																			id={String(messageContent.author) !== String(user && user._id) ? "you" : "other"}
																		>
																			<div>
																				<div className="message-content">
																					<p>{messageContent.message}</p>
																				</div>
																				<div className="message-meta">
																					<p id="time">{formatAMPM(messageContent.time)}</p>
																				</div>
																			</div>
																		</div>
																	)
																}
															})
															}

														</ScrollToBottom>
													</div>
													<div className="chat-footer">
														<input type="text" placeholder="Hey..." value={currentMessage} onChange={(event) => setCurrentMessage(event.target.value)} onKeyPress={(event) => {
															event.key === "Enter" && sendMessage();
														}} />
														<button onClick={sendMessage}>&#9658;</button>
													</div>

												</div>
											</div>
										</div>
									</div>
								</div>
							</div> : ""
					}
				</div>
			</div>
		</Fragment>
	)
}

export default PublicReportsView