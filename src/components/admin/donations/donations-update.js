import React, { useRef, Fragment, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/layouts/sidebar';
import LoaderNoBg from '../../layouts/LoaderNoBg'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getItemDetails, updateItem, clearErrors } from '../../../actions/itemActions'
import { UPDATE_ITEM_RESET } from '../../../constants/itemConstants'
import MapView from '../../maps/MapView';

import HyperModal from 'react-hyper-modal';
import Webcam from "react-webcam";
import imageCompression from 'browser-image-compression';
import MetaData from '../../../components/layouts/MetaData'

import '../../../Map.css';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import 'mapbox-gl/dist/mapbox-gl.css'
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

mapboxgl.accessToken =
	'pk.eyJ1IjoianVzdGluZS0iLCJhIjoiY2wzZnl6NHJsMDRudjNmbHZvOGgwNGx4bSJ9.mwFsZ1bz00QuUmMr_MMOxg';



const DonationsUpdate = () => {
	const mapContainerRef = useRef(null);
	const webRef = useRef(null)
	let imgg = "httpsL;';'";

	const [lng, setLng] = useState('0');
	const [lat, setLat] = useState('0');
	const [zoom, setZoom] = useState(17);

	const [images, setImages] = useState([]);
	const [oldImages, setOldImages] = useState([]);
	const [oldImagesPublic, setOldImagesPublic] = useState([]);

	const [name, setName] = useState('');
	const [addionalDesciption, setAditionalDescription] = useState('');
	const [barangay, setBarangay] = useState('');
	const [itemTypes, setItemTypes] = useState([]);
	const [itemDesc, setItemDesc] = useState('');
	const [status, setStatus] = useState('');

	const [addImageMode, setAddImageMode] = useState('')
	const [camLoading, setCamLoading] = useState(true);

	const alert = useAlert();
	const dispatch = useDispatch();
	let navigate = useNavigate();
	const { error, item } = useSelector(state => state.itemDetails);
	const { error: updateError, isUpdated, loading } = useSelector(state => state.item);
	let { id } = useParams();

	useEffect(() => {
		// dispatch(getItemDetails(id));
		if (item && item._id !== id || isUpdated) {
			dispatch(getItemDetails(id));
		} else {
			setName(item.name);
			setAditionalDescription(item.addional_desciption);
			setBarangay(item.barangay_hall);
			setItemDesc(item.item_desc);
			setStatus(item.status)
		}

		item && item.images && item.images.forEach(image => {
			setOldImages(oldArray => [...oldArray, image.url])
		})

		item && item.images && item.images.forEach(image => {
			setOldImagesPublic(oldArray => [...oldArray, image.public_id])
		})

		item && item.item_type && item.item_type.forEach(item_type => {
			setItemTypes(oldArray => [...oldArray, item_type.type])
		})

		if (isUpdated) {
			navigate(`/admin/donation/${item._id}`);
			alert.success('Item updated successfully');
			dispatch({ type: UPDATE_ITEM_RESET });
		}

		if (updateError) {
			alert.error(updateError);
			dispatch(clearErrors())
		}

		if (error) {
			alert.error(error);
			dispatch(clearErrors())
		}

	}, [dispatch, item, isUpdated, updateError, error, alert]);

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

	// 	 useEffect(() => {	 	

	// 	 const barangays = {
	// 	 	Bagumbayan:[121.05924206803411, 14.473774649313196],
	// 	 	Bambang:[121.07297471217399,14.52577008620341],
	// 	 	Calzada:[121.08000894132097, 14.533619787394496],
	// 	 	Hagonoy:[121.06162966585019, 14.511649221382521],
	// 		"Ibayo-Tipas":[121.08475762358806, 14.541766751550389],
	// 		"Ligid-Tipas":[121.08473120422887, 14.541773687735182],
	// 		"Lower Bicutan":[121.06229965724987, 14.488944645566308],
	// 		"New Lower Bicutan":[121.0652470367573, 14.505379302559184],
	// 		Napindan:[121.0961600538771,14.540263915184013],
	// 		Palingon:[121.08018865634412, 14.538256882049698],
	// 		"San Miguel":[121.07480765437771, 14.517814348623812],
	// 		"Santa Ana":[121.07686198942896, 14.527932178623535],
	// 		Tuktukan:[ 121.07181460457123, 14.528203695545075],
	// 		Ususan:[121.06870824841819, 14.535486937998462],
	// 		Wawa:[121.07509642634135, 14.521833881862982],
	// 		"Central Bicutan":[121.05406605687651, 14.49200668084731],
	// 		"Central Signal Village":[121.05654718163518,14.511360625728697],
	// 		"Fort Bonifacio":[121.02685222392394, 14.5256292940773],
	// 		Katuparan:[ 121.05838280343642, 14.521473719288505],
	// 		"Maharlika Village":[121.05539748012504, 14.497235903682506],
	// 		"North Daang Hari":[121.04829074488599, 14.485817269464212],
	// 		"North Signal Village":[121.05557948004248, 14.51529618707773],
	// 		Pinagsama:[121.0556073,14.5230837 ],
	// 		"South Daang Hari":[121.04876862250126, 14.47146040914458],
	// 		"South Signal Village":[121.05354243593912, 14.505188137766536],
	// 		Tanyag:[121.04944295523825, 14.47817374094515],
	// 		"Upper Bicutan":[121.05034993106864, 14.496916364200366],
	// 		"Western Bicutan":[121.03811937461039, 14.509578360670313],
	// 	 }

	//     const map = new mapboxgl.Map({
	//       container: mapContainerRef.current,
	//       style: 'mapbox://styles/justine-/cl3g09pgu000714l6jzlyn2mm',
	//       center: barangays[barangay]===undefined?[121.050865, 14.517618]:barangays[barangay],
	//       zoom: zoom,
	//       interactive: false
	//     });


	//     // Add navigation control (the +/- zoom buttons)
	//     map.addControl(new mapboxgl.NavigationControl(), 'top-right');

	//     map.on('move', () => {
	//       setLng(map.getCenter().lng.toFixed(4));
	//       setLat(map.getCenter().lat.toFixed(4));
	//       setZoom(map.getZoom().toFixed(2));
	//     });


	//     //Dragabble marker
	//     if(barangays[barangay]!==undefined){
	// 	    const coordinates = document.getElementById('coordinates');
	// 	    const marker = new mapboxgl.Marker({
	// 	    draggable: false
	// 	    })
	// 	    .setLngLat([121.050865, 14.517618])
	// 	    .addTo(map);

	// 	    map.on('load', function (e) {
	// 	        marker.setLngLat(map.getCenter());
	// 	    });
	// 	}


	//     const input = document.getElementById("MapTypesSelect");
	//     input.onchange = (layer) => {
	//     const layerId = layer.target.value;
	//     map.setStyle('mapbox://styles/mapbox/' + layerId);
	//     };


	//     // Clean up on unmount
	//     return () => map.remove();


	//   }, [barangay]); // eslint-disable-line react-hooks/exhaustive-deps



	const submitHandler = (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.set('name', name);
		formData.set('addional_desciption', addionalDesciption);
		formData.set('barangay', barangay);
		formData.set('item_desc', itemDesc);
		formData.set('status', status);

		itemTypes.forEach(itemType => {
			formData.append('item_types', itemType)
		})

		oldImagesPublic.forEach(oIP => {
			formData.append('oldImagesPublic', oIP)
		})
		images.forEach(images => {
			formData.append('images', images)
		})
		oldImages.forEach(oI => {
			formData.append('oldImages', oI)
		})

		dispatch(updateItem(item._id, formData))
	}

	const [fdBgColor, setFdBgColor] = useState({ backgroundColor: "#808080" });
	const [clBgColor, setClBgColor] = useState({ backgroundColor: "#808080" });
	const [medBgColor, setMedBgColor] = useState({ backgroundColor: "#808080" });
	const [dvBgColor, setDvBgColor] = useState({ backgroundColor: "#808080" });
	const [frBgColor, setFrBgColor] = useState({ backgroundColor: "#808080" });
	const [otherBgColor, setOtherBgColor] = useState({ backgroundColor: "#808080" });

	const [otherInput, setOtherInput] = useState({ visibility: "hidden" });

	const removeOldImage = (image, public_url) => {
		setOldImages(oldImages.filter(type => type !== image))
		setOldImagesPublic(oldImagesPublic.filter(type => type !== public_url))
		setImages(images.filter(type => type !== image))
		alert.success("Image removed successfully")
	};

	const onChange = e => {
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


	return (
		<Fragment>
			<MetaData title={`${item.name}`} />
			<div className="bh-dashboard">
				<div>
					<Sidebar />
				</div>
				<div className="bh-dashboard-section">

					<h5 className="py-2 px-3">
						<span style={{ float: "right" }}>Code: <i>{item && item.code}</i></span>
						Update Donation <i className="crud-id fw-light small user-select-all">({item._id})</i></h5>

					<hr className="m-0" />
					<form onSubmit={submitHandler}>
						<div className="contents">
							<div className="row text-center">
								{loading ? "" :
									<div className="col-lg-4 col-md-12 m-auto">
										<p>Status:
											<select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
												<option value="Claimed">Claimed</option>
												<option value="Unclaimed">Unclaimed</option>
												<option value="Received">Received</option>
											</select>
										</p>
									</div>
								}
							</div>
							<p className="section mt-0">Images ({oldImages.length + images.length}/5) </p>
							{loading ? <LoaderNoBg /> :
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
												<Webcam className="center" forceScreenshotSourceSize="true" onUserMedia={cameraLoading} ref={webRef} style={{ width: "70%" }} />

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
							{loading ? "" :
								<Fragment>
									<p className="fw-bold m-0">Barangay Hall</p>
									<i>(To ensure the security of both parties, the meetup location for donation should only be in the Barangay Hall of one of the involved parties. )</i>
									<select className="form-control mb-2" value={barangay} onChange={(e) => setBarangay(e.target.value)}>
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
								</Fragment>
							}

							{/* <select style={{ width: "30vw", position: "relative", top: "50px", left: "10px", zIndex: "1000" }} className="form-select" aria-label="Default select example" id="MapTypesSelect" >
								<option id="satellite-v9" type="radio" name="rtoggle1" value="satellite-v9">Satellite</option>
								<option id="streets-v11" type="radio" name="rtoggle1" value="streets-v11">Streets</option>
								<option id="light-v10" type="radio" name="rtoggle1" value="light-v10">Light</option>
								<option id="dark-v10" type="radio" name="rtoggle1" value="dark-v10">Dark</option>
								<option id="outdoors-v11" type="radio" name="rtoggle1" value="outdoors-v11">Outdoors</option>
							</select> */}

							{/* <div style={{overflowY:"hidden", width:"100%",  height:"75vh"}} className="map-container" ref={mapContainerRef} />
      							<pre id="coordinates" className="coordinates" style={{zIndex:"0", visibility:"hidden", height:"0px"}}></pre> */}

							<MapView divHeight={"100vh"} latitude={barangays[barangay] && barangays[barangay][1]} longtitude={barangays[barangay] && barangays[barangay][0]} iconLink={"/images/box.png"} />


							<p className="section mt-0">Other Information</p>
							{loading ? <LoaderNoBg /> :
								<Fragment>
									<p className="m-0">Type of Donation</p>
									<div className="crud-checkboxes">
										<input type="checkbox" className="btn-check" onChange={(e) => { !itemTypes.includes("Food") ? setItemTypes(oldArray => [...oldArray, e.target.value]) : setItemTypes(itemTypes.filter(type => type !== e.target.value)) }} value="Food" autoComplete="on" id="food-gb" />
										<label className="btn btn-success crud-checkbox" style={itemTypes.includes("Food") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="food-gb">
											<span className="bi bi-egg-fried" /> Food</label>

										<input type="checkbox" className="btn-check" onChange={(e) => { !itemTypes.includes("Clothes") ? setItemTypes(oldArray => [...oldArray, e.target.value]) : setItemTypes(itemTypes.filter(type => type !== e.target.value)) }} value="Clothes" autoComplete="on" id="clothes-gb" />
										<label className="btn btn-success crud-checkbox" style={itemTypes.includes("Clothes") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="clothes-gb">
											<span className="bi bi-tags" /> Clothes</label>

										<input type="checkbox" className="btn-check" onChange={(e) => { !itemTypes.includes("Medical") ? setItemTypes(oldArray => [...oldArray, e.target.value]) : setItemTypes(itemTypes.filter(type => type !== e.target.value)) }} value="Medical" autoComplete="on" id="medical-gb" />
										<label className="btn btn-success crud-checkbox" style={itemTypes.includes("Medical") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="medical-gb">
											<span className="bi bi-capsule" /> Medical</label>

										<input type="checkbox" className="btn-check" onChange={(e) => { !itemTypes.includes("Appliances") ? setItemTypes(oldArray => [...oldArray, e.target.value]) : setItemTypes(itemTypes.filter(type => type !== e.target.value)) }} value="Appliances" autoComplete="on" id="appliances-gb" />
										<label className="btn btn-success crud-checkbox" style={itemTypes.includes("Appliances") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="appliances-gb">
											<span className="bi bi-laptop" /> Appliances</label>


										<input type="checkbox" className="btn-check" onChange={(e) => { !itemTypes.includes("Furnitures") ? setItemTypes(oldArray => [...oldArray, e.target.value]) : setItemTypes(itemTypes.filter(type => type !== e.target.value)) }} value="Furnitures" autoComplete="on" id="furnitures-gb" />
										<label className="btn btn-success crud-checkbox" style={itemTypes.includes("Furnitures") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="furnitures-gb">
											<span className="bi bi-lamp" /> Furnitures</label>

										<input type="checkbox" className="btn-check" onChange={(e) => { !itemTypes.includes("Other") ? setItemTypes(oldArray => [...oldArray, e.target.value]) : setItemTypes(itemTypes.filter(type => type !== e.target.value)) }} value="Other" autoComplete="on" id="other-gb" />
										<label className="btn btn-success crud-checkbox" style={itemTypes.includes("Other") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="other-gb">
											<span className="bi bi-question-circle" /> Other</label>


										<input value={itemDesc} onChange={(e) => { setItemDesc(e.target.value) }} className="form-control" style={itemTypes.includes("Other") ? { visibility: "" } : { visibility: "hidden" }} type="text" placeholder="If other, please specify" id="item-other-specify" />
									</div>

									<p className="m-0">Name</p>
									<input className="form-control" value={name} onChange={(e) => setName(e.target.value)}></input>

									<p className="m-0">Additional Details</p>
									<textarea className="form-control" value={addionalDesciption} onChange={(e) => setAditionalDescription(e.target.value)} />

									<p className="m-0 fw-bold">Donated by:</p>
									<p>{item.user_id && item.user_id.first_name} {item.user_id && item.user_id.last_name} <i>({item.user_id && item.user_id.alias})</i> from {item.user_id && item.user_id.barangay}</p>
								</Fragment>
							}
						</div>
						<hr className="m-0" />
						<button className="btn bh-submitBtn m-3" type="submit">Save Changes</button>
					</form>
				</div>
			</div>
		</Fragment>
	)
}

export default DonationsUpdate