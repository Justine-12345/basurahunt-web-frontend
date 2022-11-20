import React, { Fragment, useEffect, useState } from 'react'
import { useMemo } from "react";
import { useSelector } from 'react-redux'
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import io from "socket.io-client";
import { SOCKET_PORT } from '../../constants/socketConstants';
import Loading from '../layouts/LoaderNoBg';
const socket = io.connect(SOCKET_PORT);

const MapLive = ({ room }) => {

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyC1rPkNkTVtEhlY-BfUnwqlO3mLmbIGUJI",
    });

    if (!isLoaded) return <div></div>;
    return <Map room={room} />;



}

function Map({ room }) {
    const [mapref, setMapRef] = React.useState(null);
    const [lat, setLat] = useState(undefined)
    const [lng, setLng] = useState(undefined)
    const [mapRoom, setMapRoom] = useState(undefined)
    const [mapFirstLoad, setMapFirstLoad] = useState(true)
    const [mapStyle, setMapStyle] = useState("roadmap")
    const { user } = useSelector(state => state.auth)
    const center = useMemo(() => ({ lat: 14.525245, lng: 121.056464 }), []);

    const handleOnLoad = map => {
        setMapRef(map);
        setMapRoom(room)
    };

    const handleCenterChanged = () => {
        if (mapref) {
            setLat(lat)
            setLng(lng)
            setMapRoom(room)
            // console.log(lat)
        }
    };

    // async function showPosition(position) {
    //     setLat(position.coords.)
    //     setLng(position.coords.longitude)
    //     // console.log("lat", position.coords.)
    //     // console.log("lng", position.coords.longitude)
    //     console.log(mapRoom)
    //     if(mapRoom){
    //     const coordsData = {
    //         room: mapRoom && mapRoom,
    //         author: user && user.first_name,
    //         message: [position.coords.longitude, position.coords.],
    //         time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    //         online: true
    //     }

    //     await socket.emit("send_message", coordsData);
    // }
    // }





    // function getLocation() {

    //     const error = async (err) => {
    //         console.warn(`ERROR(${err.code}): ${err.message}`);
    //     }

    //     const options = {
    //         enableHighAccuracy: true,
    //         maximumAge: 0
    //     };

    //     if (navigator.geolocation) {
    //         console.log("getLocation")
    //         navigator.geolocation.watchPosition(showPosition, error, options);
    //     } else {
    //         alert("Geolocation is not supported by this browser.")
    //     }
    // }

    // function getLocationInit() {

    //     const error = async (err) => {
    //         console.warn(`ERROR(${err.code}): ${err.message}`);
    //     }

    //     const options = {
    //         enableHighAccuracy: true,
    //         maximumAge: 0
    //     };

    //     if (navigator.geolocation) {
    //         console.log("getLocationInit")
    //         navigator.geolocation.getCurrentPosition(showPosition, error, options);
    //     } else {
    //         alert("Geolocation is not supported by this browser.")
    //     }
    // }
    let navigationID
    useEffect(() => {

        async function showPosition(position) {
            setLat(position.coords.latitude)
            setLng(position.coords.longitude)
            // console.log("lat", position.coords.)
            // console.log("lng", position.coords.longitude)
            console.log("mapRoom", mapRoom)
            if (mapRoom) {
                const coordsData = {
                    room: mapRoom && mapRoom,
                    author: user && user.first_name,
                    message: [position.coords.longitude, position.coords.latitude],
                    time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
                    online: true
                }

                await socket.emit("send_message", coordsData);
            }
        }

        const error = async (err) => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        const options = {
            enableHighAccuracy: true,
            maximumAge: 0
        };



        if (navigator.geolocation) {
            navigationID = navigator.geolocation.watchPosition(showPosition, error, options);
        } else {
            alert("Geolocation is not supported by this browser.")
        }

        return () => {
            console.log("clear watch")
            const coordsData = {
                room: mapRoom && mapRoom,
                author: user && user.first_name,
                message: [lng, lat],
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
                online: false
            }

            socket.emit("send_message", coordsData);
            navigator.geolocation.clearWatch(navigationID)
        }


    }, [mapRoom, room])




    // useEffect(() => {

    //     const myInterval = setInterval(() => {


    //         if (mapFirstLoad) {
    //             setMapFirstLoad(false)
    //             return getLocationInit()
    //         } else {
    //             return getLocation()
    //         }



    //     }, 1000);
    //     return () => {
    //         clearInterval(myInterval);

    //     }
    // }, [lat, lng, mapFirstLoad, room])

    // useEffect(()=>{
    //     return () => {
    //         setMapFirstLoad(true)
    //         setLat(undefined)
    //         setLng(undefined)
    //         setMapRef(null)
    //         const coordsData = {
    //             room: room,
    //             author: user && user.first_name,
    //             message: [lng, lat],
    //             time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    //             online: false
    //         }
    //         socket.emit("send_message", coordsData);
    //     }
    // },[])



    return (
        <Fragment>
            <div className='row' style={{ position: "relative", top: "18px", zIndex: "1", width: "100%", margin: "auto" }}>
                <div className='col-sm-8 item' style={{ border: "0px solid black" }}>
                    <select style={{ float: "left", width: "60%", display: "inline-block", borderRadius: "2px", marginRight: "5px" }} class="form-select" value={mapStyle} onChange={(e) => setMapStyle(e.target.value)} aria-label="Default select example">
                        <option value="roadmap">Roadmap</option>
                        <option value="satellite">Satellite</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="terrain">Terrain</option>
                    </select>
                </div>
                <div className='col-sm-2' style={{ border: "0px solid black" }}>
                </div>
                <div className='col-sm-2' style={{ border: "0px solid black" }}>
                </div>
            </div>
            <div className='row' style={{ position: "relative", top: "-40px" }}>
                <div className='col-xl-12'>
                    {console.log("",)}
                    {!lat ? <Loading /> : <GoogleMap center={{ lat: lat, lng: lng }} zoom={19}
                        onLoad={handleOnLoad}
                        onCenterChanged={handleCenterChanged}
                        mapContainerStyle={{ height: "60vh" }}
                        // roadmap,satellite ,hybrid, terrain  
                        mapTypeId={mapStyle}
                        streetViewControl={true}
                        mapContainerClassName="map-container">
                        <Marker
                            position={{ lat: lat, lng: lng }}
                            icon={{
                                url: "https://img.icons8.com/external-flat-juicy-fish/60/000000/external-garbage-vehicles-flat-flat-juicy-fish.png",
                                scaledSize: { width: 40, height: 40 }
                            }}
                        />
                    </GoogleMap>
                    }
                </div>
            </div>

        </Fragment>
    );
}

export default MapLive