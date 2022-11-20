import React, { Fragment, useEffect, useState } from 'react'
import { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";


const MapView = ({ latitude, longtitude, mapCSS, divHeight , iconLink}) => {


    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyC1rPkNkTVtEhlY-BfUnwqlO3mLmbIGUJI",
    });



    if (!isLoaded) return <div></div>;
    return <Map divHeight={divHeight} mapCSS={mapCSS} latitude={latitude} longtitude={longtitude} iconLink={iconLink} />;
}

function Map({ latitude, longtitude, mapCSS, divHeight, iconLink }) {


    const center = useMemo(() => ({ lat: latitude, lng: longtitude }), []);
    const [mapref, setMapRef] = useState(null);
    const [lat, setLat] = useState(latitude)
    const [lng, setLng] = useState(longtitude)
    const [mapStyle, setMapStyle] = useState("roadmap")

    useEffect(() => {
        setLat(latitude)
        setLng(longtitude)
    }, [])


    const handleOnLoad = map => {
        setMapRef(map);
        setLat(latitude)
        setLng(longtitude)
    };


    const handleCenterChanged = () => {

        if (mapref) {
            setLat(latitude)
            setLng(longtitude)
        }
    };

    const centerDefault = () => {
        setLat(1)
        setLng(1)
    }



    return (
        <Fragment>
            {/* position: "relative", top: "49px", zIndex: "2", */}
            <div className='row' style={{ position: "relative", top: "18px", zIndex: "1", width: "80%", marginLeft:"0px" }}>
                <div className='col-sm-8' style={{ border: "0px solid black" }}>
                    <select style={{ width: "50%", display: "inline-block", borderRadius: "2px" }} class="form-select" value={mapStyle} onChange={(e) => setMapStyle(e.target.value)} aria-label="Default select example">
                        <option value="roadmap">Roadmap</option>
                        <option value="satellite">Satellite</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="terrain">Terrain</option>
                    </select>&nbsp;
                    <button type="button" style={{ position: "relative", bottom: "2px", borderRadius: "2px", width: "fit-content", display: "inline-block" }} data-bs-toggle="tooltip" data-bs-placement="bottom" title="Fly to dump location" className='btn btn-light' onClick={centerDefault}><img src={iconLink} style={{height:"20px", width:"20px"}}/></button>

                </div>

               
            </div>
            <div className='row' style={{ position: "relative", top: "-35px", height: divHeight && divHeight }}>
                <div className='col-xl-12'>
                    {console.log("latitude", latitude)}
                    {latitude ?
                        <GoogleMap center={{ lat: lat && lat, lng: lng && lng }} zoom={20}
                            onLoad={handleOnLoad}
                            mapTypeId={mapStyle}
                            onCenterChanged={handleCenterChanged}
                            onZoomChanged={handleCenterChanged}
                            mapContainerClassName="map-container"
                            mapContainerStyle={mapCSS && mapCSS}>
                              <Marker
                                position={{ lat: lat, lng: lng }}
                                icon={{ url: iconLink, scaledSize: { width: 40, height: 40 } }}
                                draggable={false}
                                animation="DROP"
                                scaledSize={(10, 10)}
                            />
                            {/* <Marker
                                position={{ lat: lat, lng: lng }}
                                icon="https://img.icons8.com/glyph-neue/45/26ff00/marker.png"
                                draggable={false}
                            /> */}
                          
                        </GoogleMap> : ""
                    }
                </div>
            </div>

        </Fragment>
    );
}

export default MapView