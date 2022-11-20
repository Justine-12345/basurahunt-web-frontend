import React, { useRef, Fragment, useEffect, useState } from 'react';
import SidebarUser from '../../../components/layouts/sidebar-user';
import SidebarBarangay from '../../../components/layouts/sidebar-barangay';
import SidebarCollector from '../../../components/layouts/sidebar-collector';
import Sidebar from '../../../components/layouts/sidebar'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from '../../layouts/Loader'
import LoaderNoBg from '../../layouts/LoaderNoBg'
import { getSingleDump, updateDumpStatus, getComment, addComment, deleteComment, clearErrors } from '../../../actions/dumpActions'
import { getChat, updateChat } from '../../../actions/chatActions'
import { UPDATE_DUMP_RESET, UPDATE_DUMP_STATUS_RESET, DUMP_DELETE_COMMENT_RESET } from '../../../constants/dumpConstants'
import ScrollToBottom from "react-scroll-to-bottom";
import { confirmAlert } from 'react-confirm-alert';
import ReactStars from "react-rating-stars-component";

import MapView from '../../maps/MapView';

// import { Icon } from '@iconify/react';

import Webcam from "react-webcam"
import MetaData from '../../../components/layouts/MetaData'

import { SOCKET_PORT } from '../../../constants/socketConstants'
import io from "socket.io-client";
import cryptoRandomString from 'crypto-random-string';
import NotificationSender from '../../../notificationSender';

import '../../../Map.css';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import 'mapbox-gl/dist/mapbox-gl.css'
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

mapboxgl.accessToken =
	'pk.eyJ1IjoianVzdGluZS0iLCJhIjoiY2wzZnl6NHJsMDRudjNmbHZvOGgwNGx4bSJ9.mwFsZ1bz00QuUmMr_MMOxg';

const socket = io.connect(SOCKET_PORT);

