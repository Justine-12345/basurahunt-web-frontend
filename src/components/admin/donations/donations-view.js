import React, { useRef, Fragment, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/layouts/sidebar';

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getItemDetails, clearErrors } from '../../../actions/itemActions'
import MetaData from '../../../components/layouts/MetaData'
import MapView from '../../maps/MapView';
import '../../../Map.css';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

import 'mapbox-gl/dist/mapbox-gl.css'
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

mapboxgl.accessToken =
	'pk.eyJ1IjoianVzdGluZS0iLCJhIjoiY2wzZnl6NHJsMDRudjNmbHZvOGgwNGx4bSJ9.mwFsZ1bz00QuUmMr_MMOxg';



const DonationsView = () => {
	const mapContainerRef = useRef(null);
	const [itemTypes, setItemTypes] = useState([]);
	const [itemDesc, setItemDesc] = useState('');

	const [lng, setLng] = useState('0');
	const [lat, setLat] = useState('0');
	const [zoom, setZoom] = useState(17);
	const [barangay, setBarangay] = ('')

	const alert = useAlert();
	const dispatch = useDispatch();
	let navigate = useNavigate()
	const { error, item } = useSelector(state => state.itemDetails);
	const { isUpdated } = useSelector(state => state.item);
	let { id } = useParams();

	useEffect(() => {
		if (item._id !== id || isUpdated) {
			setItemTypes([])
			dispatch(getItemDetails(id));
		}
		setItemTypes([])
		item && item.item_type && item.item_type.forEach(item_type => {
			setItemTypes(oldArray => [...oldArray, item_type.type])
		})

		if (error) {
			alert.error(error);
			dispatch(clearErrors())
		}
	}, [dispatch, item, error, alert]);


	let datePosted = new Date(item.createdAt).toLocaleDateString('en-us', { year: "numeric", month: "long", day: "numeric" });
	let dateClaimed = "None";
	if (item.date_recieved) {
		dateClaimed = new Date(item.date_recieved).toLocaleDateString('en-us', { year: "numeric", month: "long", day: "numeric" });
	}

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

	// useEffect(()=>{

	// 	const barangays = {
	//  	Bagumbayan:[121.05924206803411, 14.473774649313196],
	//  	Bambang:[121.07297471217399,14.52577008620341],
	//  	Calzada:[121.08000894132097, 14.533619787394496],
	//  	Hagonoy:[121.06162966585019, 14.511649221382521],
	// 	"Ibayo-Tipas":[121.08475762358806, 14.541766751550389],
	// 	"Ligid-Tipas":[121.08473120422887, 14.541773687735182],
	// 	"Lower Bicutan":[121.06229965724987, 14.488944645566308],
	// 	"New Lower Bicutan":[121.0652470367573, 14.505379302559184],
	// 	Napindan:[121.0961600538771,14.540263915184013],
	// 	Palingon:[121.08018865634412, 14.538256882049698],
	// 	"San Miguel":[121.07480765437771, 14.517814348623812],
	// 	"Santa Ana":[121.07686198942896, 14.527932178623535],
	// 	Tuktukan:[ 121.07181460457123, 14.528203695545075],
	// 	Ususan:[121.06870824841819, 14.535486937998462],
	// 	Wawa:[121.07509642634135, 14.521833881862982],
	// 	"Central Bicutan":[121.05406605687651, 14.49200668084731],
	// 	"Central Signal Village":[121.05654718163518,14.511360625728697],
	// 	"Fort Bonifacio":[121.02685222392394, 14.5256292940773],
	// 	Katuparan:[ 121.05838280343642, 14.521473719288505],
	// 	"Maharlika Village":[121.05539748012504, 14.497235903682506],
	// 	"North Daang Hari":[121.04829074488599, 14.485817269464212],
	// 	"North Signal Village":[121.05557948004248, 14.51529618707773],
	// 	Pinagsama:[121.0556073,14.5230837 ],
	// 	"South Daang Hari":[121.04876862250126, 14.47146040914458],
	// 	"South Signal Village":[121.05354243593912, 14.505188137766536],
	// 	Tanyag:[121.04944295523825, 14.47817374094515],
	// 	"Upper Bicutan":[121.05034993106864, 14.496916364200366],
	// 	"Western Bicutan":[121.03811937461039, 14.509578360670313],
	//  }
	//   const map = new mapboxgl.Map({
	//   container: mapContainerRef.current,
	//   style: 'mapbox://styles/justine-/cl3g09pgu000714l6jzlyn2mm',
	//   center: barangays[item.barangay_hall]===undefined?[121.050865, 14.517618]:barangays[item.barangay_hall],
	//   zoom: zoom,
	//   interactive: false
	// });


	// // Add navigation control (the +/- zoom buttons)
	// map.addControl(new mapboxgl.NavigationControl(), 'top-right');

	// map.on('move', () => {
	//   setLng(map.getCenter().lng.toFixed(4));
	//   setLat(map.getCenter().lat.toFixed(4));
	//   setZoom(map.getZoom().toFixed(2));
	// });


	// //Dragabble marker
	// if(barangays[item.barangay_hall]!==undefined){
	//     const coordinates = document.getElementById('coordinates');
	//     const marker = new mapboxgl.Marker({
	//     draggable: false
	//     })
	//     .setLngLat([121.050865, 14.517618])
	//     .addTo(map);

	//     map.on('load', function (e) {
	//         marker.setLngLat(map.getCenter());
	//     });
	// }


	// const input = document.getElementById("MapTypesSelect");
	// input.onchange = (layer) => {
	// const layerId = layer.target.value;
	// map.setStyle('mapbox://styles/mapbox/' + layerId);
	// };


	// // Clean up on unmount
	// return () => map.remove();



	// },[item])

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
						Donation <i className="crud-id fw-light small user-select-all" id="donation-id">({item._id})</i></h5>

					<hr className="m-0" />
					<div className="contents">
						<div className="row text-center">
							<div className="col-lg-4 col-md-12 m-auto">
								<p className="m-0">Status: <span className="m-0 fw-bold">{item.status}</span></p>
							</div>
							<div className="col-lg-4 col-md-6 m-auto">
								<p className="m-0">Date Posted: <span className="m-0 fw-bold">{datePosted}</span></p>
							</div>
							<div className="col-lg-4 col-md-6 m-auto">
								<p className="m-0">Date Recieved: <span className="m-0 fw-bold">{dateClaimed}</span></p>
							</div>
						</div>
						<p className="section mt-0">Images</p>
						<div className="crud-images">
							{
								item.images && item.images[0] && item.images.map((image) => {
									return (
										<Fragment>
											<a target="_blank" href={image.url}><div className="crud-img" style={{ backgroundImage: "url('" + image.url + "')" }}></div></a>
										</Fragment>
									)
								})
							}
						</div>
						<p className="section mt-0">Location</p>
						<p className="fw-bold m-0">Barangay Hall</p>
						<i>(To ensure the security of both parties, the meetup location for donation should only be in the Barangay Hall of one of the involved parties. )</i>
						<p className="fw-bold" id="donation-location">{item.barangay_hall}</p>

						{/* <select style={{width:"30vw", position:"relative", top:"50px", left:"10px", zIndex:"1000"}} className="form-select" aria-label="Default select example" id="MapTypesSelect" >
						              <option id="satellite-v9" type="radio" name="rtoggle1" value="satellite-v9">Satellite</option>
						              <option id="streets-v11" type="radio" name="rtoggle1" value="streets-v11">Streets</option>
						              <option id="light-v10" type="radio" name="rtoggle1" value="light-v10">Light</option>
						              <option id="dark-v10" type="radio" name="rtoggle1" value="dark-v10">Dark</option>
						              <option id="outdoors-v11" type="radio" name="rtoggle1" value="outdoors-v11">Outdoors</option>
						    </select>
							<div style={{overflowY:"hidden", width:"100%",  height:"75vh"}} className="map-container" ref={mapContainerRef} />
      						<pre id="coordinates" className="coordinates" style={{zIndex:"0", visibility:"hidden", height:"0px"}}></pre>
      							 */}
						{item && item.barangay_hall &&
							<MapView divHeight={"100vh"} latitude={barangays[item && item.barangay_hall] && barangays[item && item.barangay_hall][1]} longtitude={barangays[item && item.barangay_hall] && barangays[item && item.barangay_hall][0]} iconLink={"/images/box.png"} />
						}
						<p className="section mt-0">Other Information</p>
						<p className="m-0">Type of Donation</p>
						<div className="crud-checkboxes">
							<input disabled type="checkbox" className="btn-check" onChange={(e) => { !itemTypes.includes("Food") ? setItemTypes(oldArray => [...oldArray, e.target.value]) : setItemTypes(itemTypes.filter(type => type !== e.target.value)) }} value="Food" autoComplete="on" id="food-gb" />
							<label className="btn btn-success crud-checkbox" style={itemTypes.includes("Food") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="food-gb">
								<span className="bi bi-egg-fried" /> Food</label>

							<input disabled type="checkbox" className="btn-check" onChange={(e) => { !itemTypes.includes("Clothes") ? setItemTypes(oldArray => [...oldArray, e.target.value]) : setItemTypes(itemTypes.filter(type => type !== e.target.value)) }} value="Clothes" autoComplete="on" id="clothes-gb" />
							<label className="btn btn-success crud-checkbox" style={itemTypes.includes("Clothes") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="clothes-gb">
								<span className="bi bi-tags" /> Clothes</label>

							<input disabled type="checkbox" className="btn-check" onChange={(e) => { !itemTypes.includes("Medical") ? setItemTypes(oldArray => [...oldArray, e.target.value]) : setItemTypes(itemTypes.filter(type => type !== e.target.value)) }} value="Medical" autoComplete="on" id="medical-gb" />
							<label className="btn btn-success crud-checkbox" style={itemTypes.includes("Medical") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="medical-gb">
								<span className="bi bi-capsule" /> Medical</label>

							<input disabled type="checkbox" className="btn-check" onChange={(e) => { !itemTypes.includes("Appliances") ? setItemTypes(oldArray => [...oldArray, e.target.value]) : setItemTypes(itemTypes.filter(type => type !== e.target.value)) }} value="Appliances" autoComplete="on" id="appliances-gb" />
							<label className="btn btn-success crud-checkbox" style={itemTypes.includes("Appliances") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="appliances-gb">
								<span className="bi bi-laptop" /> Appliances</label>


							<input disabled type="checkbox" className="btn-check" onChange={(e) => { !itemTypes.includes("Furnitures") ? setItemTypes(oldArray => [...oldArray, e.target.value]) : setItemTypes(itemTypes.filter(type => type !== e.target.value)) }} value="Furnitures" autoComplete="on" id="furnitures-gb" />
							<label className="btn btn-success crud-checkbox" style={itemTypes.includes("Furnitures") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="furnitures-gb">
								<span className="bi bi-lamp" /> Furnitures</label>

							<input disabled type="checkbox" className="btn-check" onChange={(e) => { !itemTypes.includes("Other") ? setItemTypes(oldArray => [...oldArray, e.target.value]) : setItemTypes(itemTypes.filter(type => type !== e.target.value)) }} value="Other" autoComplete="on" id="other-gb" />
							<label className="btn btn-success crud-checkbox" style={itemTypes.includes("Other") ? { backgroundColor: "#1e5128" } : { backgroundColor: "#808080" }} htmlFor="other-gb">
								<span className="bi bi-question-circle" /> Other</label>


							<input disabled value={item.item_desc} onChange={(e) => { setItemDesc(e.target.value) }} className="form-control" style={itemTypes.includes("Other") ? { visibility: "" } : { visibility: "hidden" }} type="text" placeholder="If other, please specify" id="item-other-specify" />
						</div>

						<p className="m-0">Name</p>
						<input disabled className="form-control" value={item.name}></input>

						<p className="m-0">Additional Details</p>
						<textarea disabled className="form-control" value={item.addional_desciption} />

						<p className="m-0 fw-bold">Donated by:</p>
						<p><Link to={`/admin/user/${item.user_id && item.user_id._id}`}>{item.user_id && item.user_id.first_name} {item.user_id && item.user_id.last_name} <i>({item.user_id && item.user_id.alias})</i> from {item.user_id && item.user_id.barangay}</Link></p>

						<p className="m-0 fw-bold">Claimed by:</p>
						{item.receiver_id ?
							<p><Link to={`/admin/user/${item.receiver_id && item.receiver_id._id}`}>{item.receiver_id && item.receiver_id.first_name} {item.receiver_id && item.receiver_id.last_name} <i>({item.receiver_id && item.receiver_id.alias})</i> from {item.receiver_id && item.receiver_id.barangay}</Link></p>:
							"Not yet claimed"
						}
					</div>
					<hr className="m-0" />
					<Link to={"/admin/donation/" + item._id + "/edit"} className="btn bh-submitBtn m-3">Edit</Link>
				</div>
			</div>
		</Fragment>
	)
}

export default DonationsView