import React, { Fragment, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { SET_COORDINATE } from '../../constants/mapConstants';

const MapFinder = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyC1rPkNkTVtEhlY-BfUnwqlO3mLmbIGUJI",
    });



    if (!isLoaded) return <div></div>;
    return <Map />;
}

function Map() {
    const [mapref, setMapRef] = React.useState(null);
    const center = useMemo(() => ({ lat: 14.525245, lng: 121.056464 }), []);
    const [lat, setLat] = useState(14.52524)
    const [lng, setLng] = useState(121.056464)
    const [latUser, setLatUser] = useState(0)
    const [lngUser, setLngUser] = useState(0)
    const [mapStyle, setMapStyle] = useState("roadmap")

    let dispatch = useDispatch()

    function showPosition(position) {
        setLat(position.coords.latitude)
        setLng(position.coords.longitude)
        setLatUser(position.coords.latitude)
        setLngUser(position.coords.longitude)
        const data = {latitude:position.coords.latitude, longitude:position.coords.longitude}
            
        dispatch({
            type: SET_COORDINATE,
            payload:data
        })
    }

    function getLocation() {
        const error = async (err) => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        const options = {
            enableHighAccuracy: true,
            maximumAge: 0
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, error, options);
        } else {
            alert("Geolocation is not supported by this browser.")
        }
    }

    
    function showPositionUser(position) {
        setLatUser(position.coords.latitude)
        setLngUser(position.coords.longitude)
    }

    function getLocationUser() {
        const error = async (err) => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        const options = {
            enableHighAccuracy: true,
            maximumAge: 0
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPositionUser, error, options);
        } else {
            alert("Geolocation is not supported by this browser.")
        }
    }


    const handleOnLoad = map => {
        getLocation()
        setMapRef(map);
    };

    const handleCenterChanged = () => {
        if (mapref) {
            const newCenter = mapref.getCenter();
            setLat(newCenter.lat())
            setLng(newCenter.lng())

            // console.log(newCenter.lat(), newCenter.lng());
            const data = {latitude:newCenter.lat()?newCenter.lat():lat, longitude:newCenter.lng()?newCenter.lng():lng}
            
            dispatch({
                type: SET_COORDINATE,
                payload:data
            })
        }
    };

    return (
        <Fragment>
            <div style={{ border: "0px solid black" }}>
                <div className='row' style={{ width: "100%" }}>
                    <div className='col-sm-8' style={{ border: "0px solid black", position:"relative", top:"100px", zIndex:"1", left:"12px"}}>
                        <select style={{ width: "50%", display: "inline-block", borderRadius: "2px" }} class="form-select" value={mapStyle} onChange={(e)=>setMapStyle(e.target.value)} aria-label="Default select example">
                            <option value="roadmap">Roadmap</option>
                            <option value="satellite">Satellite</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="terrain">Terrain</option>
                        </select>&nbsp;
                        <button type='button' style={{ position: "relative", height:"38px", bottom: "2px", borderRadius: "2px", width: "fit-content", display: "inline-block" }} data-bs-toggle="tooltip" data-bs-placement="bottom" title="Fly to user location" className='btn btn-light' onClick={getLocation}><img style={{height:"23px", width:"23px"}} src="/images/location.png"/></button>&nbsp;
                    </div>


                    <div className='col-sm-12'>
                        <div style={{ border: "0px solid black", zIndex: "1", position: "relative", top: "50vh" }}>
                            <div style={{ width: "fit-content", border: "0px solid black", margin: "auto" }}>
                                <img src='https://img.icons8.com/glyph-neue/45/26ff00/marker.png' />
                            </div>
                        </div>

                        <div>

                            <GoogleMap center={{ lat: lat, lng: lng }} zoom={20}
                                onLoad={handleOnLoad}
                                mapTypeId={mapStyle}
                                onDragEnd={handleCenterChanged}
                                options={{
                                    fullscreenControl: false
                                }}
                                mapContainerClassName="map-container">
                                <Marker
                                    position={{ lat: latUser, lng: lngUser }}
                                    icon={{url:"/images/location.png", scaledSize: { width: 40, height: 40 }}}
                                    draggable={false}
                                    animation="DROP"
                                    scaledSize={(10,10)}
                                />
                                {/* <Marker
                                    position={{ lat: lat, lng: lng }}
                                    icon="https://img.icons8.com/glyph-neue/45/FF0000/marker.png"
                                    draggable={false}
                                    animation="DROP"
                                /> */}
                            </GoogleMap>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default MapFinder