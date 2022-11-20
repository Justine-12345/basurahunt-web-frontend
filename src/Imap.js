import React, {Fragment, useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import {useNavigate, Link} from 'react-router-dom';
import { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";


const Imap = () => {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyC1rPkNkTVtEhlY-BfUnwqlO3mLmbIGUJI",
  });



  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}

function Map() {
  const [mapref, setMapRef] = React.useState(null);
    const center = useMemo(() => ({ lat: 14.525245, lng: 121.056464 }), []);
  const [lat, setLat] = useState(14.525245)
  const [lng, setLng] = useState(121.056464)
    const handleOnLoad = map => {
      setMapRef(map);
    };
    const handleCenterChanged = () => {
      if (mapref) {
        const newCenter = mapref.getCenter();
        setLat(newCenter.lat())
        setLng(newCenter.lng())
        console.log(newCenter.lat(), newCenter.lng());
      }
    };

    // useEffect(()=>{
    //   setInterval(function () {setLng(oldLng=>{setLng(oldLng+.0001)})}, 1000);

    // },[])
    const getMove = ()=>{
      setLng(oldLng=>{setLng(oldLng+.0001)})
    }

 

    return (
      <Fragment>
      <button onClick={getMove}>Move</button>
      {/* set center value to "center" if not live */}
      <GoogleMap center={{ lat: lat, lng: lng }} zoom={13}
        onLoad={handleOnLoad}
        // roadmap,satellite ,hybrid, terrain  
        mapTypeId='roadmap'
        streetViewControl={true}
        // onCenterChanged={handleCenterChanged}
        mapContainerClassName="map-container">
        <Marker position= {{ lat: lat, lng: lng }} />
      </GoogleMap>
      </Fragment>
    );
  }

export default Imap