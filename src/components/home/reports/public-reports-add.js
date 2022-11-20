import React, { useRef, Fragment, useEffect, useState } from 'react';
import SidebarUser from '../../../components/layouts/sidebar-user';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link';
import Loader from '../../layouts/Loader'
import LoaderNoBg from '../../layouts/LoaderNoBg'
// import { Icon } from '@iconify/react';

import { newDump, clearErrors } from '../../../actions/dumpActions'
import { NEW_DUMP_RESET } from '../../../constants/dumpConstants'
import MetaData from '../../../components/layouts/MetaData'
import { confirmAlert } from 'react-confirm-alert';
import HyperModal from 'react-hyper-modal';
import Webcam from "react-webcam"
import imageCompression from 'browser-image-compression';

import cryptoRandomString from 'crypto-random-string';
import NotificationSender from '../../../notificationSender';
import MapFinder from '../../maps/MapFinder';
import { RESET_COORDINATE } from '../../../constants/mapConstants';
import '../../../Map.css';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import 'mapbox-gl/dist/mapbox-gl.css'

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

mapboxgl.accessToken =
	'pk.eyJ1IjoianVzdGluZS0iLCJhIjoiY2wzZnl6NHJsMDRudjNmbHZvOGgwNGx4bSJ9.mwFsZ1bz00QuUmMr_MMOxg';



