import React, { useRef, Fragment, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import SidebarUser from '../../components/layouts/sidebar-user';

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getItemDetails, claimItem, cancelItem, confirmItem, receiveItem, clearErrors } from '../../actions/itemActions'
import { getChat, updateChat } from '../../actions/chatActions'
import { CLAIM_ITEM_RESET, CANCEL_ITEM_RESET, CONFIRM_ITEM_RESET, RECEIVE_ITEM_RESET, DELETE_ITEM_RESET } from '../../constants/itemConstants'
import LoaderNoBg from '../layouts/LoaderNoBg'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { deleteItem } from '../../actions/itemActions'
import cryptoRandomString from 'crypto-random-string';
import NotificationSender from '../../notificationSender';
import ScrollToBottom from "react-scroll-to-bottom";
import MetaData from '../../components/layouts/MetaData'

import { SOCKET_PORT } from '../../constants/socketConstants'
import io from "socket.io-client";
import ReactStars from "react-rating-stars-component";

import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

import 'mapbox-gl/dist/mapbox-gl.css'
import MapView from '../maps/MapView';
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

mapboxgl.accessToken =
	'pk.eyJ1IjoianVzdGluZS0iLCJhIjoiY2wzZnl6NHJsMDRudjNmbHZvOGgwNGx4bSJ9.mwFsZ1bz00QuUmMr_MMOxg';

const socket = io.connect(SOCKET_PORT);


