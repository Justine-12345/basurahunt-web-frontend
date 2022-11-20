import React, { Fragment, useEffect, useState } from 'react'
import { useMemo } from "react";
import { useSelector } from 'react-redux'
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import Loading from '../layouts/LoaderNoBg';
import io from "socket.io-client";
import { SOCKET_PORT } from '../../constants/socketConstants';
const socket = io.connect(SOCKET_PORT);

const MapLiveView = ({ room}) => {

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyC1rPkNkTVtEhlY-BfUnwqlO3mLmbIGUJI",
    });

    if (!isLoaded) return <div></div>;
    return <Map room={room}/>;
}

function Map({ room }) {
    const [mapref, setMapRef] = React.useState(null);
    const [lat, setLat] = useState(undefined)
    const [lng, setLng] = useState(undefined)
    const [mapFirstLoad, setMapFirstLoad] = useState(true)
    const [mapStyle, setMapStyle] = useState("roadmap")
    const { user } = useSelector(state => state.auth)
    const center = useMemo(() => ({ lat: lat, lng: lng }), []);
    const [isOnline, setIsOnline] = useState(false)

    const handleOnLoad = map => {
        setMapRef(map);
        setLat(lat)
        setLng(lng)
    };
    useEffect(()=>{
        socket.connect()
		socket.emit("join_room", room)
    })

    useEffect(()=>{
        socket.on("receive_message", (data) => {
            console.log("data", data)
            // lati = data.message[1];
            // long = data.message[0];
            setIsOnline(data.online)
            setLat(data.message[1])
            setLng(data.message[0])
        })
        return ()=>{
            socket.disconnect()
        }
    },[socket])

    const handleCenterChanged = () => {
        if (mapref) {
            setLat(lat)
            setLng(lng)
            // console.log(lat)
        }
    };

    const centerDefault = () => {
        setMapFirstLoad(true)
    }

    return (
        <Fragment>
         {isOnline?
         <Fragment>
            <div className='row' style={{ position: "relative", top: "18px", zIndex: "1", width: "100%", margin: "auto" }}>
                <div className='col-sm-8 item' style={{ border: "0px solid black" }}>
                    <select style={{ float: "left", width: "60%", display: "inline-block", borderRadius: "2px", marginRight: "5px" }} class="form-select" value={mapStyle} onChange={(e) => setMapStyle(e.target.value)} aria-label="Default select example">
                        <option value="roadmap">Roadmap</option>
                        <option value="satellite">Satellite</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="terrain">Terrain</option>
                    </select>
                    <button style={{ float: "left", position: "relative", height: "38px", borderRadius: "2px", width: "fit-content", display: "inline-block" }} data-bs-toggle="tooltip" data-bs-placement="bottom" title="Fly to dump location" className='btn btn-light' onClick={centerDefault}><img src='https://img.icons8.com/external-flat-juicy-fish/60/000000/external-garbage-vehicles-flat-flat-juicy-fish.png' style={{ height: "30px", width: "30px", position: "relative", bottom: "2px" }} /></button>
                </div>
                <div className='col-sm-2' style={{ border: "0px solid black" }}>
                </div>
                <div className='col-sm-2' style={{ border: "0px solid black" }}>
                </div>
            </div>
            <div className='row' style={{ position: "relative", top: "-40px" }}>
                <div className='col-xl-12'>
               
                    <GoogleMap center={{ lat: lat, lng: lng }} zoom={19}
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
                    
                </div>
            </div>
            </Fragment>:<Loading/>
         }
        </Fragment>
    );
}

export default MapLiveView