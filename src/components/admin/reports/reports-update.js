import React, { useRef, Fragment, useEffect, useState } from 'react';
import Sidebar from '../../../components/layouts/sidebar';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from '../../layouts/Loader'
import LoaderNoBg from '../../layouts/LoaderNoBg'
import Select from 'react-select';
// import { Icon } from '@iconify/react';
import { updateDump, getSingleDump, clearErrors } from '../../../actions/dumpActions'
import { getCollectors } from '../../../actions/collectionPointActions'

import { UPDATE_DUMP_RESET, UPDATE_DUMP_STATUS_RESET, DUMP_DETAILS_RESET } from '../../../constants/dumpConstants'
import { ALL_COLLECTORS_RESET } from '../../../constants/collectionPointConstants'

import HyperModal from 'react-hyper-modal';
import Webcam from "react-webcam"
import imageCompression from 'browser-image-compression';
import MetaData from '../../../components/layouts/MetaData'

import { SOCKET_PORT } from '../../../constants/socketConstants'
import io from "socket.io-client";

import cryptoRandomString from 'crypto-random-string';
import NotificationSender from '../../../notificationSender';

import '../../../Map.css';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapUpdate from '../../maps/MapUpdate';
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

mapboxgl.accessToken =
	'pk.eyJ1IjoianVzdGluZS0iLCJhIjoiY2wzZnl6NHJsMDRudjNmbHZvOGgwNGx4bSJ9.mwFsZ1bz00QuUmMr_MMOxg';



const socket = io.connect(SOCKET_PORT);

