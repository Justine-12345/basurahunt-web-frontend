import React, {useRef, Fragment, useEffect, useState} from 'react';
import {useNavigate, useParams, useLocation, Link} from 'react-router-dom';
import SidebarCollector from '../../components/layouts/sidebar-collector';

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getCollectionPointDetails, addCollectionnumOfTruck, clearErrors } from '../../actions/collectionPointActions'
import { ADD_COLLECTION_NUMBER_OF_TRUCK_RESET } from '../../constants/collectionPointConstants'
import { SOCKET_PORT } from '../../constants/socketConstants'
import io from "socket.io-client";
import MetaData from '../../components/layouts/MetaData'
	
import cryptoRandomString from 'crypto-random-string';
import NotificationSender from '../../notificationSender';

import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapLive from '../maps/MapLive';
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

mapboxgl.accessToken =
  'pk.eyJ1IjoianVzdGluZS0iLCJhIjoiY2wzZnl6NHJsMDRudjNmbHZvOGgwNGx4bSJ9.mwFsZ1bz00QuUmMr_MMOxg';


const socket = io.connect(SOCKET_PORT);


const CollectorScheduleToday = () => {

	  const mapContainerRef = useRef(null);

	  let [lng, setLng] = useState(121.030967);
	  const [lat, setLat] = useState(14.517618);
	  const [zoom, setZoom] = useState(17);
	  // Initialize map when component mounts
	  let counter = 0
	  let long = lng;
	  let lati = lat;

	const alert = useAlert();
    const dispatch = useDispatch();
    let navigate = useNavigate()
    const { loading, error, collectionPoint } = useSelector(state => state.collectionPointDetails);
    const { loading:addNumOfTruckLoading, isAdded } = useSelector(state => state.collectionPoint);
		const { user } = useSelector(state => state.auth)
		const {id, roomCode} = useParams()
		const [room, setRoom] = useState("")
		const [numOfTruck, setNumOfTruck] = useState(0)
		const [numOfTruckHistory, setNumOfTruckHistory] = useState([])
		const [notifCode, setNotifCode] = useState('')
	let intervalID

	useEffect(()=>{
    		socket.disconnect()
    		if (collectionPoint && collectionPoint._id !== id) {
	  		 	dispatch(getCollectionPointDetails(id));
  			}

			  setNumOfTruckHistory(collectionPoint&&collectionPoint.collectionPerTruck&&collectionPoint.collectionPerTruck)
  	
			setRoom(collectionPoint&&collectionPoint.roomCode)
				
				
			socket.connect()
			socket.emit("join_room", collectionPoint&&collectionPoint.roomCode)


    },[collectionPoint, socket, room,  isAdded, numOfTruckHistory])



	useEffect(() => {

			
        if (collectionPoint && (collectionPoint._id !== id)) {
	  		 	 dispatch(getCollectionPointDetails(id));
  			}

  		  setNotifCode(cryptoRandomString({length: 20, type: 'url-safe'}))
  			setRoom(collectionPoint&&collectionPoint.roomCode)
  			setNumOfTruckHistory(collectionPoint&&collectionPoint.collectionPerTruck&&collectionPoint.collectionPerTruck)
  	

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }


        if(isAdded){
        	NotificationSender(`New record has been added`, user._id, null, user.barangay, 'collection-mass-add', notifCode, collectionPoint&&collectionPoint)
        	
        	dispatch(getCollectionPointDetails(id));
        	alert.success("Added Successfully")
        	dispatch({type:ADD_COLLECTION_NUMBER_OF_TRUCK_RESET})
        }
       

        return ()=>{ 
        	// const coordsData = {
		    //     room:roomCode,
		    //     author:user&&user.first_name,
		    //     message:[long, lati],
		    //     time:new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
		    //    	online:false
		    //   }

      	//  socket.emit("send_message", coordsData);	
	     socket.disconnect(); 
	    }
	    
    }, [ error, navigate, alert, isAdded, numOfTruckHistory]);







//   useEffect(() => {

//     // intervalID = setInterval(()=>{
    

//     const getCoordinates = async (position) => {

//       lati = position.coords.latitude;
//       long = position.coords.longitude;

//       const coordsData = {
//         room:roomCode,
//         author:user&&user.first_name,
//         message:[long, lati],
//         time:new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
//         online:true
//       }

//       await socket.emit("send_message", coordsData);


//      }

//      const error = async (err) => {
// 		  console.warn(`ERROR(${err.code}): ${err.message}`);
// 			}

// 			const options = {
// 			  enableHighAccuracy: true,
// 			  maximumAge: 0
// 			};