const PublicReportsAdd = () => {



	const mapContainerRef = useRef(null);
	const webRef = useRef(null)
	let imgg = "httpsL;';'";
	const alert = useAlert();
	const dispatch = useDispatch();
	let navigate = useNavigate()

	const [lng, setLng] = useState('0');
	const [lat, setLat] = useState('0');
	const [zoom, setZoom] = useState(17);

	const { loading, success, dump, error } = useSelector(state => state.newDump)
	const { user } = useSelector(state => state.auth)
	const { latitude: mapLatitude, longitude: mapLongtitude } = useSelector(state => state.coordinate)

	const [latitude, setLatitude] = useState('')
	const [longtitude, setLongtitude] = useState('')

	const [images, setImages] = useState([]);

	const [complete_address, setComplete_address] = useState('')
	const [landmark, setLandmark] = useState('')
	const [barangay, setBarangay] = useState('')

	const [waste_type, setWaste_type] = useState([])
	const [waste_desc, setWaste_desc] = useState('')
	const [waste_size, setWaste_size] = useState('')
	const [accessible_by, setAccessible_by] = useState('')

	const [category_violation, setCategory_violation] = useState('')
	const [additional_desciption, setAdditional_desciption] = useState('')
	const [reportUsing, setReportUsing] = useState('')
	const [reportAnonymously, setReportAnonymously] = useState(false)


	const [otherInput, setOtherInput] = useState({ visibility: "hidden" });
	const [camLoading, setCamLoading] = useState(true);
	const [addImageMode, setAddImageMode] = useState('')
	const [mapVisibility, setMapVisibility] = useState(true)

	const [initLng, setInitLng] = useState(0)
	const [initLat, setInitLat] = useState(0)
	const [notifCode, setNotifCode] = useState('')
	const [addMoreInfo, setAddMoreInfo] = useState(false)
	const FACING_MODE_USER = "user";
	const FACING_MODE_ENVIRONMENT = "environment";

	const videoConstraints = {
		facingMode: FACING_MODE_USER
	};


	const [facingMode, setFacingMode] = useState(FACING_MODE_USER);

	const switchCam = () => {
		setFacingMode(
			prevState =>
				prevState === FACING_MODE_USER
					? FACING_MODE_ENVIRONMENT
					: FACING_MODE_USER
		)
	}

	const NotAllowedPlatformCam = [
		"HP-UX",
		"Linux i686",
		"Linux armv7l",
		"Mac68K",
		"MacPPC",
		"MacIntel",
		"SunOS",
		"Win16",
		"Win32",
		"WebTV OS"
	]



	useEffect(() => {
		setNotifCode(cryptoRandomString({ length: 20, type: 'url-safe' }))

		if (success) {
			alert.success("New illegal dump is reported successfully")
			console.log("dump", dump && dump)
			NotificationSender(`New illegal dump report in ${dump && dump.complete_address} Brgy.${dump && dump.barangay}`, user._id, null, barangay, 'illegalDump-new', notifCode, dump && dump)
			navigate("/reports")
			dispatch({ type: NEW_DUMP_RESET })
			dispatch({ type: RESET_COORDINATE })
		}

		if (error) {
			alert.error(error)
		}



	}, [success, alert, error, dump])

	// useEffect(() => {
	// 	// let counter = 0  	

	// 	getLocation()
	// 	const map = new mapboxgl.Map({
	// 		container: mapContainerRef.current,
	// 		style: 'mapbox://styles/justine-/cl3g09pgu000714l6jzlyn2mm',
	// 		center: [initLng, initLat],
	// 		zoom: zoom,
	// 		interactive: true
	// 	});


	// 	// Add navigation control (the +/- zoom buttons)
	// 	map.addControl(new mapboxgl.NavigationControl(), 'top-right');

	// 	map.on('move', () => {
	// 		setLng(map.getCenter().lng.toFixed(4));
	// 		setLat(map.getCenter().lat.toFixed(4));
	// 		setZoom(map.getZoom().toFixed(2));
	// 	});

	// 	map.addControl(
	// 		new mapboxgl.GeolocateControl({
	// 			positionOptions: {
	// 				enableHighAccuracy: true,
	// 			},
	// 			// When active the map will receive updates to the device's location as it changes.
	// 			trackUserLocation: false,
	// 			// Draw an arrow next to the location dot to indicate which direction the device is heading.
	// 			showUserHeading: true,

	// 		})
	// 	);

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
	// 		// console.log(`lng: ${map.getCenter().lng.toFixed(5)}`);
	// 		// console.log(`lat: ${map.getCenter().lat.toFixed(5)}`);

	// 		setLatitude(map.getCenter().lat.toFixed(5))
	// 		setLongtitude(map.getCenter().lng.toFixed(5))

	// 		marker.setLngLat(map.getCenter());
	// 	});

	// 	// function onDragEnd() {
	// 	// const lngLat = marker.getLngLat();
	// 	// console.log(lngLat)
	// 	// coordinates.style.display = 'block';
	// 	// coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
	// 	// }

	// 	// marker.on('dragend', onDragEnd);

	// 	const input = document.getElementById("MapTypesSelect");

	// 	input.onchange = (layer) => {
	// 		const layerId = layer.target.value;
	// 		map.setStyle('mapbox://styles/mapbox/' + layerId);
	// 	};


	// 	// Clean up on unmount
	// 	return () => map.remove();


	// }, [initLng, initLat]); // eslint-disable-line react-hooks/exhaustive-deps




	const onChange = (e) => {
		const files = Array.from(e.target.files)
		const numberOfImages = files.length + images.length

		if (files.length + images.length < 6) {

			files.forEach(async (file) => {

				const imageFile = file

				const options = {
					maxSizeMB: 1,
					maxWidthOrHeight: 1920,
					useWebWorker: true
				}

				try {
					const compressedFile = await imageCompression(imageFile, options);

					const reader = new FileReader();
					reader.onload = () => {
						if (reader.readyState === 2) {
							setImages(oldArray => [...oldArray, reader.result])
						}
					}
					reader.readAsDataURL(compressedFile)

				} catch (error) {
					console.log(error);
				}
			})
		} else {
			alert.show("Maximum number(5) of images has been reached")
		}
	}


	const showImage = () => {

		if (images.length < 5) {
			imgg = webRef.current.getScreenshot();
			setImages(oldArray => [...oldArray, imgg])
			alert.success("Image Captured")
		} else {
			alert.show("Maximum number(5) of images has been reached")
		}

	};

	const cameraLoading = () => {
		setCamLoading(false);
	}

	const submitHandler = (e) => {
		e.preventDefault();
		if (images.length <= 0) {
			alert.error("Please capture/upload images")
		}
		else if (complete_address === "") {
			alert.error("Please enter complete address")
		}
		else if (landmark === "") {
			alert.error("Please enter landmark")
		}
		else if (barangay === "") {
			alert.error("Please enter barangay")
		}
		else if (waste_type.length <= 0) {
			alert.error("Please enter waste type")
		}
		else {
			const formData = new FormData();

			formData.set("latitude", mapLatitude && mapLatitude);
			formData.set("longtitude", mapLongtitude && mapLongtitude);
			formData.set("complete_address", complete_address);
			formData.set("landmark", landmark);
			formData.set("barangay", barangay);
			if (waste_type.includes("Other")) {
				formData.set("waste_desc", waste_desc);
			} else {
				formData.set("waste_desc", "");
			}

			if (addMoreInfo) {
				formData.set("waste_size", waste_size);
				formData.set("accessible_by", accessible_by);
				formData.set("category_violation", category_violation);
			}

			formData.set("additional_desciption", additional_desciption);


			images.forEach(images => {
				formData.append('images', images)
			})

			waste_type.forEach(wt => {
				formData.append('waste_type', wt)
			})

			if (reportAnonymously === true) {
				formData.set("reportUsing", "Anonymous")
			} else {
				formData.set("reportUsing", "Alias")
			}

			formData.set('notifCode', notifCode);

			dispatch(newDump(formData))
		}
	}

	const removeOldImage = (image) => {
		setImages(images.filter(type => type !== image))
		alert.success("Image removed successfully")
	};

	const typeOfWasteInfo = () => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className='custom-ui-info'>
						<span onClick={onClose} style={{float:'right', position:'fixed', right:"14vw"}}><i class="bi bi-x-circle-fill" style={{fontSize:"30px"}}></i></span>
						<h2 id="types">Types of Waste</h2>
						<ol className="fs-5 mx-xl-5">
							<li><strong>Animal Corpse</strong>
								<ul>Any dead or slaughtered animal, usually seen on the road because of an accident. <i>Examples: animal bones, dead rat</i></ul>
							</li>
							<li><strong>Automotive</strong>
								<ul>Any automobile or vehicle waste that was part of an automobile, usually damaged or not functioning component of vehicles. <i>Examples: wheels, automotive battery</i></ul>
							</li>
							<li><strong>Construction</strong>
								<ul>Any waste that was generated or produced by any construction activities and materials that are damaged. <i>Examples: hollow blocks, broken ply woods, steel rod</i></ul>
							</li>
							<li><strong>Electronics</strong>
								<ul>Any electronic waste or part of electronic devices that are not functioning or not working properly. <i>Examples: light bulb, wires, broken televisions</i></ul>
							</li>
							<li><strong>Hazardous</strong>
								<ul>Any waste that is potentially dangerous or harmful to the environment and any human once inhaled or touched when disposed improperly. <i>Examples: pesticides, ammonia, paint/solvent</i></ul>
							</li>
							<li><strong>Household</strong>
								<ul>Any waste that may be solid or liquid materials that any family produced in a household. <i>Examples: broken table, broken cabinet, broken appliances</i></ul>
							</li>
							<li><strong>Liquid Waste </strong>
								<ul>Any waste that is formed in any liquid substances and may be produced by any household or industrial activity. <i>Examples: chemicals, used oils, acids</i></ul>
							</li>
							<li><strong>Metal/Can</strong>
								<ul>Any waste that is formed in any metal materials that may be in form of any ferrous and non-ferrous metals. <i>Examples: tin can, canned goods, steel</i></ul>
							</li>
							<li><strong>Paper</strong>
								<ul>Any waste that is formed in any paper and can be recycled, usually produced by work or industries. <i>Examples: magazine, newspaper, cardboard</i></ul>
							</li>
							<li><strong>Plastic</strong>
								<ul>Any waste that forms in any plastic and is usually hard to decompose. <i>Examples: plastic bottles, plastic bags</i></ul>
							</li>
							<li><strong>Glass Bottle</strong>
								<ul>Any waste that forms in any glass bottle usually contains a liquid. <i>Examples: wine bottle, broken glass</i></ul>
							</li>
							<li><strong>Organic/Food</strong>
								<ul>Any waste that is from plants or animals and food that is discarded and usually biodegradable and may use as a fertilizer. <i>Examples: leftover food, expired food, rotten plant</i></ul>
							</li>
							<li><strong>Burned</strong>
								<ul>Any waste that is currently burning or burned that is usually emits harmful and toxic gases or chemicals that can harm or pollute the environment. <i>Examples: Burned plastics, Treated Woods, Burned Paper</i></ul>
							</li>
							<li><strong>Other</strong>
								<ul>Any waste that is not specified in the categories.</ul>
							</li>
						</ol>

					</div>
				);
			}
		});
	}


	const sizeOfWasteInfo = () => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className='custom-ui-info' style={{height:"fit-content"}}>
						<span onClick={onClose} style={{float:'right', position:'fixed', right:"14vw"}}><i class="bi bi-x-circle-fill" style={{fontSize:"30px"}}></i></span>
						<h2 id="sizes">Size of Waste</h2>
						<ol className="fs-5 mx-xl-5">
							<li><strong>Trash Bin</strong>
								<ul>Trash that is small and can only be collected in a trash bin.</ul>
							</li>
							<li><strong>Dump Truck</strong>
								<ul>A large amount of waste that cannot be disposed of in a trash can and must be collected using a dump truck.</ul>
							</li>
						</ol>
					</div>
				);
			}
		});
	}


	const accessibleByWasteInfo = () => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className='custom-ui-info'>
						<span onClick={onClose} style={{float:'right', position:'fixed', right:"14vw"}}><i class="bi bi-x-circle-fill" style={{fontSize:"30px"}}></i></span>
						<h2 id="access">Accessible By</h2>
						<ol className="fs-5 mx-xl-5">
							<li><strong>People</strong>
								<ul>Trash collectors will accumulate the illegal dumps in the specific area when the reported location in Taguig City are not yet fully developed, and any vehicles cannot access or make an entry into the area.</ul>
							</li>
							<li><strong>Tricycle</strong>
								<ul>Tricycle or any three wheels vehicle will collect the reported illegal dumps when the reported location or place is only accessible by any petite or three wheels vehicle.</ul>
							</li>
							<li><strong>Motorcycle/Bike</strong>
								<ul>Motorcycle, Bike, or any two wheels vehicle will collect the reported illegal dumps when the reported location or place is only accessible by any petite or two wheels vehicle.</ul>
							</li>
							<li><strong>Truck/Car</strong>
								<ul>Small or Big Dump Trucks or any vehicle will collect the reported illegal dumps when the reported location is accessible by any vehicles or automobile.</ul>
							</li>
							<li><strong>Boat</strong>
								<ul>Only accessible by a boat to collect and clean the illegal waste when the reported area is not yet fully developed and is near to the shorelines, rivers, or any body of water such as ‘Estero’.</ul>
							</li>
						</ol>
					</div>
				);
			}
		});
	}

	return (
		<Fragment>
			<MetaData title={"Report"} />
			<div className="bh-container">
				<div>
					<SidebarUser />
				</div>
				<div className="bh-container-3 px-3">
					<h3>Report an Illegal Dump</h3>
					{loading ? <LoaderNoBg /> :
						<form onSubmit={submitHandler}>
							<div className="stepper">
								<div className="d-flex mb-1">
									<div className="d-flex flex-column pe-4 align-items-center">
										<div className="circle rounded-circle py-2 px-3 mb-1">
											1
										</div>
										<div className="line h-100"></div>
									</div>
									<div className="w-100">
										<h3>Images</h3>

										<div>
											<div className="text-md-start text-center row">
												<div className="col-xl-2">
													<span className="btn bh-submitBtn float-none" onClick={() => { addImageMode !== "upload" ? setAddImageMode('upload') : setAddImageMode('') }}>Upload Image</span>
												</div>
												{NotAllowedPlatformCam.includes(navigator.platform) ? "" :
													<Fragment>
														<div className="col-xl-1" style={{ paddingTop: "10px", paddingLeft: "20px" }}>
															<span className=" fw-bold" >or</span>
														</div>
														<div className="col-xl-2">
															<span className="btn bh-submitBtn float-none" onClick={() => { addImageMode !== "camera" ? setAddImageMode('camera') : setAddImageMode(''); setCamLoading(true); }}>Capture Image</span>
														</div>
													</Fragment>
												}
											</div>

											{addImageMode === "upload" ?
												<Fragment>
													<input
														accept="image/*"
														type='file'
														name='images'
														className='custom-file-input form-control'
														data-buttonText="Your label here."
														onChange={onChange}
														id="file-upload"
														multiple
													/>
													<label htmlFor="file-upload" style={{ padding: "20px", border: "5px dashed #98bf56", width: "50vw", borderRadius: "10px", margin: "30px", textAlign: "center" }}><i className="bi bi-upload"></i><br />Upload Images</label>
												</Fragment>
												: addImageMode === "camera" ?
													<Fragment>
														<div className="row" style={{ width: "70%", marginLeft: "24px", position: "relative", top: "60px" }}>
															<i class="bi bi-arrow-repeat rotate-cam" onClick={switchCam}></i>
														</div>
														<div className="row">
															<div className="col-xl-12 center-block">
																<Webcam
																	className="center"
																	forceScreenshotSourceSize="true"
																	onUserMedia={cameraLoading}
																	ref={webRef}
																	style={{ width: !camLoading ? "70%" : "0px", margin: !camLoading ? "24px" : "0px" }}
																	videoConstraints={{
																		...videoConstraints,
																		facingMode
																	}}
																/>
															</div>
														</div>

														{camLoading ? <LoaderNoBg /> :
															<Fragment>
																<div className="row" style={{ width: "70%", marginLeft: "24px" }}>
																	<div className="col-sm-6" style={{ height: "100px", margin: "auto" }}>
																		<div style={{ width: "fit-content", margin: "auto" }}>
																			<div className="center btnTakePhoto" onClick={() => { showImage() }}><i className="bi bi-camera-fill"></i> Capture</div>&nbsp;&nbsp;
																			<div className="center btnTakePhoto" onClick={() => { setAddImageMode(''); setCamLoading(true); }} style={{ background: "#e33434" }}><i className="bi bi-x-circle-fill"></i> Close</div>
																		</div>
																	</div>
																</div>
															</Fragment>
														}


													</Fragment>
													: ""
											}


											<div className="stepper-images">


												{images.map((image) => (
													<Fragment key={image}>
														<a target="_blank" style={{ diplay: "inline" }} href={image}><div className="crud-img" style={{ diplay: "inline", backgroundImage: `url(${image})` }}></div></a>
														<i onClick={() => (removeOldImage(image))} style={{ color: "#93d555", textShadow: "2px 2px 6px #1e5128", position: "relative", bottom: "14px", left: "-30px" }} on className="bi bi-x-circle-fill"></i>
													</Fragment>
												))
												}


											</div>
										</div>

									</div>
								</div>
								{/*-----------------*/}
								<div className="d-flex mb-1">
									<div className="d-flex flex-column pe-4 align-items-center">
										<div className="circle rounded-circle py-2 px-3 mb-1">
											2
										</div>
										<div className="line h-100"></div>
									</div>
									<div className="w-100 mb-3">
										<h3>Location</h3>
										<div>
											{/* <div>
												<select style={{ width: "30vw", position: "relative", top: "50px", left: "10px", zIndex: "1000" }} className="form-select" aria-label="Default select example" id="MapTypesSelect" >
													<option id="satellite-v9" type="radio" name="rtoggle1" value="satellite-v9">Satellite</option>
													<option id="streets-v11" type="radio" name="rtoggle1" value="streets-v11">Streets</option>
													<option id="light-v10" type="radio" name="rtoggle1" value="light-v10">Light</option>
													<option id="dark-v10" type="radio" name="rtoggle1" value="dark-v10">Dark</option>
													<option id="outdoors-v11" type="radio" name="rtoggle1" value="outdoors-v11">Outdoors</option>
												</select>

												<div style={{ overflowY: "hidden", width: "100%", height: "75vh", visibility: { setMapVisibility } }} className="map-container" ref={mapContainerRef} />
												<pre id="coordinates" className="coordinates" style={{ zIndex: "0", visibility: "hidden", height: "0px" }}></pre>

											</div> */}
											<div style={{ position: "relative", top: "-70px" }}>
												<MapFinder />
											</div>

											<div style={{ position: "relative", top: "-60px" }}>
												<p className="fw-bold m-0">Exact Location:</p>
												<input type="text" onChange={(e) => { setComplete_address(e.target.value) }} className="form-control" />
												<p className="fw-bold m-0">Landmark:</p>
												<input type="text" onChange={(e) => { setLandmark(e.target.value) }} className="form-control" />
												<p className="fw-bold m-0">Barangay:</p>
												<select onChange={(e) => { setBarangay(e.target.value) }} className="form-select">
													<option value=""></option>
													<option value="Bagumbayan">Bagumbayan</option>
													<option value="Bambang">Bambang</option>
													<option value="Calzada">Calzada</option>
													<option value="Hagonoy">Hagonoy</option>
													<option value="Ibayo-Tipas">Ibayo-Tipas</option>
													<option value="Ligid-Tipas">Ligid-Tipas</option>
													<option value="Lower Bicutan">Lower Bicutan</option>
													<option value="New Lower Bicutan">New Lower Bicutan</option>
													<option value="Napindan">Napindan</option>
													<option value="Palingon">Palingon</option>
													<option value="San Miguel">San Miguel</option>
													<option value="Santa Ana">Santa Ana</option>
													<option value="Tuktukan">Tuktukan</option>
													<option value="Ususan">Ususan</option>
													<option value="Wawa">Wawa</option>
													<option value="Central Bicutan">Central Bicutan</option>
													<option value="Central Signal Village">Central Signal Village</option>
													<option value="Fort Bonifacio">Fort Bonifacio</option>
													<option value="Katuparan">Katuparan</option>
													<option value="Maharlika Village">Maharlika Village</option>
													<option value="North Daang Hari">North Daang Hari</option>
													<option value="North Signal Village">North Signal Village</option>
													<option value="Pinagsama">Pinagsama</option>
													<option value="South Daang Hari">South Daang Hari</option>
													<option value="South Signal Village">South Signal Village</option>
													<option value="Tanyag">Tanyag</option>
													<option value="Upper Bicutan">Upper Bicutan</option>
													<option value="Western Bicutan">Western Bicutan</option>
												</select>
											</div>

										</div>
									</div>
								</div>
								{/*-----------------*/}
								<div className="d-flex mb-1">
									<div className="d-flex flex-column pe-4 align-items-center">
										<div className="circle rounded-circle py-2 px-3 mb-1">
											3
										</div>
										<div className="line h-100"></div>
									</div>
									<div className="w-100">
										<h3>Other Information</h3>

										<div>
											<p className="m-0">Type of Waste <i onClick={typeOfWasteInfo} class="bi bi-question-circle questionMark"></i>
											</p>
											<div className="crud-checkboxes">

												<input type="checkbox" className="btn-check" onChange={(e) => { !waste_type.includes("Animal Corpse") ? setWaste_type(oldArray => [...oldArray, e.target.value]) : setWaste_type(waste_type.filter(type => type !== e.target.value)) }} value="Animal Corpse" autoComplete="on" id="waste-ac" />
												<label className="btn btn-success crud-checkbox" style={waste_type.includes("Animal Corpse") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="waste-ac">
													<span className="bi bi-cone-striped" /> Animal Corpse</label>

												<input type="checkbox" className="btn-check" onChange={(e) => { !waste_type.includes("Automotive") ? setWaste_type(oldArray => [...oldArray, e.target.value]) : setWaste_type(waste_type.filter(type => type !== e.target.value)) }} value="Automotive" autoComplete="on" id="waste-au" />
												<label className="btn btn-success crud-checkbox" style={waste_type.includes("Automotive") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="waste-au">
													<span className="bi bi-car-front" /> Automotive</label>

												<input type="checkbox" className="btn-check" onChange={(e) => { !waste_type.includes("Burned") ? setWaste_type(oldArray => [...oldArray, e.target.value]) : setWaste_type(waste_type.filter(type => type !== e.target.value)) }} value="Burned" autoComplete="on" id="waste-br" />
												<label className="btn btn-success crud-checkbox" style={waste_type.includes("Burned") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="waste-br">
													<span className="bi bi-fire" /> Burned</label>

												<input type="checkbox" className="btn-check" onChange={(e) => { !waste_type.includes("Construction") ? setWaste_type(oldArray => [...oldArray, e.target.value]) : setWaste_type(waste_type.filter(type => type !== e.target.value)) }} value="Construction" autoComplete="on" id="waste-con" />
												<label className="btn btn-success crud-checkbox" style={waste_type.includes("Construction") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="waste-con">
													<span className="bi bi-hammer" /> Construction</label>

												<input type="checkbox" className="btn-check" onChange={(e) => { !waste_type.includes("Electronics") ? setWaste_type(oldArray => [...oldArray, e.target.value]) : setWaste_type(waste_type.filter(type => type !== e.target.value)) }} value="Electronics" autoComplete="on" id="waste-el" />
												<label className="btn btn-success crud-checkbox" style={waste_type.includes("Electronics") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="waste-el">
													<span className="bi bi-pc-display" /> Electronics</label>

												<input type="checkbox" className="btn-check" onChange={(e) => { !waste_type.includes("Hazardous") ? setWaste_type(oldArray => [...oldArray, e.target.value]) : setWaste_type(waste_type.filter(type => type !== e.target.value)) }} value="Hazardous" autoComplete="on" id="waste-haz" />
												<label className="btn btn-success crud-checkbox" style={waste_type.includes("Hazardous") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="waste-haz">
													<span className="bi bi-exclamation-triangle-fill" />Hazardous</label>

												<input type="checkbox" className="btn-check" onChange={(e) => { !waste_type.includes("Household") ? setWaste_type(oldArray => [...oldArray, e.target.value]) : setWaste_type(waste_type.filter(type => type !== e.target.value)) }} value="Household" autoComplete="on" id="waste-hou" />
												<label className="btn btn-success crud-checkbox" style={waste_type.includes("Household") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="waste-hou">
													<span className="bi bi-house" /> Household</label>

												<input type="checkbox" className="btn-check" onChange={(e) => { !waste_type.includes("Liquid Waste") ? setWaste_type(oldArray => [...oldArray, e.target.value]) : setWaste_type(waste_type.filter(type => type !== e.target.value)) }} value="Liquid Waste" autoComplete="on" id="waste-lw" />
												<label className="btn btn-success crud-checkbox" style={waste_type.includes("Liquid Waste") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="waste-lw">
													<span className="bi bi-droplet-fill" /> Liquid Waste</label>

												<input type="checkbox" className="btn-check" onChange={(e) => { !waste_type.includes("Metal/Can") ? setWaste_type(oldArray => [...oldArray, e.target.value]) : setWaste_type(waste_type.filter(type => type !== e.target.value)) }} value="Metal/Can" autoComplete="on" id="waste-mc" />
												<label className="btn btn-success crud-checkbox" style={waste_type.includes("Metal/Can") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="waste-mc">
													<span className="bi bi-trash" /> Metal/Can</label>

												<input type="checkbox" className="btn-check" onChange={(e) => { !waste_type.includes("Paper") ? setWaste_type(oldArray => [...oldArray, e.target.value]) : setWaste_type(waste_type.filter(type => type !== e.target.value)) }} value="Paper" autoComplete="on" id="waste-pp" />
												<label className="btn btn-success crud-checkbox" style={waste_type.includes("Paper") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="waste-pp">
													<span className="bi bi-newspaper" /> Paper</label>

												<input type="checkbox" className="btn-check" onChange={(e) => { !waste_type.includes("Plastic") ? setWaste_type(oldArray => [...oldArray, e.target.value]) : setWaste_type(waste_type.filter(type => type !== e.target.value)) }} value="Plastic" autoComplete="on" id="waste-pl" />
												<label className="btn btn-success crud-checkbox" style={waste_type.includes("Plastic") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="waste-pl">
													<span className="bi bi-cup-straw" /> Plastic</label>

												<input type="checkbox" className="btn-check" onChange={(e) => { !waste_type.includes("Glass Bottle") ? setWaste_type(oldArray => [...oldArray, e.target.value]) : setWaste_type(waste_type.filter(type => type !== e.target.value)) }} value="Glass Bottle" autoComplete="on" id="waste-gb" />
												<label className="btn btn-success crud-checkbox" style={waste_type.includes("Glass Bottle") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="waste-gb">
													<span className="bi bi-exclamation-triangle" /> Glass Bottle</label>

												<input type="checkbox" className="btn-check" onChange={(e) => { !waste_type.includes("Organic/Food") ? setWaste_type(oldArray => [...oldArray, e.target.value]) : setWaste_type(waste_type.filter(type => type !== e.target.value)) }} value="Organic/Food" autoComplete="on" id="waste-of" />
												<label className="btn btn-success crud-checkbox" style={waste_type.includes("Organic/Food") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="waste-of">
													<span className="bi bi-egg-fried" /> Organic/Food</label>


												<input type="checkbox" className="btn-check" onChange={(e) => { !waste_type.includes("Other") ? setWaste_type(oldArray => [...oldArray, e.target.value]) : setWaste_type(waste_type.filter(type => type !== e.target.value)) }} value="Other" autoComplete="on" id="waste-other" />
												<label className="btn btn-success crud-checkbox" style={waste_type.includes("Other") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="waste-other">
													<span className="bi bi-question-circle" /> Other</label>


												<input onChange={(e) => { setWaste_desc(e.target.value) }} className="form-control" style={waste_type.includes("Other") ? { visibility: "" } : { visibility: "hidden" }} type="text" placeholder="If other, please specify" id="waste-other-specify" />


											</div>



											{/* <p className="m-0">Category of Violation  <HashLink to="/how-to-report#violations"><i class="bi bi-question-circle questionMark"></i></HashLink>
										</p>
										<select onChange={(e)=>{setCategory_violation(e.target.value)}} className="form-select">
											<option value=""></option>
											<option value="Littering, Illegal dumping, Illegal disposal of garbage">Littering, Illegal dumping, Illegal disposal of garbage</option>
											<option value="Dirty frontage and immediate surroundings for establisments owners">Dirty frontage and immediate surroundings for establisments owners</option>
											<option value="Improper and untimely stacking of garbage outside residence or establishment">Improper and untimely stacking of garbage outside residence or establishment</option>
											<option value="Obstruction">Obstruction</option>
											<option value="Other">Other</option>
										</select> */}

											<p className="m-0">Additional Details</p>
											<textarea onChange={(e) => { setAdditional_desciption(e.target.value) }} className="form-control" />
											<div style={{ marginTop: "24px" }}>
												<span><b style={{ transition: "0.5s", position: "relative", bottom: "3px", color: reportAnonymously ? "#0fac35" : "gray" }}>Report Anonymously</b></span> &nbsp;<input onChange={(e) => { setReportAnonymously(e.target.checked) }} type="checkbox" id="switch" /><label for="switch" id="ToggleLabel">Toggle</label>
											</div>
											<br />
											<button onClick={() => { addMoreInfo ? setAddMoreInfo(false) : setAddMoreInfo(true) }} type="button" class="btn btn-success" style={{ backgroundColor: addMoreInfo ? "#146c43" : "lightGray", border: "unset", color: addMoreInfo ? "white" : "#949494" }}><b>Add more info (Optional)</b></button>
											<br />
											<br />

											{addMoreInfo ?
												<Fragment>
													<p className="m-0">Size of Waste <i onClick={sizeOfWasteInfo} class="bi bi-question-circle questionMark"></i>
													</p>
													<div className="crud-checkboxes">
														<input onChange={() => { setWaste_size('Trash Bin') }} type="radio" className="btn-check" name="size-option" autoComplete="on" id="size-tb" />
														<label className="btn btn-success crud-checkbox" htmlFor="size-tb">
															<span className="bi bi-trash" /> Trash Bin</label>

														<input onChange={() => { setWaste_size('Dump Truck') }} type="radio" className="btn-check" name="size-option" autoComplete="on" id="size-dt" />
														<label className="btn btn-success crud-checkbox" htmlFor="size-dt">
															<span className="bi bi-truck" /> Dump Truck</label>
													</div>

													<p className="m-0">Accessible by <i onClick={accessibleByWasteInfo} class="bi bi-question-circle questionMark"></i>
													</p>
													<div className="crud-checkboxes">
														<input onChange={() => { setAccessible_by('People Only') }} type="radio" className="btn-check" name="access-option" autoComplete="on" id="access-ppl" />
														<label className="btn btn-success crud-checkbox" htmlFor="access-ppl">
															<span className="bi bi-person" /> People Only</label>

														<input onChange={() => { setAccessible_by('Tricycle') }} type="radio" className="btn-check" name="access-option" autoComplete="on" id="access-tri" />
														<label className="btn btn-success crud-checkbox" htmlFor="access-tri">
															<img src="https://img.icons8.com/ios-filled/21/ffffff/auto-rickshaw.png" />&nbsp;
															Tricycle</label>

														<input onChange={() => { setAccessible_by('Motorcycle') }} type="radio" className="btn-check" name="access-option" autoComplete="on" id="access-mtc" />
														<label className="btn btn-success crud-checkbox" htmlFor="access-mtc">
															<img src="https://img.icons8.com/metro/22/ffffff/motorcycle.png" />&nbsp;
															Motorcycle</label>

														<input onChange={() => { setAccessible_by('Truck/Car') }} type="radio" className="btn-check" name="access-option" autoComplete="on" id="access-tc" />
														<label className="btn btn-success crud-checkbox" htmlFor="access-tc">
															<span className="bi bi-truck" /> Truck/Car</label>
														<input onChange={() => { setAccessible_by('Boat') }} type="radio" className="btn-check" name="access-option" autoComplete="on" id="access-bt" />
														<label className="btn btn-success crud-checkbox" htmlFor="access-bt">
															<span className="bi bi-water" /> Boat</label>
													</div>
													<br />
												</Fragment> : ""
											}



											{/* <p className="m-0 fw-bold">Reporter: <HashLink to="/how-to-report#name"><i class="bi bi-question-circle questionMark"></i></HashLink>
										</p>
										<select onChange={(e)=>{setReportUsing(e.target.value)}} className="form-select mb-3">
											<option value=""></option>
											<option value="Real Name">Real Name</option>
											<option value="Alias">Alias/Username</option>
											<option value="Anonymous">Anonymous</option>
										</select> */}

										</div>

									</div>
								</div>
								{/*-----------------*/}
								<div className="d-flex mb-1">
									<div className="d-flex flex-column pe-4 align-items-center">
										<div className="circle rounded-circle py-2 px-3 mb-1">
											4
										</div>
										<div className="line h-100 d-none"></div>
									</div>

									<div className="w-100">
										<button type="submit" className="m-0 btn bh-submitBtn float-none">Submit Report</button>
									</div>

								</div>
								{/*-----------------*/}
							</div>
						</form>
					}
				</div>
			</div>
		</Fragment>
	)
}

export default PublicReportsAdd