const ReportsView = () => {

	const mapContainerRef = useRef(null);
	const webRef = useRef(null)
	let imgg = "httpsL;';'";

	const [lng, setLng] = useState('0');
	const [lat, setLat] = useState('0');
	const [zoom, setZoom] = useState(17);
	const [showChat, setShowChat] = useState(true)
	const [currentMessage, setCurrentMessage] = useState("")
	const [messageList, setMessageList] = useState([])
	const [room, setRoom] = useState("")

	const [author, setAuthor] = useState('')
	const [comment, setComment] = useState('')

	const [messageStatus, setMessageStatus] = useState('')
	const [status, setStatus] = useState('')
	const [flag, setFlag] = useState(0)

	const alert = useAlert();
	const dispatch = useDispatch();
	let navigate = useNavigate()
	const { id, long, lati, view } = useParams();

	const { loading, dump, error, chat: chatData } = useSelector(state => state.dumpDetails)
	const { isUpdated, isUpdatedStatus, loading: dumpLoading } = useSelector(state => state.dump)
	const { chat, loading: chatLoading, } = useSelector(state => state.chatDetails)
	const { loading: commentLoading, comments, error: commentError, isDeleted } = useSelector(state => state.dumpComment)
	const { user } = useSelector(state => state.auth)

	const [waste_type, setWaste_type] = useState([])
	const [notifCode, setNotifCode] = useState('')
	const [notifCode1, setNotifCode1] = useState('')
	let rate

	// useEffect(() => {
	// 	// let counter = 0

	// 	const map = new mapboxgl.Map({
	// 		container: mapContainerRef.current,
	// 		style: 'mapbox://styles/justine-/cl3g09pgu000714l6jzlyn2mm',
	// 		center: [long, lati],
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
	// 	map.setStyle('mapbox://styles/mapbox/streets-v11');
	// 	input.onchange = (layer) => {
	// 		const layerId = layer.target.value;
	// 		map.setStyle('mapbox://styles/mapbox/' + layerId);
	// 	};


	// 	// Clean up on unmount
	// 	return () => map.remove();


	// }, [id, long, lati]); // eslint-disable-line react-hooks/exhaustive-deps



	useEffect(() => {
		socket.disconnect()

		if (dump && dump._id !== id || isUpdated || isUpdatedStatus) {
			dispatch(getSingleDump(id));
			dispatch(getComment(id))
		} else {
			// setShowChat(view)

			setStatus(dump && dump.status)
		}
		console.log("chatData",chatData)
		console.log("flag",flag)
		if (flag <= 2) {
			dispatch(getSingleDump(id));
			setFlag(oldFlag => oldFlag + 1)
			setMessageList(chatData)
		}


		// dispatch(getChat(dump&&dump.chat_id&&dump.chat_id._id))
		// setMessageList(chat&&chat.chats)

		if (dump && dump.chat_id && dump.chat_id.room) {
			setRoom(dump && dump.chat_id && dump.chat_id.room)
		}
		socket.connect()
		socket.emit("join_room", [dump && dump.chat_id && dump.chat_id.room])

		

	}, [dump, socket, room, view])


	useEffect(() => {


		if (dump && dump._id !== id || isUpdated || isUpdatedStatus) {
			dispatch(getSingleDump(id));
			dispatch(getComment(id))

		} else {
			setStatus(dump && dump.status)
			setNotifCode(cryptoRandomString({ length: 20, type: 'url-safe' }))
		}

		dump && dump.waste_type && dump.waste_type.forEach(type => {
			setWaste_type(oldArray => [...oldArray, type.type])
		})

		if (error) {
			alert.error(error)
			dispatch(clearErrors())
		}

		if (isUpdated) {
			dispatch({ type: UPDATE_DUMP_RESET })
		}

		if (isDeleted) {
			dispatch(getComment(id))
			dispatch({ type: DUMP_DELETE_COMMENT_RESET })
			alert.success("Comment deleted successfully")
		}

		// dispatch(getChat(dump&&dump.chat_id&&dump.chat_id._id))
		if (isUpdatedStatus) {

			// setMessageList(chat&&chat.chats)

			const messageData = {
				room: room,
				author: user && user._id,
				message: messageStatus,
				time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
				type: "status"
			}

			socket.emit("send_message", messageData);


			let notifTitle
			if (messageStatus === "Confirmed") {
				notifTitle = "Your reported illegal dump has been confirmed by the admin"
			} if (messageStatus === "Unfinish") {
				notifTitle = "Your reported illegal dump is still not cleaned"
			} if (messageStatus === "Cleaned") {
				notifTitle = "Congratulations! Your reported illegal dump has been cleaned"
			} if (messageStatus === "newReport") {
				notifTitle = "Your reported illegal dump is still pending"
			}if (messageStatus === "Rejected") {
				notifTitle = "Your reported illegal dump is rejected"
			}

			NotificationSender(notifTitle, user._id, dump && dump.user_id && dump.user_id._id, dump && dump.barangay, 'illegalDump-update-status', notifCode, dump && dump)

			if(dump.user_id.role === "newUser" && messageStatus === "Cleaned"){
				const notifTitle1 = "Congratulation you are now a verified user."
				console.log("notifcode1",notifCode1)
				NotificationSender(notifTitle1, user._id, dump.user_id._id, dump.barangay, 'user-verified', notifCode1, dump && dump)
			  }
			dispatch({ type: UPDATE_DUMP_STATUS_RESET })
			alert.success("Dump Updated Successfully")
		}

		

	}, [room, id, showChat, loading, error, comments, isUpdatedStatus, dumpLoading, messageStatus, isDeleted, view])



	useEffect(() => {
		socket.on("receive_message", (data) => {
			console.log(data)
			if (data.type) {
				setStatus(data.message)
			} else {
				setMessageList((list) => [...list, data]);
			}
		})
	}, [socket])


	const sendMessage = async () => {
		const chatTime = new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
		if (currentMessage !== "") {
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
			formData.set('notifCode', notifCode);
			formData.set('link', linkForNotif)
			formData.set('receiver', dump && dump.user_id && dump.user_id._id)
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

			NotificationSender(`New message from ${user.first_name}: ${currentMessage}`, user._id, dump && dump.user_id && dump.user_id._id, dump && dump.barangay, 'illegalDump-new-message', notifCodeForChat, dump && dump)

		}
	}

	const commentSubmit = (e) => {
		e.preventDefault()

		if (comment === "") {
			alert.error("Please enter your comment")
		}
		else if (author === "") {
			alert.error("Please select your preferred identity")
		} else {
			const formData = new FormData();
			formData.set('author', author);
			formData.set('comment', comment);
			dispatch(addComment(id, formData))
		}

	}

	const updateRoleHandler = (id, old_status, new_status, user) => {
		confirmAlert({
			customUI: ({ onClose }) => {
				rate = 0
				setNotifCode1(cryptoRandomString({ length: 20, type: 'url-safe' }))
				return (
					<div className='custom-ui' style={{ height: "fit-content" }}>
						<h1>Are you sure?</h1>
						<p>You want to change the status from <b>{old_status}</b> to <b>{new_status}</b> ?</p>

						{new_status === "Cleaned" && <div style={{ width: "fit-content", margin: "auto" }}>
							Rate <i>'{user.first_name} {user.last_name}'</i>
							<ReactStars
								{...{
									size: 50,
									value: 0,
									edit: true,
									onChange: newValue => {
										rate = newValue;
									}
								}}
							/>
						</div>}

						{new_status !== "Cleaned" ?
							<Fragment>
								<button onClick={onClose}>No</button>
								<button
									onClick={() => {
										setMessageStatus(new_status)
										const formData = new FormData();
										formData.set('old_status', old_status)
										formData.set('new_status', new_status)
										formData.set('rate', rate)
										formData.set('notifCode', notifCode);
										formData.set('notifCode1', notifCode1);
										dispatch(updateDumpStatus(id, formData))
										onClose();
									}}
								>
									Yes, Change it!
								</button>
							</Fragment>
							:
							<Fragment>
								<button onClick={onClose}>No</button>
								<button
									onClick={() => {
										setMessageStatus(new_status)
										const formData = new FormData();
										formData.set('old_status', old_status)
										formData.set('new_status', new_status)
										formData.set('rate', rate)
										formData.set('notifCode', notifCode);
										formData.set('notifCode1', notifCode1);
										if (rate === undefined || rate === 0) {
											alert.show("Please rate before you submit")
										} else {
											dispatch(updateDumpStatus(id, formData))
											onClose();
										}

									}}
								>
									Submit Rating!
								</button>
							</Fragment>
						}


					</div>
				);
			}
		});
	}

	const deleteCommentHandler = (id, dumpId) => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className='custom-ui'>
						<h1>Are you sure?</h1>
						<p>You want to delete this comment?</p>
						<button onClick={onClose}>No</button>
						<button
							onClick={() => {
								console.log(id)
								console.log(dumpId)
								const formData = new FormData();
								formData.set('commentId', id)
								dispatch(deleteComment(dumpId, formData));
								onClose();
							}}
						>
							Yes, Delete it!
						</button>
					</div>
				);
			}
		});
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

	let collectorCounter = 0

	return (
		<Fragment>
			<MetaData title={`${dump && dump.complete_address}`} />
			<div className="bh-dashboard">
				<div>
					{user && user.role === "administrator" ?
						<Sidebar /> :
						user && user.role === "newUser" || user && user.role === "user" ?
							<SidebarUser /> :
							user && user.role === "barangayAdministrator" ?
								<SidebarBarangay /> :
								user && user.role === "garbageCollector" ?
									<SidebarCollector /> : ""
					}
				</div>
				<div className="bh-dashboard-section">
					<h5 className="py-2 px-3">
						Illegal Dump Report <i className="crud-id fw-light small user-select-all">({dump && dump._id})</i></h5>
					<hr className="m-0" />
					<div className="contents">
						<div className="row text-center">
							<div className="col-lg-4 col-md-12 m-auto" >
								<br/>

								<p className="m-0">Status: <span className="m-0 fw-bold">
									{dumpLoading ? "Updating ..." :
										status === "newReport" ?
											<Fragment>
												<Link to={`/${user && user.role === "administrator"?"admin":"barangay"}/report/${dump && dump._id}/${dump && dump.coordinates && dump.coordinates.longtitude}/${dump && dump.coordinates && dump.coordinates.latitude}/confirm/`} type="button" class="btn btn-success">Confirm</Link>&nbsp;
												<button onClick={(e) => updateRoleHandler(dump._id, dump.status, 'Rejected', dump.user_id, dump.chat_id.room, dump && dump)} type="button" class="btn btn-danger">Reject</button>
											</Fragment> : status === "Confirmed" ?
												<select value={status} onChange={(e) => updateRoleHandler(dump._id, dump.status, e.target.value, dump.user_id, dump.chat_id.room, dump && dump)} className="form-select">
													<option value="Confirmed">Confirmed</option>
													<option value="Unfinish">Unfinish</option>
													<option value="Cleaned">Cleaned</option>
												</select> : status === "Unfinish" || status === "Cleaned" ?
													<select value={status} onChange={(e) => updateRoleHandler(dump._id, dump.status, e.target.value, dump.user_id, dump.chat_id.room, dump && dump)} className="form-select">
														<option value="Unfinish">Unfinish</option>
														<option value="Cleaned">Cleaned</option>
													</select> : status === "Rejected" ?
														<p style={{ color: "red", fontSize: "12px" }}><b>Rejected</b></p> :
														""
									}

								</span></p>
							</div>
							<div className="col-lg-4 col-md-6 m-auto">
								<p className="m-0">Date Reported: <span className="m-0 fw-bold">{new Date(dump && dump.createdAt).toDateString()}</span></p>
							</div>
							<div className="col-lg-4 col-md-6 m-auto">
								<p className="m-0">Date Cleaned: <span className="m-0 fw-bold">{dump && dump.date_cleaned ? new Date(dump && dump.date_cleaned).toDateString() : "N/A"}</span></p>
							</div>

							<div className="col-lg-4 col-md-12 m-auto">
								<p className="m-0">Assigned Collector: <span className="m-0 fw-bold">{
									dump && dump.collectors && dump.collectors.length > 0 ?
										dump && dump.collectors && dump.collectors.map((coll) => {
											collectorCounter += 1

											if (collectorCounter === dump.collectors.length) {
												return (<span>{dump.collectors.length === 2 ? <span>&nbsp;</span> : ""}and {coll.collector.first_name}</span>)
											} else {
												return (<span>{coll.collector.first_name}{dump.collectors.length > 2 ? ", " : ""}</span>)
											}

										})

										: "No Collector Assigned Yet"
								}</span></p>
							</div>
						</div>

						<p className="section mt-0 mb-4">Images</p>
						<div className="crud-images">
							{dump && dump.images && dump.images.map((image) => {
								return (<a target="_blank" href={image.url}><div className="crud-img" style={{ backgroundImage: `url(${image.url})` }}></div></a>)
							})
							}

						</div>
						<p className="section">Location</p>
						<div className="row">
							{/* <div className="col-lg-6 col-sm-12 m-auto" style={{ zIndex: "0" }}>
								<select className="form-select" style={{ width: "30vw", position: "relative", top: "50px", left: "10px", zIndex: "1000" }} aria-label="Default select example" id="MapTypesSelect" >
									<option id="streets-v11" type="radio" name="rtoggle1" value="streets-v11">Streets</option>
									<option id="satellite-v9" type="radio" name="rtoggle1" value="satellite-v9">Satellite</option>
									<option id="light-v10" type="radio" name="rtoggle1" value="light-v10">Light</option>
									<option id="dark-v10" type="radio" name="rtoggle1" value="dark-v10">Dark</option>
									<option id="outdoors-v11" type="radio" name="rtoggle1" value="outdoors-v11">Outdoors</option>
								</select>
								<div style={{ overflowY: "hidden", width: "0", height: "0vh", visibility:"hidden" }} className="map-container" ref={mapContainerRef} />
								<pre id="coordinates" className="coordinates" style={{ zIndex: "0", visibility: "hidden", height: "0px" }}></pre>
							</div> */}

							<div className="col-lg-6 col-sm-12 m-auto" style={{ zIndex: "0" }}>
								<MapView divHeight={"100vh"} latitude={dump && dump.coordinates && dump.coordinates.latitude} longtitude={dump && dump.coordinates && dump.coordinates.longtitude}  iconLink={"/images/trash.png"} />
							<br/>
							<br/>
							</div>

							<div className="col-lg-6 col-sm-12">
								<div className="row row-cols-xl-4 row-cols-lg-2 row-cols-2">
									<div className="col">EXACT LOCATION:</div>
									<div className="col fw-bold">{dump && dump.complete_address}</div>
									<div className="col">LANDMARK:</div>
									<div className="col fw-bold">{dump && dump.landmark}</div>
									<div className="col">BARANGAY:</div>
									<div className="col fw-bold">{dump && dump.barangay}</div>
								</div>
							</div>
						</div>
						<p className="section mt-0">Other Information</p>
						<p className="m-0">Type of Waste</p>
						<div className="crud-checkboxes">
							<input disabled type="checkbox" className="btn-check" autocomplete="on" id="waste-ac" />
							<label className="btn btn-success crud-checkbox" style={waste_type.includes("Animal Corpse") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} for="waste-ac">
								<span className="bi bi-cone-striped" /> Animal Corpse</label>

							<input disabled type="checkbox" className="btn-check" autocomplete="on" id="waste-au" />
							<label className="btn btn-success crud-checkbox" style={waste_type.includes("Automotive") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} Construction for="waste-au">
								<span className="bi bi-car-front" /> Automotive</label>

							<input disabled type="checkbox" className="btn-check" autocomplete="on" id="waste-br" />
							<label className="btn btn-success crud-checkbox" style={waste_type.includes("Burned") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} Construction for="waste-br">
								<span className="bi bi-fire" /> Burned</label>

							<input disabled type="checkbox" className="btn-check" autocomplete="on" id="waste-con" />
							<label className="btn btn-success crud-checkbox" style={waste_type.includes("Construction") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} for="waste-con">
								<span className="bi bi-hammer" /> Construction</label>

							<input disabled type="checkbox" className="btn-check" autocomplete="on" id="waste-el" />
							<label className="btn btn-success crud-checkbox" style={waste_type.includes("Electronics") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} for="waste-el">
								<span className="bi bi-pc-display" /> Electronics</label>

							<input disabled type="checkbox" className="btn-check" autocomplete="on" id="waste-haz" />
							<label className="btn btn-success crud-checkbox" style={waste_type.includes("Hazardous") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} for="waste-haz">
								<span className="bi bi-exclamation-triangle-fill" /> Hazardous</label>

							<input disabled type="checkbox" className="btn-check" autocomplete="on" id="waste-hou" />
							<label className="btn btn-success crud-checkbox" style={waste_type.includes("Household") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} for="waste-hou">
								<span className="bi bi-house" /> Household</label>

							<input disabled type="checkbox" className="btn-check" autocomplete="on" id="waste-lw" />
							<label className="btn btn-success crud-checkbox" style={waste_type.includes("Liquid Waste") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} for="waste-lw">
								<span className="bi bi-droplet-fill" /> Liquid Waste</label>

							<input disabled type="checkbox" className="btn-check" autocomplete="on" id="waste-mc" />
							<label className="btn btn-success crud-checkbox" style={waste_type.includes("Metal/Can") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} for="waste-mc">
								<span className="bi bi-trash" /> Metal/Can</label>

							<input disabled type="checkbox" className="btn-check" autocomplete="on" id="waste-pp" />
							<label className="btn btn-success crud-checkbox" style={waste_type.includes("Paper") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} for="waste-pp">
								<span className="bi bi-newspaper" /> Paper</label>

							<input disabled type="checkbox" className="btn-check" autocomplete="on" id="waste-pl" />
							<label className="btn btn-success crud-checkbox" style={waste_type.includes("Plastic") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} for="waste-pl">
								<span className="bi bi-cup-straw" /> Plastic</label>

							<input disabled type="checkbox" className="btn-check" autocomplete="on" id="waste-gb" />
							<label className="btn btn-success crud-checkbox" style={waste_type.includes("Glass Bottle") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} for="waste-gb">
								<span className="bi bi-exclamation-triangle" /> Glass Bottle</label>

							<input disabled type="checkbox" className="btn-check" autocomplete="on" id="waste-of" />
							<label className="btn btn-success crud-checkbox" style={waste_type.includes("Organic/Food") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} for="waste-of">
								<span className="bi bi-egg-fried" /> Organic/Food</label>

							<input disabled type="checkbox" className="btn-check" autocomplete="on" id="waste-other" />
							<label className="btn btn-success crud-checkbox" style={waste_type.includes("Other") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} for="waste-other">
								<span className="bi bi-question-circle" /> Other</label>
							{dump && dump.waste_desc &&
								<input disabled value={dump && dump.waste_desc} className="form-control" type="text" placeholder="If other, please specify" id="waste-other-specify" />
							}
						</div>

						<p className="m-0">Size of Waste</p>
						<div className="crud-checkboxes">
							<input disabled type="radio" className="btn-check" checked={dump && dump.waste_size === "Trash Bin" ? true : false} name="size-option" autocomplete="on" id="size-tb" />
							<label className="btn btn-success crud-checkbox" for="size-tb">
								<span className="bi bi-trash" /> Trash Bin</label>
							<input disabled type="radio" className="btn-check" checked={dump && dump.waste_size === "Dump Truck" ? true : false} name="size-option" autocomplete="on" id="size-dt" />
							<label className="btn btn-success crud-checkbox" for="size-dt">
								<span className="bi bi-truck" /> Dump Truck</label>
						</div>

						<p className="m-0">Accessible by</p>
						<div className="crud-checkboxes">
							<input disabled type="radio" className="btn-check" checked={dump && dump.accessible_by === "People Only" ? true : false} name="access-option" autocomplete="on" id="access-ppl" />
							<label className="btn btn-success crud-checkbox" for="access-ppl">
								<span className="bi bi-person" /> People Only</label>
							<input disabled type="radio" className="btn-check" checked={dump && dump.accessible_by === "Tricycle" ? true : false} name="access-option" autocomplete="on" id="access-tri" />
							<label className="btn btn-success crud-checkbox" for="access-tri">
								<img src="https://img.icons8.com/ios-filled/21/ffffff/auto-rickshaw.png" />&nbsp;
								Tricycle</label>
							<input disabled type="radio" className="btn-check" checked={dump && dump.accessible_by === "Motorcycle" ? true : false} name="access-option" autocomplete="on" id="access-mtc" />
							<label className="btn btn-success crud-checkbox" for="access-mtc">
								<img src="https://img.icons8.com/metro/22/ffffff/motorcycle.png" />&nbsp;
								Motorcycle</label>
							<input disabled type="radio" className="btn-check" checked={dump && dump.accessible_by === "Truck/Car" ? true : false} name="access-option" autocomplete="on" id="access-tc" />
							<label className="btn btn-success crud-checkbox" for="access-tc">
								<span className="bi bi-truck" /> Truck/Car</label>
							<input disabled type="radio" className="btn-check" checked={dump && dump.accessible_by === "Boat" ? true : false} name="access-option" autocomplete="on" id="access-bt" />
							<label className="btn btn-success crud-checkbox" for="access-bt">
								<span className="bi bi-water" /> Boat</label>
						</div>

						<p className="m-0">Category of Violation</p>
						<select disabled className="form-select">
							<option>{dump && dump.category_violation}</option>
						</select>

						<p className="m-0">Additional Details</p>
						<textarea disabled value={dump && dump.additional_desciption} className="form-control" />

						<p className="m-0 fw-bold">Reporter:</p>
						{user && user.role === 'administrator' ?
						<Link to={`/admin/user/${dump && dump.user_id && dump.user_id._id}`}><p>{dump && dump.user_id && dump.user_id.first_name} {dump && dump.user_id && dump.user_id.last_name}<i>({dump && dump.user_id && dump.user_id.alias})</i> from {dump && dump.user_id && dump.user_id.barangay}</p></Link> :
							<p>{dump && dump.report_using}</p>
						}

					</div>
					<hr className="m-0" />
					{user && user.role === 'administrator' ?
						<Link style={{ margin: "24px" }} to={`/admin/report/${dump && dump._id}/${dump && dump.coordinates && dump.coordinates.longtitude}/${dump && dump.coordinates && dump.coordinates.latitude}/edit/`} className="btn bh-submitBtn ">Edit Dump</Link> : ""
					}
					<br />
					<br />
					<br />

					<div style={{ padding: "24px" }}>
						<h2>Add Comment</h2>
						<form onSubmit={commentSubmit}>
							<div className="overflow-auto">
								<select className="form-select" onChange={(e) => { setAuthor(e.target.value) }}>
									<option>Name to be shown</option>
									<option value="Real Name">Real name</option>
									<option value="Alias">Alias/Username</option>
									<option value="Anonymous">Anonymous</option>
								</select>
								<textarea className="form-control" placeholder="Type your comment here..." onChange={(e) => { setComment(e.target.value) }} />
								<button className="btn bh-submitBtn mb-2" type="submit">Post</button>
							</div>
						</form>
						<p>Comments:</p>

						{commentLoading ? <LoaderNoBg /> :
							<div className="bh-comments" >
								{comments && comments.map((comment) => {
									return (
										<div className="bh-comment" style={{ backgroundColor: "#e9ecef", borderRadius: "5px" }}>
											<i class="bi bi-x-circle-fill" style={{ color: "red", float: "right" }} onClick={() => deleteCommentHandler(comment._id, dump && dump._id)}></i>
											<p className="fw-bold m-0" >{comment.author}</p>
											<p className="m-0">{comment.comment}</p>
											<small className="text-secondary float-end">{new Date(comment && comment.createdAt).toDateString()}</small>
										</div>
									)
								}).reverse()
								}
							</div>
						}
					</div>
				</div>
			</div>






			{(user && user.role === 'administrator') && !loading ?
				<div className="chatAccordion" style={{ zIndex: "100" }}>
					<div class="accordion" id="accordionExample" style={{ width: "fit-content", padding: "0", margin: "0" }}>
						<div class="accordion-item">
							<h2 class="accordion-header" id="headingOne">

								<button style={{ fontWeight: "600", backgroundColor: "#191a19", color: "white" }} class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
									Chat With {dump && dump.user_id && dump.user_id.first_name} (reporter) &nbsp; &nbsp; &nbsp; &nbsp;
								</button>

							</h2>
							<div id="collapseOne" class={`accordion-collapse collapse show`} aria-labelledby="headingOne" data-bs-parent="#accordionExample">
								<div style={{ padding: "0", margin: "0", height: "fit-content" }} class="accordion-body">

									<div className="chat-window" style={showChat ? { height: "", zIndex: "100" } : { height: "0px" }} >
										{showChat ?
											<Fragment>
												<div className="chat-body">
													<ScrollToBottom className="message-container">
														{messageList && messageList.map((messageContent) => {
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
											</Fragment>
											: ""
										}
									</div>

								</div>
							</div>
						</div>
					</div>
				</div> : ""}









		</Fragment>
	)
}

export default ReportsView