//     // if(navigator.geolocation){
//       navigator.geolocation.watchPosition(getCoordinates, error, options);
//     // }
//     // else{
//     //   alert("geolocation is not supported by this browser")
//     // }

//     // },2000)


//     const map = new mapboxgl.Map({
//       container: mapContainerRef.current,
//       style: 'mapbox://styles/justine-/cl69hr7fh000g14no1q6kdxry',
//       center: [long, lati],
//       zoom: zoom,
//     });



//     map.on('load', async () => {
//       // Get the initial location of the International Space Station (ISS).
//       const geojson = await getLocation();
//       // Add the ISS location as a source.


//       map.addSource('iss', {
//         type: 'geojson',
//         data: geojson
//       });
//       // Add the rocket symbol layer to the map.
//       map.addLayer({
//         'id': 'iss',
//         'type': 'symbol',
//         'source': 'iss',
//         'layout': {
//         // This icon is a part of the Mapbox Streets style.
//         // To view all images available in a Mapbox style, open
//         // the style in Mapbox Studio and click the "Images" tab.
//         // To add a new image to the style at runtime see
//         // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
//         'icon-image': 'logo-truck',
//         'icon-size':.08
//         }
//       });

      
       
//       // Update the source from the API every 2 seconds.
//       const updateSource = setInterval(async () => {
//         const geojson = await getLocation(updateSource);
//         map.getSource('iss').setData(geojson);
//       }, 2000);
       

      

//       async function getLocation(updateSource) {
//         // Make a GET request to the API and return the location of the ISS.
         
        
//         try {
//           // const response = await fetch(
//           //   'https://api.wheretheiss.at/v1/satellites/25544',
//           //   { method: 'GET' }
//           // );


//           // const { latitude, longitude } = await response.json();


//           // Fly the map to the location.
//           map.flyTo({
//             center: [long, lati],
//             speed: 0.5
//           });

//           // Return the location of the ISS as GeoJSON.
//           return {
//             'type': 'FeatureCollection',
//             'features': [
//             {
//             'type': 'Feature',
//             'geometry': {
//             'type': 'Point',
//             'coordinates': [long, lati]
//             }
//             }
//             ]
//           };
//         } catch (err) {
//           // If the updateSource interval is defined, clear the interval to stop updating the source.
//           if (updateSource) clearInterval(updateSource);
//           throw new Error(err);
//         }
//       }



//     });


// 				return ()=>{

// 				const coordsData = {
// 		        room:roomCode,
// 		        author:user&&user.first_name,
// 		        message:[long, lati],
// 		        time:new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
// 		        online:false
// 		      }
//       		socket.emit("send_message", coordsData);	

// 					socket.disconnect();
// 					clearInterval(intervalID);
// 				}


