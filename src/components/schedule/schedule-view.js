import React, {useRef, Fragment, useEffect, useState} from 'react';
import {useNavigate, useParams, useLocation} from 'react-router-dom';
import SidebarUser from '../../components/layouts/sidebar-user';
import SidebarBarangay from '../../components/layouts/sidebar-barangay';
import SidebarCollector from '../../components/layouts/sidebar-collector';
import Sidebar from '../../components/layouts/sidebar';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getCollectionPointDetails, clearErrors } from '../../actions/collectionPointActions'
import { SOCKET_PORT } from '../../constants/socketConstants'
import io from "socket.io-client";
import LoaderNoBg from '../layouts/LoaderNoBg'
import MetaData from '../../components/layouts/MetaData'

import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapLiveView from '../maps/MapLiveViewer';
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
	const { user } = useSelector(state => state.auth)
	const {id, roomCode} = useParams()
	const [room, setRoom] = useState("")
	const [liveAvailabiltyCounter, setLiveAvailabiltyCounter] = useState(false)
	 const [count, setCount] = useState(0);


	let intervalID
	


	useEffect(()=>{
    		socket.disconnect()
    		if (collectionPoint && collectionPoint._id !== id) {
	  		 	dispatch(getCollectionPointDetails(id));
  			}


				
					setRoom(collectionPoint&&collectionPoint.roomCode)
				
				
				socket.connect()
				socket.emit("join_room", collectionPoint&&collectionPoint.roomCode)



    },[collectionPoint, socket, room])



	useEffect(() => {
		    // let counter = 0
    // setTimeout(() => {
    //   setCount((count) => count + 1);
    // }, 500);

        if (collectionPoint && (collectionPoint._id !== id)) {
	  		 	 dispatch(getCollectionPointDetails(id));
  		}


        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }
       

      return ()=>{ 
    //   	socket.on("receive_message", (data) => {
    //     // console.log("data", data)
    //     setLiveAvailabiltyCounter(data.online)
    //     lati = data.message[1];
    //     long = data.message[0];
    //   })
	     socket.disconnect(); 
	    }
	    
    }, [ error, navigate, alert]);






  
//   useEffect(() => {
//       // let counter = 0
//     // setTimeout(() => {
//     //   setCount((count) => count + 1);
//     // }, 500);


//     setInterval(()=>{

//       socket.on("receive_message", (data) => {
//         console.log("data", data)
//         setLiveAvailabiltyCounter(data.online)
//         lati = data.message[1];
//         long = data.message[0];
//       })
    	
    	



//     },2000)

    

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

//     	return()=>{

//     			socket.on("receive_message", (data) => {
//         // console.log("data", data)
//         setLiveAvailabiltyCounter(data.online)
//         lati = data.message[1];
//         long = data.message[0];
//       })
    		 
// 					socket.disconnect();
// 					clearInterval(intervalID);
// 				}


//   }, [id, collectionPoint]); // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(()=>{
  	    setTimeout(() => {
      setCount((count) => count + 1);
    }, 2000);
  })


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





	return(
		<Fragment>
		<MetaData title={"Live Map"} />
			<div className="bh-container" onUnload={()=>{socket.disconnect()}}>
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

					<h3 className="m-0">Collection Schedule</h3>
					<div className="row row-cols-sm-2 row-cols-1">
						<div className="col">
							<p className="m-0 fw-bold">Today</p>
						</div>
						<div className="col text-sm-end">
							<p className="m-0 fw-bold">Barangay {user && user.barangay}</p>

						</div>
						</div>
						{/* {console.log("count",count)} */}
										{collectionPoint&&collectionPoint.startTime&&checkTime(collectionPoint)}
											<div className="modal-body">
												<div className="sched-map">
											
															{/* {!liveAvailabiltyCounter?
																<div style={{overflowY:"hidden", width:"100%",  height:"63%", background:"#9e9e9e", position:"absolute", zIndex:"2"}} className="map-container">{count>=10?<p style={{color:"#eaeaea", marginTop:"18%"}}><b>Live Map Is Not Available<br/><i class="bi bi-exclamation-triangle-fill" style={{fontSize:"50px"}}></i></b></p>:<p style={{color:"#eaeaea", marginTop:"18%"}}><b> 
																	<div className="loading-container-nobg" style={{margin:"0px", padding:"0px", background:"transparent", position:"relative", bottom:"300px", height:"object-fit"}}>
														        <div className="spinner-logo-dg spinner-border my-auto" role="status"/>
														      </div>

																 </b></p>}</div>:""
															}

													      <div style={{overflowY:"hidden", width:"100%",  height:"100%", zIndex:"0"}} className="map-container" ref={mapContainerRef} /> */}
													<MapLiveView room={room}/>
												</div>
												<small className="fw-bold">Type:</small>
												<p>{collectionPoint.type}</p>
												<small className="fw-bold">Collection Points:</small>
												<p>{collectionPoint.collectionPoint}</p>
												<small className="fw-bold">Date:</small>
												<p>{dateNow()}</p>
												<small className="fw-bold">Time:</small>
												<p>{collectionPoint&&collectionPoint.startTime&&collectionPointTime(collectionPoint)}</p>
											</div>

				</div>
			</div>
		</Fragment>
		)
}

export default CollectorScheduleToday