const ReportsUpdate = () => {
	const mapContainerRef = useRef(null);
	const webRef = useRef(null)
	let imgg = "httpsL;';'";

	const [lng, setLng] = useState('0');
	const [lat, setLat] = useState('0');
	const [zoom, setZoom] = useState(17);
	// const maxNumber = 69;

	// const [acBgColor, setAcBgColor]= useState({backgroundColor: "#808080"});
	// const [auBgColor, setAuBgColor]= useState({backgroundColor: "#808080"});
	// const [conBgColor, setConBgColor]= useState({backgroundColor: "#808080"});
	// const [elBgColor, setElBgColor]= useState({backgroundColor: "#808080"});
	// const [hazBgColor, setHazBgColor]= useState({backgroundColor: "#808080"});
	// const [houBgColor, setHouBgColor]= useState({backgroundColor: "#808080"});
	// const [lwBgColor, setLwBgColor]= useState({backgroundColor: "#808080"});
	// const [mcBgColor, setMcBgColor]= useState({backgroundColor: "#808080"});
	// const [ppBgColor, setPpBgColor]= useState({backgroundColor: "#808080"});
	// const [plBgColor, setPlBgColor]= useState({backgroundColor: "#808080"});
	// const [gbBgColor, setGbBgColor]= useState({backgroundColor: "#808080"});
	// const [ofBgColor, setOfBgColor]= useState({backgroundColor: "#808080"});
	// const [otherBgColor, setOtherBgColor]= useState({backgroundColor: "#808080"});


	const alert = useAlert();
	const dispatch = useDispatch();
	let navigate = useNavigate()
	const { id, long, lati } = useParams();



	const { loading, dump, error } = useSelector(state => state.dumpDetails)
	const { isUpdated, isUpdatedStatus, loading: updateLoading, error: updateError, dump: updatedDump } = useSelector(state => state.dump)
	const { error: collectorError, collectors } = useSelector(state => state.collectors);
	const { user } = useSelector(state => state.auth)
	const { latitude:mapLatitude, longitude:mapLongtitude } = useSelector(state => state.coordinate)

	const [status, setStatus] = useState('')
	const [latitude, setLatitude] = useState('')
	const [longtitude, setLongtitude] = useState('')

	const [images, setImages] = useState([]);
	const [oldImages, setOldImages] = useState([]);
	const [oldImagesPublic, setOldImagesPublic] = useState([]);

	const [complete_address, setComplete_address] = useState('')
	const [landmark, setLandmark] = useState('')
	const [barangay, setBarangay] = useState('')

	const [waste_type, setWaste_type] = useState([])
	const [waste_desc, setWaste_desc] = useState('')
	const [waste_size, setWaste_size] = useState('')
	const [accessible_by, setAccessible_by] = useState('')

	const [category_violation, setCategory_violation] = useState('')
	const [additional_desciption, setAdditional_desciption] = useState('')

	const [collectors2, setCollectors2] = useState([]);

	const [interactiveMap, setInteractiveMap] = useState(false)
	const [mapVisibility, setMapVisibility] = useState(true)
	const [addImageMode, setAddImageMode] = useState('')
	const [camLoading, setCamLoading] = useState(true);

	const [notifCode, setNotifCode] = useState('')


	useEffect(() => {

		dispatch(getCollectors());

		if (dump && dump._id !== id || isUpdated || isUpdatedStatus) {
			dispatch(getSingleDump(id));
			dispatch(getCollectors());
			setOldImages([])

		} else {
			setStatus(dump && dump.status)
			setNotifCode(cryptoRandomString({ length: 20, type: 'url-safe' }))
			setOldImages([])
			setLatitude(dump && dump.coordinates && dump.coordinates.latitude)
			setLongtitude(dump && dump.coordinates && dump.coordinates.longtitude)
			setComplete_address(dump && dump.complete_address)
			setLandmark(dump && dump.landmark)
			setBarangay(dump && dump.barangay)
			setWaste_desc(dump && dump.waste_desc)
			setWaste_size(dump && dump.waste_size)
			setAccessible_by(dump && dump.accessible_by)
			setCategory_violation(dump && dump.category_violation)
			setAdditional_desciption(dump && dump.additional_desciption)
		}

		dump && dump.waste_type && dump.waste_type.forEach(type => {
			setWaste_type(oldArray => [...oldArray, type.type])
		})

		dump && dump.images && dump.images.forEach(image => {
			setOldImages(oldArray => [...oldArray, image.url])
		})

		dump && dump.images && dump.images.forEach(image => {
			setOldImagesPublic(oldArray => [...oldArray, image.public_id])
		})


		setCollectors2([])

		dump && dump.collectors && dump.collectors.forEach(collector => {
			if (collector.collector._id !== undefined) {
				setCollectors2(oldArray => [...oldArray, { value: collector.collector._id, label: collector.collector.first_name + " " + collector.collector.last_name }])
			}
		})





		if (updateError) {
			alert.error(updateError)
			dispatch(clearErrors())
		}
		if (error) {
			alert.error(error)
			dispatch(clearErrors())
		}

		if (isUpdated) {
			console.log("room", updatedDump && updatedDump.chat_id && updatedDump.chat_id.room)
			NotificationSender(`Your reported illegal dump has been updated`, user._id, dump && dump.user_id && dump.user_id._id, barangay, 'illegalDump-update', notifCode, updatedDump && updatedDump)

			collectors2 && collectors2.forEach((coll2) => {
				NotificationSender(`An illegal dump has been assigned to you`, user._id, coll2.value, barangay, 'illegalDump-update', notifCode, updatedDump && updatedDump)
			})


			const adminUpdatedDumpData = {
				room: updatedDump && updatedDump.chat_id && updatedDump.chat_id.room,
				dump: updatedDump && updatedDump,
				createdAt: new Date(Date.now()),
				type: "admin-updated-dump"
			}
			socket.emit("send_message", adminUpdatedDumpData);



			alert.success("Dump Updated Successfully")
			dispatch({ type: UPDATE_DUMP_RESET })
			dispatch({ type: DUMP_DETAILS_RESET })
			navigate(`/admin/report/${id}/${longtitude}/${latitude}/`)
		}

		if (isUpdatedStatus) {
			dispatch({ type: UPDATE_DUMP_STATUS_RESET })
		}


	}, [dump, loading, updateError, isUpdated, error])

	//     useEffect(() => {
	//       // let counter = 0

	//     const map = new mapboxgl.Map({
	//       container: mapContainerRef.current,
	//       style: 'mapbox://styles/justine-/cl3g09pgu000714l6jzlyn2mm',
	//       center: [longtitude===''?long:longtitude, latitude===''?lati:latitude],
	//       zoom: zoom,
	//       interactive: interactiveMap
	//     });


	//     // Add navigation control (the +/- zoom buttons)
	//     map.addControl(new mapboxgl.NavigationControl(), 'top-right');

	//     map.on('move', () => {
	//       setLng(map.getCenter().lng.toFixed(4));
	//       setLat(map.getCenter().lat.toFixed(4));
	//       setZoom(map.getZoom().toFixed(2));
	//     });

	//     map.addControl(
	//       new mapboxgl.GeolocateControl({
	//       positionOptions: {
	//       enableHighAccuracy: true,
	//       },
	//       // When active the map will receive updates to the device's location as it changes.
	//       trackUserLocation: false,
	//       // Draw an arrow next to the location dot to indicate which direction the device is heading.
	//       showUserHeading: true,

	//       })
	//     );

	//     //Dragabble marker
	//     const coordinates = document.getElementById('coordinates');
	//     const marker = new mapboxgl.Marker({
	//     draggable: false
	//     })
	//     .setLngLat([121.050865, 14.517618])
	//     .addTo(map);

	//     map.on('load', function (e) {
	//         marker.setLngLat(map.getCenter());
	//     });

	//     map.on('move', function (e) {
	//         // console.log(`lng: ${map.getCenter().lng.toFixed(5)}`);
	//         // console.log(`lat: ${map.getCenter().lat.toFixed(5)}`);

	//         setLatitude(map.getCenter().lat.toFixed(5))
	//         setLongtitude(map.getCenter().lng.toFixed(5))

	//         marker.setLngLat(map.getCenter());
	//     });

	//     // function onDragEnd() {
	//     // const lngLat = marker.getLngLat();
	//     // console.log(lngLat)
	//     // coordinates.style.display = 'block';
	//     // coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
	//     // }

	//     // marker.on('dragend', onDragEnd);

	//     const input = document.getElementById("MapTypesSelect");

	//     input.onchange = (layer) => {
	//     const layerId = layer.target.value;
	//     map.setStyle('mapbox://styles/mapbox/' + layerId);
	//     };


	//     // Clean up on unmount
	//     return () => map.remove();


	//   }, [interactiveMap]); // eslint-disable-line react-hooks/exhaustive-deps


	useEffect(() => {
		// {console.log(waste_type)}
	}, [waste_type, oldImages, images, addImageMode])


	const removeOldImage = (image, public_url) => {

		setOldImages(oldImages.filter(type => type !== image))
		setOldImagesPublic(oldImagesPublic.filter(type => type !== public_url))
		setImages(images.filter(type => type !== image))
		alert.success("Image removed successfully")
	};

	const onChange = (e) => {
		const files = Array.from(e.target.files)
		const numberOfImages = files.length + images.length + oldImages.length

		if (files.length + images.length + oldImages.length < 6) {

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

		if (images.length + oldImages.length < 5) {

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
		const formData = new FormData();

		formData.set("status", status);
		formData.set("latitude", mapLatitude&&mapLatitude);
		formData.set("longtitude", mapLongtitude&&mapLongtitude);
		formData.set("complete_address", complete_address);
		formData.set("landmark", landmark);
		formData.set("barangay", barangay);
		if (waste_type.includes("Other")) {
			formData.set("waste_desc", waste_desc);
		} else {
			formData.set("waste_desc", "");
		}

		formData.set("waste_size", waste_size);
		formData.set("accessible_by", accessible_by);
		formData.set("category_violation", category_violation);
		formData.set("additional_desciption", additional_desciption);

		oldImagesPublic.forEach(oIP => {
			formData.append('oldImagesPublic', oIP)
		})
		images.forEach(images => {
			formData.append('images', images)
		})
		oldImages.forEach(oI => {
			formData.append('oldImages', oI)
		})
		waste_type.forEach(wt => {
			formData.append('waste_type', wt)
		})

		collectors2.forEach(collector2 => {
			formData.append('collectors', collector2.value)
		})

		formData.set('notifCode', notifCode);

		dispatch(updateDump(dump._id, formData))

	}

	return (
		<Fragment>
			<MetaData title={`${dump && dump.complete_address}`} />
			<div className="bh-dashboard">
				<div>
					<Sidebar />
				</div>
				<div className="bh-dashboard-section">
					<h5 className="py-2 px-3">
						Update Illegal Dump Report <i className="crud-id fw-light small user-select-all">({dump && dump._id})</i></h5>
					<hr className="m-0" />
					<form onSubmit={submitHandler}>
						<div className="contents">
							<div className="row text-center">
								<div className="col-lg-4 col-md-12 m-auto">
									{/*<p>Status:
									{loading||updateLoading?<LoaderNoBg/>:
										<select value={status} onChange={(e)=>{setStatus(e.target.value)}} className="form-select">
											<option value="newReport">newReport</option>
								            <option value="Confirmed">Confirmed</option>
								            <option value="Unfinish">Unfinish</option>
								            <option value="Cleaned">Cleaned</option>
										</select>
									}
									</p>*/}
								</div>
							</div>


							<div className="row text-center">
								<div className="col-lg-4 col-md-12 m-auto">
									<p>COLLECTORS:
										<Select
											onChange={(val) => { setCollectors2(val) }}
											value={collectors2}
											isMulti
											options={collectors}
										/>
									</p>
								</div>
							</div>



							<p className="section mt-0">Images ({oldImages.length + images.length}/5) </p>
							{loading || updateLoading ? <LoaderNoBg /> :
								<div className="crud-images">
									<b>(Old Images)</b>
									<br />
									{oldImages.map((image, index) => {
										return (
											<Fragment key={image}>
												<a target="_blank" style={{ diplay: "inline" }} href={image}><div className="crud-img" style={{ diplay: "inline", backgroundImage: `url(${image})` }}></div></a>
												<i onClick={() => (removeOldImage(image, oldImagesPublic[index]))} style={{ color: "#93d555", textShadow: "2px 2px 6px #1e5128", position: "relative", bottom: "14px", left: "-30px" }} on className="bi bi-x-circle-fill"></i>
											</Fragment>
										)
									}
									)
									}
									<br />
									<b>(Add Images)</b>
									<br />
									{images.map((image) => (
										<Fragment key={image}>
											<a target="_blank" style={{ diplay: "inline" }} href={image}><div className="crud-img" style={{ diplay: "inline", backgroundImage: `url(${image})` }}></div></a>
											<i onClick={() => (removeOldImage(image))} style={{ color: "#93d555", textShadow: "2px 2px 6px #1e5128", position: "relative", bottom: "14px", left: "-30px" }} on className="bi bi-x-circle-fill"></i>
										</Fragment>
									))
									}
									<br />

									<span className="center btnTakePhoto" onClick={() => { addImageMode !== "camera" ? setAddImageMode('camera') : setAddImageMode(''); setCamLoading(true); }} style={{ background: "#1e5128" }}><i className="bi bi-camera-fill"></i> Use Camera</span>&nbsp;&nbsp;
									<span className="center btnTakePhoto" onClick={() => { addImageMode !== "upload" ? setAddImageMode('upload') : setAddImageMode('') }} style={{ background: "#1e5128" }}><i className="bi bi-upload"></i> Upload Images</span>
									<br />
									<br />


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
											<label htmlFor="file-upload" style={{ padding: "20px", border: "5px dashed #98bf56", width: "50vw", borderRadius: "10px", margin: "30px" }}><i className="bi bi-upload"></i><br />Upload Images</label>
										</Fragment>
										: addImageMode === "camera" ?
											<div>
												<Webcam className="center" forceScreenshotSourceSize="true" onUserMedia={cameraLoading} ref={webRef} style={{ width: !camLoading ? "70%" : "0px", margin: !camLoading ? "24px" : "0px" }} />

												{camLoading ? <LoaderNoBg /> :
													<Fragment>
														<br />
														<br />


														<span className="center btnTakePhoto" onClick={() => { showImage() }} style={{}}><i className="bi bi-camera-fill"></i> Take Photo</span>&nbsp;&nbsp;
														<span className="center btnTakePhoto" onClick={() => { setAddImageMode(''); setCamLoading(true); }} style={{ background: "#e33434" }}><i className="bi bi-x-circle-fill"></i> Close</span>

														<br />
														<br />
													</Fragment>
												}
											</div>

											: ""

									}
								</div>
							}
							<p className="section mt-0">Location</p>
							<div className="row mb-2">
								{/* <div className="col-lg-6 col-sm-12 m-auto">
									{loading || updateLoading ? "" :
										<select className="form-select" style={{ width: "30vw", position: "relative", top: "50px", left: "10px", zIndex: "1000" }} aria-label="Default select example" id="MapTypesSelect" >
											<option id="satellite-v9" type="radio" name="rtoggle1" value="satellite-v9">Satellite</option>
											<option id="streets-v11" type="radio" name="rtoggle1" value="streets-v11">Streets</option>
											<option id="light-v10" type="radio" name="rtoggle1" value="light-v10">Light</option>
											<option id="dark-v10" type="radio" name="rtoggle1" value="dark-v10">Dark</option>
											<option id="outdoors-v11" type="radio" name="rtoggle1" value="outdoors-v11">Outdoors</option>
										</select>
									}
									<div style={{ overflowY: "hidden", width: "100%", height: "75vh", visibility: { setMapVisibility } }} className="map-container" ref={mapContainerRef} />
									<pre id="coordinates" className="coordinates" style={{ zIndex: "0", visibility: "hidden", height: "0px" }}></pre>
									{loading || updateLoading ? "" :
										interactiveMap === false ?
											<span className="btn btn-warning" onClick={(e) => { setInteractiveMap(true) }}><i className="bi bi-lock-fill"></i> Unlock Map Drag</span> :
											<span className="btn btn-primary" onClick={(e) => { setInteractiveMap(false) }}><i className="bi bi-unlock-fill"></i> Lock Map Drag</span>

									}

								</div> */}
								{loading || updateLoading ? <LoaderNoBg /> :
								<div className="col-lg-6 col-sm-12 m-auto" style={{position:"relative", top:"-80px"}}>
									<MapUpdate latitude={dump && dump.coordinates && dump.coordinates.latitude} longtitude={dump && dump.coordinates && dump.coordinates.longtitude}/>
								</div>
								}
								{loading || updateLoading ? "" :
									<div className="col-lg-6 col-sm-12">
										<p className="fw-bold m-0">Exact Location:</p>
										<input type="text" defaultValue={complete_address} onChange={(e) => { setComplete_address(e.target.value) }} className="form-control" />
										<p className="fw-bold m-0">Landmark:</p>
										<input type="text" defaultValue={landmark} onChange={(e) => { setLandmark(e.target.value) }} className="form-control" />
										<p className="fw-bold m-0">Barangay:</p>
										<select value={barangay} onChange={(e) => { setBarangay(e.target.value) }} className="form-select" required>
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
								}
							</div>
							<p className="section mt-0">Other Information</p>
							<p className="m-0">Type of Waste</p>
							{loading || updateLoading ? <LoaderNoBg /> :
								<Fragment>
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


										<input defaultValue={waste_desc} onChange={(e) => { setWaste_desc(e.target.value) }} className="form-control" style={waste_type.includes("Other") ? { visibility: "" } : { visibility: "hidden" }} type="text" placeholder="If other, please specify" id="waste-other-specify" />

									</div>

									<p className="m-0">Size of Waste</p>
									<div className="crud-checkboxes">
										<input onChange={() => { setWaste_size('Trash Bin') }} checked={waste_size === "Trash Bin" ? true : false} type="radio" className="btn-check" name="size-option" autoComplete="on" id="size-tb" />
										<label className="btn btn-success crud-checkbox" htmlFor="size-tb">
											<span className="bi bi-trash" /> Trash Bin</label>
										<input onChange={() => { setWaste_size('Dump Truck') }} checked={waste_size === "Dump Truck" ? true : false} type="radio" className="btn-check" name="size-option" autoComplete="on" id="size-dt" />
										<label className="btn btn-success crud-checkbox" htmlFor="size-dt">
											<span className="bi bi-truck" /> Dump Truck</label>
									</div>
									<p className="m-0">Accessible by</p>
									<div className="crud-checkboxes">
										<input onChange={() => { setAccessible_by('People Only') }} checked={accessible_by === "People Only" ? true : false} type="radio" className="btn-check" name="access-option" autoComplete="on" id="access-ppl" />
										<label className="btn btn-success crud-checkbox" htmlFor="access-ppl">
											<span className="bi bi-person" /> People Only</label>
										<input onChange={() => { setAccessible_by('Tricycle') }} checked={accessible_by === "Tricycle" ? true : false} type="radio" className="btn-check" name="access-option" autoComplete="on" id="access-tri" />
										<label className="btn btn-success crud-checkbox" htmlFor="access-tri">
											<img src="https://img.icons8.com/ios-filled/21/ffffff/auto-rickshaw.png" />&nbsp;
											Tricycle</label>
										<input onChange={() => { setAccessible_by('Motorcycle') }} checked={accessible_by === "Motorcycle" ? true : false} type="radio" className="btn-check" name="access-option" autoComplete="on" id="access-mtc" />
										<label className="btn btn-success crud-checkbox" htmlFor="access-mtc">
											<img src="https://img.icons8.com/metro/22/ffffff/motorcycle.png" />&nbsp;
											Motorcycle</label>
										<input onChange={() => { setAccessible_by('Truck/Car') }} checked={accessible_by === "Truck/Car" ? true : false} type="radio" className="btn-check" name="access-option" autoComplete="on" id="access-tc" />
										<label className="btn btn-success crud-checkbox" htmlFor="access-tc">
											<span className="bi bi-truck" /> Truck/Car</label>
										<input onChange={() => { setAccessible_by('Boat') }} checked={accessible_by === "Boat" ? true : false} type="radio" className="btn-check" name="access-option" autoComplete="on" id="access-bt" />
										<label className="btn btn-success crud-checkbox" htmlFor="access-bt">
											<span className="bi bi-water" /> Boat</label>
									</div>

									<p className="m-0">Category of Violation</p>
									<select value={category_violation} onChange={(e) => { setCategory_violation(e.target.value) }} className="form-select">
										<option value="Littering, Illegal dumping, Illegal disposal of garbage">Littering, Illegal dumping, Illegal disposal of garbage</option>
										<option value="Dirty frontage and immediate surroundings for establisments owners">Dirty frontage and immediate surroundings for establisments owners</option>
										<option value="Improper and untimely stacking of garbage outside residence or establishment">Improper and untimely stacking of garbage outside residence or establishment</option>
										<option value="Obstruction">Obstruction</option>
										<option value="Other">Other</option>
									</select>


									<p className="m-0">Additional Details</p>
									<textarea onChange={(e) => { setAdditional_desciption(e.target.value) }} defaultValue={additional_desciption} className="form-control" />
								</Fragment>
							}

							<p className="m-0 fw-bold">Reporter:</p>
							<p>{dump && dump.user_id && dump.user_id.first_name} {dump && dump.user_id && dump.user_id.last_name}<i>({dump && dump.user_id && dump.user_id.alias})</i> from {dump && dump.user_id && dump.user_id.barangay}</p>
						</div>
						<hr className="m-0" />
						<button className="btn bh-submitBtn m-3" type="submit">Save Changes</button>
					</form>
				</div>
			</div>
		</Fragment>
	)
}

export default ReportsUpdate