//   }, [id, collectionPoint]); // eslint-disable-line react-hooks/exhaustive-deps





	const collectionPointTime = (cp) => {

        const startTimeArray = cp.startTime.split(":");
		const endTimeArray = cp.endTime.split(":");
		var ampmStartTime = startTimeArray[0] >= 12 ? 'PM' : 'AM';
		var ampmEndTime = endTimeArray[0] >= 12 ? 'PM' : 'AM';
		const hoursStartTime = (startTimeArray[0] % 12) == 0 ? 12 : startTimeArray[0] % 12;
		const minutesStartTime = startTimeArray[1];
		const hoursEndTime = (endTimeArray[0] % 12) == 0 ? 12 : endTimeArray[0] % 12;
		const minutesEndTime = endTimeArray[1];
		return hoursStartTime + ":" + minutesStartTime + " " + ampmStartTime + " - " + hoursEndTime + ":" + minutesEndTime + " " + ampmEndTime;
    }

	const checkTime = (collectionPoint) => {
		const today = new Date();
		const hoursNow = today.getHours();
		const minutesNow = today.getMinutes();
		const startTimeArray = collectionPoint.startTime.split(":");
		const endTimeArray = collectionPoint.endTime.split(":");
		
		let hourNow = hoursNow;
		let minuteNow = minutesNow;
		let timeNow = ""
		if(hoursNow<10) {
			hourNow = "0"+hoursNow;
		}
		if(minutesNow<10) {
			minuteNow = "0"+minutesNow;
		}
		timeNow = hourNow+""+minuteNow;
		let checkTime = timeNow >= startTimeArray[0]+""+startTimeArray[1] && timeNow <= endTimeArray[0]+""+endTimeArray[1];

		if(checkTime) {
		
			return <p className="sched-status s-ongoing">On-going</p>;
		}
		else if(timeNow <= startTimeArray[0]+""+startTimeArray[1]) {
	
			return <p className="sched-status s-ongoing">Upcoming</p>;
		}
		else {
			return <p className="sched-status s-finished">Finished</p>;
		}
	}

	const dateNow = () => {
		let dateToday = new Date(Date.now());

		const months = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"];
		
		const month = months[dateToday.getMonth()];
		const year = dateToday.getFullYear();

		const date = month + " " + dateToday.getDate() + ", " + year;

		return date;
	}

	const addMass = (e) =>{

			e.preventDefault()

			if(numOfTruck === 0){

				alert.error("Invalid input")

			}else{
				const formData = new FormData();
				formData.set("numOfTruck", numOfTruck)
				formData.set('notifCode', notifCode);

				dispatch(addCollectionnumOfTruck(id, formData))
				setNumOfTruck(0)
			}
	}

	let TotalTons = 0

	return(
		<Fragment>
		<MetaData title={`Live Map`} />
			<div className="bh-container" onUnload={()=>{socket.disconnect()}}>
				<div>
					<SidebarCollector/>
				</div>
				<div className="bh-container-3 px-3">

					<h3 className="m-0">Collection Schedule</h3>
					<div className="row row-cols-sm-2 row-cols-1">
						<div className="col">
							<p className="m-0 fw-bold">Today</p>
						</div>
						<div className="col text-sm-end">
							<p className="m-0 fw-bold">Barangay {user && user.barangay}</p>
						</div>
						</div>
										{collectionPoint&&collectionPoint.startTime&&checkTime(collectionPoint)}
											<div className="modal-body">
												<div className="sched-map" style={{height:"fit-content"}}>
												
												<MapLive room={collectionPoint&&collectionPoint.roomCode}/>
												{/* <div style={{overflowY:"hidden", width:"100%",  height:"100%"}} className="map-container" ref={mapContainerRef} />
													   		   */}
												</div>

												<div className="row">
													<div className="col-md-6">
														<Link type="button" to={`/collector/schedule/today`} class="btn btn-success" style={{width:"30%", margin:"auto", marginTop:"24px",  marginBottom:"24px"}}><b>End Now</b></Link>
														<br/>
														<small className="fw-bold">Type:</small>
														<p>{collectionPoint.type}</p>
														<small className="fw-bold">Collection Points:</small>
														<p>{collectionPoint.collectionPoint}</p>
														<small className="fw-bold">Date:</small>
														<p>{dateNow()}</p>
														<small className="fw-bold">Time:</small>
														<p>{collectionPoint&&collectionPoint.startTime&&collectionPointTime(collectionPoint)}</p>
													</div>

													<div className="col-md-6">
														<br/>

														Enter Total Collected Waste <b><i>(Number of dump truck/s)</i></b>: 
														<div className="row">
															<div className="col-md-8">
															<input type="number" className="form-control" value={numOfTruck} onChange={(e) => setNumOfTruck(e.target.value)}/>
															<small><i>Number of dump truck/s</i></small>
															</div>
															<div className="col-md-4">
															<button type="button" disabled={addNumOfTruckLoading?"true":""} onClick={addMass} class="btn btn-success" style={{width:"100%"}}><b>Submit</b></button>
															</div>
														</div>
														<br/>
														{numOfTruckHistory&&numOfTruckHistory.map((cl)=>{
																TotalTons += cl.numOfTruck
														})

														}
														<small className="fw-bold" style={{float:"right"}}><h5>Total: <b>{TotalTons}</b></h5></small>
														
														<small className="fw-bold"><h5>Collection History ({numOfTruckHistory&&numOfTruckHistory?numOfTruckHistory.length:"0"}):</h5></small>
															<div style={{overflowY:"scroll", height:"50vh"}}>
															{numOfTruckHistory&&numOfTruckHistory.map((HistoryDetail)=>{
																	return(
																			<Fragment>
																				<div></div>
																					<div className="bh-comment">
																						<p className="fw-bold m-0">Total Number of Truck: <h4 style={{color:"red"}}><b>{HistoryDetail.numOfTruck}</b></h4></p>
																						<p className="m-0">{HistoryDetail.type}</p>
																						<small className="text-secondary float-end">{new Date(HistoryDetail&&HistoryDetail.date).toDateString()}</small>
																					</div>
																			</Fragment>
																		)	
															}).reverse()
														}
														{numOfTruckHistory&&numOfTruckHistory&&numOfTruckHistory.length <= 0 ? "No History Found":""}

															</div>
													</div>
												</div>
											</div>

							
			
				</div>
			</div>
		</Fragment>
		)
}

export default CollectorScheduleToday