const PublicDonationssView = () => {
	const mapContainerRef = useRef(null);

	const [lng, setLng] = useState('0');
	const [lat, setLat] = useState('0');
	const [zoom, setZoom] = useState(17);
	const [barangay, setBarangay] = ('')
	const [currentMessage, setCurrentMessage] = useState("")
	const [messageList, setMessageList] = useState([])
	const [author, setAuthor] = useState('')
	const [comment, setComment] = useState('')
	const [showChat, setShowChat] = useState(false)
	const [room, setRoom] = useState("")

	const [notifCode, setNotifCode] = useState('')

	const alert = useAlert();
	const dispatch = useDispatch();
	let navigate = useNavigate()
	const { loading, error, item, receiver } = useSelector(state => state.itemDetails);
	const { error: claimError, isClaimed } = useSelector(state => state.item);
	const { error: cancelError, isCanceled } = useSelector(state => state.item);
	const { error: confirmError, isConfirmed } = useSelector(state => state.item);
	const { error: receiveError, isReceived } = useSelector(state => state.item);
	const { isDeleted } = useSelector(state => state.item)
	const { user } = useSelector(state => state.auth)
	const { chat } = useSelector(state => state.chatDetails)
	let { id, view } = useParams();

	useEffect(() => {
		socket.disconnect()
		dispatch(getChat(item && item.chat_id && item.chat_id._id))
		setMessageList(chat && chat.chats)

		if (item && item.chat_id && item.chat_id.room) {
			setRoom(item && item.chat_id && item.chat_id.room)
		}
		socket.connect()
		socket.emit("join_room", [item && item.chat_id && item.chat_id.room, 'basurahunt-notification-3DEA5E28CE9B6E926F52AF75AC5F7-94687284AF4DF8664C573E773CF31'])
		console.log(item)
	}, [item, socket, room])

	useEffect(() => {

		

		dispatch(getItemDetails(id));
		dispatch(getChat(item && item.chat_id && item.chat_id._id))
		setShowChat(view)
		setNotifCode(cryptoRandomString({ length: 20, type: 'url-safe' }))

		if (isClaimed) {
			console.log("item", item)
			NotificationSender(`Your donated item has been claimed by ${user.first_name}`, user._id, item && item.user_id && item.user_id._id, item && item.barangay_hall, 'donation-update-claim', notifCode, item && item)

			navigate('/donation/' + id);
			alert.success('Item claimed successfully');
			dispatch({ type: CLAIM_ITEM_RESET });
		}
		

		if (isCanceled) {
			navigate('/donation/' + id);
			if (String(user._id) === String(item && item.user_id && item.user_id._id)) {
				NotificationSender(`The donation has been cancelled by ${user.first_name}`, user._id, item && item.receiver_id && item.receiver_id._id, item && item.barangay_hall, 'donation-update-cancel', notifCode, item && item)
			} else {
				NotificationSender(`Claiming of your donated item has been cancelled by ${user.first_name}`, user._id, item && item.user_id && item.user_id._id, item && item.barangay_hall, 'donation-update-cancel', notifCode, item && item)
			}

			alert.success('Item cancelled successfully');
			dispatch({ type: CANCEL_ITEM_RESET });
		}

		if (isConfirmed) {
			navigate('/donation/' + id);
			NotificationSender(`The donation has been confirmed by ${user.first_name}`, user._id, item && item.receiver_id && item.receiver_id._id, item && item.barangay_hall, 'donation-update-confirm', notifCode, item && item)
			alert.success('Item confirmed successfully');
			dispatch({ type: CONFIRM_ITEM_RESET });
		}

		if (isReceived) {
			navigate('/donation/' + id);
			NotificationSender(`Your donated item has been received by ${user.first_name}`, user._id, item && item.user_id && item.user_id._id, item && item.barangay_hall, 'donation-update-receive', notifCode, item && item)
			alert.success('Item received successfully');
			dispatch({ type: RECEIVE_ITEM_RESET });
		}

		if (claimError) {
			alert.error(claimError);
			dispatch(clearErrors())
		}

		if (cancelError) {
			alert.error(cancelError);
			dispatch(clearErrors())
		}

		if (confirmError) {
			alert.error(confirmError);
			dispatch(clearErrors())
		}

		if (receiveError) {
			alert.error(receiveError);
			dispatch(clearErrors())
		}

		if (error) {
			// alert.error(error);
			alert.error("This Item is deleted")
			navigate("/donations")
			dispatch(clearErrors())
		}

		if (isDeleted) {
			navigate(`/${user && user.alias}/donated-items`);
			alert.success('Donation deleted successfully');
			dispatch({ type: DELETE_ITEM_RESET })
		}


	}, [room, dispatch, isDeleted, isClaimed, isCanceled, isConfirmed, isReceived, claimError, cancelError, confirmError, receiveError, error, navigate, id, alert]);




	useEffect(() => {

		socket.on("receive_message", (data) => {
			if (data.message) {
				setMessageList((list) => [...list, data]);
				setShowChat(true)
			}
		})

	}, [socket])



	const sendMessage = async () => {
		console.log(item && item.chat_id)
		if (currentMessage !== "") {
			const chatTime = new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
			const messageData = {
				room: room,
				author: user && user._id,
				message: currentMessage,
				time: chatTime
			}

			const linkForNotif = `/donation/${item._id}/true`
			let notifCodeForChat = cryptoRandomString({ length: 20, type: 'url-safe' })

			let chatReceiver
			if (String(user._id) === String(item && item.user_id && item.user_id._id)) {
				chatReceiver = item && item.receiver_id && item.receiver_id._id
			}
			else {
				chatReceiver = item && item.user_id && item.user_id._id
			}
			console.log(item && item.chat_id && item.chat_id._id)
			const formData = new FormData();
			formData.set('message', currentMessage);
			formData.set('notifCode', notifCodeForChat);
			formData.set('link', linkForNotif)
			formData.set('chatCategory', "donation")
			formData.set('receiver', chatReceiver)
			formData.set('time', chatTime)
			dispatch(updateChat(item && item.chat_id && item.chat_id._id, formData))

			await socket.emit("send_message", messageData);
			setCurrentMessage("")

			if (messageList === undefined) {
				setMessageList([messageData])
				setCurrentMessage("");
			} else {
				setMessageList((list) => [...list, messageData]);
			}
			if (String(user._id) === String(item && item.user_id && item.user_id._id)) {
				NotificationSender(`New message from ${user.first_name}: ${currentMessage}`, item && item.user_id && item.user_id._id, item && item.receiver_id && item.receiver_id._id, item && item.barangay_hall, 'donation-new-message', notifCodeForChat, item && item)
			}
			else {
				NotificationSender(`New message from ${user.first_name}: ${currentMessage}`, item && item.receiver_id && item.receiver_id._id, item && item.user_id && item.user_id._id, item && item.barangay_hall, 'donation-new-message', notifCodeForChat, item && item)

			}
		}
	}





	const formatDate = (itemDate) => {
		if (itemDate) {
			let dateCreated = new Date(itemDate);

			const months = ["January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December"];

			const month = months[dateCreated.getMonth()];
			const year = dateCreated.getFullYear();

			const formattedDate = month + " " + dateCreated.getDate() + ", " + year;

			return formattedDate;
		}
	}

	const itemType = (types) => {
		let typeList = "";
		if (types) {
			for (let i = 0; i <= types.length - 1; i++) {
				if (i === types.length - 1) {
					typeList += types[i].type
				}
				else {
					typeList += types[i].type + ", "
				}
			}
		}
		return typeList;
	}

	const typeArray = (types) => {
		let typeArray = [];

		if (types) {
			for (let i = 0; i <= types.length - 1; i++) {
				typeArray.push(types[i].type)
			}
		}

		return typeArray
	}

	const donatedUsing = (item) => {
		let donatedUsing = "";
		if (item) {
			if (item.donate_using === "Real name") {
				donatedUsing = item.user_id.first_name + " " + item.user_id.last_name + " | Level " + item.user_id.level;
			}
			if (item.donate_using === "Alias") {
				donatedUsing = item.user_id.alias + " | Level " + item.user_id.level;
			}
			if (item.donate_using === "Anonymous") {
				donatedUsing = "Anonymous" + " | Level " + item.user_id.level;
			}
		}
		return donatedUsing;
	}

	const btnClicked = (btn) => {
		if (btn === "Claimed") {
			const formData = new FormData();
			formData.set('notifCode', notifCode);
			dispatch(claimItem(id, formData))
		}
		if (btn === "Unclaimed") {

			confirmAlert({
				customUI: ({ onClose }) => {
					return (
						<div className='custom-ui'>
							<h1>Are you sure?</h1>
							<small style={{ lineHeight: "10px" }}>Canceling it will delete all the chat conversations of the donor and recipient</small>
							<br />
							<button onClick={onClose}>No</button>
							<button
								onClick={() => {
									const formData = new FormData();
									formData.set('notifCode', notifCode);
									dispatch(cancelItem(id, formData))
									onClose();
								}}
							>
								Yes, cancel it!
							</button>
						</div>
					);
				}
			});


		}
		if (btn === "Confirmed") {
			const formData = new FormData();
			formData.set('notifCode', notifCode);
			dispatch(confirmItem(id, formData))
		}
		if (btn === "Received") {

			confirmAlert({
				customUI: ({ onClose }) => {
					let rate = 0
					return (
						<div className='custom-ui' style={{ height: "fit-content" }}>
							<h1>Are you sure?</h1>
							<small style={{ lineHeight: "10px" }}>Already received the item?</small>
							<br />

							<div style={{ width: "fit-content", margin: "auto" }}>
								Rate this item
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
							</div>

							<button onClick={onClose}>No</button>
							<button
								onClick={() => {
									const formData = new FormData();
									formData.set('rate', rate)
									formData.set('notifCode', notifCode);


									if (rate === undefined || rate === 0) {
										alert.show("Please rate before you submit")
									} else {
										dispatch(receiveItem(id, formData))
										onClose();
									}


								}}
							>
								Yes, I Received it!
							</button>
						</div>
					);
				}
			});



		}
	}

	let imageCount = 0
	let imgIndicatorCount = 0

	const barangays = {
				Bagumbayan: [121.05924206803411, 14.473774649313196],
				Bambang: [121.07297471217399, 14.52577008620341],
				Calzada: [121.08000894132097, 14.533619787394496],
				Hagonoy: [121.06162966585019, 14.511649221382521],
				"Ibayo-Tipas": [121.08475762358806, 14.541766751550389],
				"Ligid-Tipas": [121.08473120422887, 14.541773687735182],
				"Lower Bicutan": [121.06229965724987, 14.488944645566308],
				"New Lower Bicutan": [121.0652470367573, 14.505379302559184],
				Napindan: [121.0961600538771, 14.540263915184013],
				Palingon: [121.08018865634412, 14.538256882049698],
				"San Miguel": [121.07480765437771, 14.517814348623812],
				"Santa Ana": [121.07686198942896, 14.527932178623535],
				Tuktukan: [121.07181460457123, 14.528203695545075],
				Ususan: [121.06870824841819, 14.535486937998462],
				Wawa: [121.07509642634135, 14.521833881862982],
				"Central Bicutan": [121.05406605687651, 14.49200668084731],
				"Central Signal Village": [121.05654718163518, 14.511360625728697],
				"Fort Bonifacio": [121.02685222392394, 14.5256292940773],
				Katuparan: [121.05838280343642, 14.521473719288505],
				"Maharlika Village": [121.05539748012504, 14.497235903682506],
				"North Daang Hari": [121.04829074488599, 14.485817269464212],
				"North Signal Village": [121.05557948004248, 14.51529618707773],
				Pinagsama: [121.0556073, 14.5230837],
				"South Daang Hari": [121.04876862250126, 14.47146040914458],
				"South Signal Village": [121.05354243593912, 14.505188137766536],
				Tanyag: [121.04944295523825, 14.47817374094515],
				"Upper Bicutan": [121.05034993106864, 14.496916364200366],
				"Western Bicutan": [121.03811937461039, 14.509578360670313],
			}

	// useEffect(() => {

	// 	const barangays = {
	// 		Bagumbayan: [121.05924206803411, 14.473774649313196],
	// 		Bambang: [121.07297471217399, 14.52577008620341],
	// 		Calzada: [121.08000894132097, 14.533619787394496],
	// 		Hagonoy: [121.06162966585019, 14.511649221382521],
	// 		"Ibayo-Tipas": [121.08475762358806, 14.541766751550389],
	// 		"Ligid-Tipas": [121.08473120422887, 14.541773687735182],
	// 		"Lower Bicutan": [121.06229965724987, 14.488944645566308],
	// 		"New Lower Bicutan": [121.0652470367573, 14.505379302559184],
	// 		Napindan: [121.0961600538771, 14.540263915184013],
	// 		Palingon: [121.08018865634412, 14.538256882049698],
	// 		"San Miguel": [121.07480765437771, 14.517814348623812],
	// 		"Santa Ana": [121.07686198942896, 14.527932178623535],
	// 		Tuktukan: [121.07181460457123, 14.528203695545075],
	// 		Ususan: [121.06870824841819, 14.535486937998462],
	// 		Wawa: [121.07509642634135, 14.521833881862982],
	// 		"Central Bicutan": [121.05406605687651, 14.49200668084731],
	// 		"Central Signal Village": [121.05654718163518, 14.511360625728697],
	// 		"Fort Bonifacio": [121.02685222392394, 14.5256292940773],
	// 		Katuparan: [121.05838280343642, 14.521473719288505],
	// 		"Maharlika Village": [121.05539748012504, 14.497235903682506],
	// 		"North Daang Hari": [121.04829074488599, 14.485817269464212],
	// 		"North Signal Village": [121.05557948004248, 14.51529618707773],
	// 		Pinagsama: [121.0556073, 14.5230837],
	// 		"South Daang Hari": [121.04876862250126, 14.47146040914458],
	// 		"South Signal Village": [121.05354243593912, 14.505188137766536],
	// 		Tanyag: [121.04944295523825, 14.47817374094515],
	// 		"Upper Bicutan": [121.05034993106864, 14.496916364200366],
	// 		"Western Bicutan": [121.03811937461039, 14.509578360670313],
	// 	}
	// 	const map = new mapboxgl.Map({
	// 		container: mapContainerRef.current,
	// 		style: 'mapbox://styles/justine-/cl3g09pgu000714l6jzlyn2mm',
	// 		center: barangays[item.barangay_hall] === undefined ? [121.050865, 14.517618] : barangays[item.barangay_hall],
	// 		zoom: zoom,
	// 		interactive: false
	// 	});


	// 	// Add navigation control (the +/- zoom buttons)
	// 	map.addControl(new mapboxgl.NavigationControl(), 'top-right');

	// 	map.on('move', () => {
	// 		setLng(map.getCenter().lng.toFixed(4));
	// 		setLat(map.getCenter().lat.toFixed(4));
	// 		setZoom(map.getZoom().toFixed(2));
	// 	});


	// 	//Dragabble marker
	// 	if (barangays[item.barangay_hall] !== undefined) {
	// 		const coordinates = document.getElementById('coordinates');
	// 		const marker = new mapboxgl.Marker({
	// 			draggable: false
	// 		})
	// 			.setLngLat([121.050865, 14.517618])
	// 			.addTo(map);

	// 		map.on('load', function (e) {
	// 			marker.setLngLat(map.getCenter());
	// 		});
	// 	}


	// 	const input = document.getElementById("MapTypesSelect");
	// 	input.onchange = (layer) => {
	// 		const layerId = layer.target.value;
	// 		map.setStyle('mapbox://styles/mapbox/' + layerId);
	// 	};


	// 	// Clean up on unmount
	// 	return () => map.remove();



	// }, [item])

	const deleteItemHandler = (id) => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className='custom-ui'>
						<h1>Are you sure?</h1>
						<p>Do you want to delete this item?</p>
						<button onClick={onClose}>No</button>
						<button
							onClick={() => {
								dispatch(deleteItem(id));
								onClose();
							}}
						>
							Yes, delete it!
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

	return (
		<Fragment>
			<MetaData title={item.name} />
			<div className="bh-container">
				<div>
					<SidebarUser />
				

				</div>
				{loading ? <LoaderNoBg /> :
					<Fragment>
						<div className="bh-container-3 px-3">

							<h5 style={{float:"right"}}>{item&&item.code?"Code:":""} <i>{item&&item.code}</i></h5>
							<h3>Donation</h3>


							<div className="row row-cols-sm-2 row-cols-1">
								<div className="col">
									<p className="m-0 fw-bold">Category: <span style={{ fontWeight: "400" }}>{item && itemType(item.item_type)}</span></p>
								</div>
								<div className="col text-sm-end">
									<p className="m-0"><b>Brgy. {item&&item.barangay_hall}</b> {item && formatDate(item.createdAt)} </p>
								</div>
							</div>

							<div className="row w-100 m-auto">

								<div className="col-md-8 my-1" style={{ zIndex: "0" }}>
									<div id="img-carousel" className="carousel slide" data-bs-ride="true" style={{ height: "55.1vh" }}>
										<div className="carousel-indicators">
											{item && item.images && item.images.map((image) => {
												imgIndicatorCount += 1
												return (
													<button type="button" data-bs-target="#img-carousel" data-bs-slide-to={imgIndicatorCount - 1} className={imgIndicatorCount === 1 ? "active" : ""} aria-current="true" aria-label={`Slide ${imgIndicatorCount}`}></button>
												)
											})

											}
										</div>
										<div className="carousel-inner">
											{item && item.images && item.images.map((image) => {
												imageCount += 1

												return (
													<div key={image.url} className={`carousel-item ${imageCount === 1 ? "active" : ""}`}>
														<div className="img-carousel-item" style={{ height: "55.1vh" }}>
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
									<p className="fw-bold" id="donation-location"><h2 className="fw-bold" style={{ margin: "10px" }}>{item.name}</h2></p>

								</div>




								{/* <div className="col-md-4 my-1" style={{ zIndex: "0" }}>
									<div style={{ zIndex: "0" }}>



										<select className="form-select" aria-label="Default select example" id="MapTypesSelect">
											<option id="satellite-v9" type="radio" name="rtoggle1" value="satellite-v9">Satellite</option>
											<option id="streets-v11" type="radio" name="rtoggle1" value="streets-v11">Streets</option>
											<option id="light-v10" type="radio" name="rtoggle1" value="light-v10">Light</option>
											<option id="dark-v10" type="radio" name="rtoggle1" value="dark-v10">Dark</option>
											<option id="outdoors-v11" type="radio" name="rtoggle1" value="outdoors-v11">Outdoors</option>
										</select>
										<div style={{ overflowY: "hidden", width: "100%", height: "50vh" }} className="map-container" ref={mapContainerRef} />
										<pre id="coordinates" className="coordinates" style={{ zIndex: "0", visibility: "hidden", height: "0px" }}></pre>

										<p className="fw" id="donation-location"><h5 className="fw">Barangay {item.barangay_hall}</h5></p>

									</div>
								</div> */}
								{/* {console.log(barangays[item&&item.barangay_hall]&&barangays[item&&item.barangay_hall][0])} */}
								<div className="col-md-4 my-1" style={{ zIndex: "0" }}>
									<div style={{ zIndex: "0" }}>
										{item&&item.barangay_hall&&
											<MapView divHeight={"40vh"} mapCSS={{height:"50vh", postion:"relative", top:"-5px"}} latitude={barangays[item&&item.barangay_hall]&&barangays[item&&item.barangay_hall][1]} longtitude={ barangays[item&&item.barangay_hall]&&barangays[item&&item.barangay_hall][0]} iconLink={"/images/box.png"}/>
										}
									</div>
								</div>
							</div>

							<div className="mx-3">
								<p className="fw-bold m-0">Type</p>

								<div className="crud-checkboxes text-start">

									{item && typeArray(item.item_type).includes("Food") && (<Fragment><label className="btn view-checkbox"><span className="bi bi-egg-fried" /> Food</label></Fragment>)}
									{item && typeArray(item.item_type).includes("Clothes") && (<Fragment><label className="btn view-checkbox"><span className="bi bi-tags" /> Clothes</label></Fragment>)}
									{item && typeArray(item.item_type).includes("Medical") && (<Fragment><label className="btn view-checkbox"><span className="bi bi-capsule" /> Medical</label></Fragment>)}
									{item && typeArray(item.item_type).includes("Appliances") && (<Fragment><label className="btn view-checkbox"><span className="bi bi-laptop" /> Appliances</label></Fragment>)}
									{item && typeArray(item.item_type).includes("Furnitures") && (<Fragment><label className="btn view-checkbox"><span className="bi bi-lamp" /> Furnitures</label></Fragment>)}
									{item && typeArray(item.item_type).includes("Other") && (<Fragment><label className="btn view-checkbox">{item && item.item_desc}</label></Fragment>)}

								</div><hr />

								<p className="fw-bold m-0">Additional Details</p>
								<p>{item && item.addional_desciption}</p>
								<hr />
								<p className="fw-bold m-0">Donated by</p>
								<p>{donatedUsing(item)}</p>
								<hr />

								{(item.user_id && item.user_id._id) === (user && user._id) ? (
									receiver && receiver._id ? (
										<Fragment>
											<p className="fw-bold m-0">Claimed by</p>
											<p className="m-0">{receiver && receiver.first_name + " " + receiver.last_name + " | Level " + receiver.level}</p>
											<p>{"From " + receiver && receiver.barangay}</p>
											<hr />
										</Fragment>) : null
								) : null}
							</div>

							{
								(item.user_id && item.user_id._id) === (user && user._id) ? (
									item && item.status === "Unclaimed" ? (
										<Fragment><button id="claimBtn" className="btn bh-submitBtn" onClick={() => deleteItemHandler(item && item._id)}>Delete</button></Fragment>

									) : "") : ""
							}

							{
								((item.user_id && item.user_id._id) !== (user && user._id)) ? (
									item && item.status !== "Received" ? (
										<Fragment>
											{
												item && item.status === "Unclaimed" && (
													<Fragment><button id="claimBtn" className="btn bh-submitBtn" onClick={() => btnClicked("Claimed")}>Claim Now</button></Fragment>
												)
											}
											{
												item && item.status === "Claimed" ? (
													<Fragment>
														<button id="cancelBtn" className="btn bh-backBtn float-end" onClick={() => btnClicked("Unclaimed")}>Cancel</button>
														<button id="claimBtn" className="btn bh-submitBtn" disabled>Wait for donor's confirmation...</button>
													</Fragment>
												) :
													item && item.status === "Confirmed" && (
														<Fragment>
															<button id="cancelBtn" className="btn bh-backBtn float-end" onClick={() => btnClicked("Unclaimed")}>Cancel</button>
															<button id="claimBtn" className="btn bh-submitBtn" onClick={() => btnClicked("Received")}>Receive</button>
														</Fragment>
													)
											}

										</Fragment>
									) : (<Fragment><button id="claimBtn" disabled className="btn bh-submitBtn">Received</button></Fragment>))
									: item && item.status === "Claimed" ? (
										<Fragment>
											<button id="cancelBtn" className="btn bh-backBtn float-end" onClick={() => btnClicked("Unclaimed")}>Cancel</button>
											<button id="claimBtn" className="btn bh-submitBtn" onClick={() => btnClicked("Confirmed")}>Confirm</button>
										</Fragment>
									) : item && item.status === "Confirmed" ? (<Fragment><button id="claimBtn" disabled className="btn bh-submitBtn">To receive...</button></Fragment>)
										: item && item.status === "Received" && (<Fragment><button id="claimBtn" disabled className="btn bh-submitBtn">Received</button></Fragment>)
							}
						</div>
					</Fragment>
				}
			</div>

			{loading ? "" :
				<Fragment>
					{item && item.status !== "Unclaimed" ?
						<div className="chatAccordion" style={{ zIndex: "100" }}>
							<div class="accordion" id="accordionExample" style={{ width: "fit-content", padding: "0", margin: "0" }}>
								<div class="accordion-item">
									<h2 class="accordion-header" id="headingOne" >

										<button onClick={e => setShowChat(false)} style={{ fontWeight: "600", backgroundColor: "#191a19", color: "white" }} class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
											Chat With {String(user && user._id) === String(item && item.user_id && item.user_id._id) ? item && item.receiver_id && item.receiver_id.first_name + " (receiver)" : item && item.user_id && item.user_id.first_name + " (donor)"}
											&nbsp; &nbsp; &nbsp; &nbsp;
										</button>

									</h2>
									<div id="collapseOne" class={`accordion-collapse collapse show`} aria-labelledby="headingOne" data-bs-parent="#accordionExample">
										<div style={{ padding: "0", margin: "0", height: "fit-content" }} class="accordion-body"></div>
										<div className="chat-window">
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

										</div>
									</div>
								</div>
							</div>
						</div>


						: ""

					}
				</Fragment>
			}
		</Fragment>
	)
}

export default PublicDonationssView