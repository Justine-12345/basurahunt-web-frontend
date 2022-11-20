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

import MapView from '../../maps/MapView';

import '../../../Map.css';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import 'mapbox-gl/dist/mapbox-gl.css'
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

mapboxgl.accessToken =
    'pk.eyJ1IjoianVzdGluZS0iLCJhIjoiY2wzZnl6NHJsMDRudjNmbHZvOGgwNGx4bSJ9.mwFsZ1bz00QuUmMr_MMOxg';



const socket = io.connect(SOCKET_PORT);

const ReportsConfirm = () => {
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
        console.log(dump && dump.status )
        if((dump && dump.status !== "newReport") &&( dump && dump.status !== undefined)){
            navigate(-1)
        }

        if (isUpdatedStatus) {
            dispatch({ type: UPDATE_DUMP_STATUS_RESET })
        }


    }, [dump, loading, updateError, isUpdated, error])

    // useEffect(() => {
    //     // let counter = 0

    //     const map = new mapboxgl.Map({
    //         container: mapContainerRef.current,
    //         style: 'mapbox://styles/justine-/cl3g09pgu000714l6jzlyn2mm',
    //         center: [longtitude === '' ? long : longtitude, latitude === '' ? lati : latitude],
    //         zoom: zoom,
    //         interactive: interactiveMap
    //     });


    //     // Add navigation control (the +/- zoom buttons)
    //     map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    //     map.on('move', () => {
    //         setLng(map.getCenter().lng.toFixed(4));
    //         setLat(map.getCenter().lat.toFixed(4));
    //         setZoom(map.getZoom().toFixed(2));
    //     });

    //     map.addControl(
    //         new mapboxgl.GeolocateControl({
    //             positionOptions: {
    //                 enableHighAccuracy: true,
    //             },
    //             // When active the map will receive updates to the device's location as it changes.
    //             trackUserLocation: false,
    //             // Draw an arrow next to the location dot to indicate which direction the device is heading.
    //             showUserHeading: true,

    //         })
    //     );

    //     //Dragabble marker
    //     const coordinates = document.getElementById('coordinates');
    //     const marker = new mapboxgl.Marker({
    //         draggable: false
    //     })
    //         .setLngLat([121.050865, 14.517618])
    //         .addTo(map);

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
    //     map.setStyle('mapbox://styles/mapbox/streets-v11');
    //     input.onchange = (layer) => {
    //         const layerId = layer.target.value;
    //         map.setStyle('mapbox://styles/mapbox/' + layerId);
    //     };

        
    //     // Clean up on unmount
    //     return () => map.remove();


    // }, [interactiveMap]); // eslint-disable-line react-hooks/exhaustive-deps


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

        if(collectors2.length <= 0){
            alert.error("Please select collector/s")
        }
        else if(category_violation === ''||category_violation === undefined){
            alert.error("Please Enter Category Of Violation")
        }
        else if(waste_size === ''||waste_size=== undefined){
            alert.error("Please Enter Waste Size")
        }
        else if(accessible_by === ''|| accessible_by === undefined){
            alert.error("Please Enter Value For Accessible By")
        }else{

        
        const formData = new FormData();

        formData.set("status", status);
        formData.set("latitude", latitude);
        formData.set("longtitude", longtitude);
        formData.set("complete_address", complete_address);
        formData.set("landmark", landmark);
        formData.set("barangay", barangay);
        if (waste_type.includes("Other")) {
            formData.set("waste_desc", waste_desc);
        } else {
            formData.set("waste_desc", "");
        }

        formData.set("waste_size", waste_size);
        formData.set("status", "Confirmed");
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
    }
    let imageCount = 0
    let imgIndicatorCount = 0
    let c = 0
    return (
        <Fragment>
            <MetaData title={`${dump && dump.complete_address}`} />
            <div className="bh-dashboard">
                <div>
                    <Sidebar />
                </div>
                <div className="bh-dashboard-section">
                    <h5 className="py-2 px-3">
                    <h3 className="m-0" style={{fontWeight:"600", float:"right"}}>Status: <span style={{fontWeight:"400"}}>{status === "newReport" ? "New Report" : status}</span></h3> 
            
                        Confirm Illegal Dump Report <i className="crud-id fw-light small user-select-all">({dump && dump._id})</i></h5>
                    <hr className="m-0" />
                    <div className='row' style={{ width: "100%", margin: "auto" }}>
                        <div className='col-xl-7'>
                            <div className='row' style={{ width: "100%", margin: "auto" }}>
                          
                            <div className='col-xl-8'>
                                        {/* <select className="form-select" style={{ width: "150px", position: "relative", fontSize:"12px", top: "10px", left: "15px", zIndex: "1000" }} aria-label="Default select example" id="MapTypesSelect" >
                                            <option id="streets-v11" type="radio" name="rtoggle1" value="streets-v11">Streets</option>
                                            <option id="satellite-v9" type="radio" name="rtoggle1" value="satellite-v9">Satellite</option>
                                            <option id="light-v10" type="radio" name="rtoggle1" value="light-v10">Light</option>
                                            <option id="dark-v10" type="radio" name="rtoggle1" value="dark-v10">Dark</option>
                                            <option id="outdoors-v11" type="radio" name="rtoggle1" value="outdoors-v11">Outdoors</option>
                                        </select>
                                    <div style={{ marginTop:"5px", overflowY: "hidden", width: "100%", height: "20em", position:"relative", bottom:"33px" }} className="map-container" ref={mapContainerRef} />
                                    <pre id="coordinates" className="coordinates" style={{ zIndex: "0", visibility: "hidden", height: "0px" }}></pre> */}
                                    <MapView mapCSS={{ height: "20em" }}  divHeight={"20em"} latitude={dump && dump.coordinates && dump.coordinates.latitude} longtitude={dump && dump.coordinates && dump.coordinates.longtitude}  iconLink={"/images/trash.png"} />
                                </div>

                                <div className="col-xl-4 my-1" style={{ zIndex: "0" }}>
                                    <div id="img-carousel" className="carousel slide" data-bs-ride="true">
                                        <div className="carousel-indicators" >

                                            {dump && dump.images && dump.images.map((image) => {
                                                imgIndicatorCount += 1

                                                return (
                                                    <button type="button" data-bs-target="#img-carousel" data-bs-slide-to={imgIndicatorCount - 1} className={imgIndicatorCount === 1 ? "active" : ""} aria-current="true" aria-label={`Slide ${imgIndicatorCount}`}></button>
                                                )
                                            })

                                            }

                                        </div>
                                        <div className="carousel-inner" >
                                            {dump && dump.images && dump.images.map((image) => {
                                                imageCount += 1

                                                return (
                                                    <div key={image.url} className={`carousel-item ${imageCount === 1 ? "active" : ""}`}>
                                                        <div className="img-carousel-item">
                                                            <a className="image-link" target="_blank" href={image.url}><img src={image.url} /></a>
                                                        </div>
                                                    </div>
                                                )
                                            })

                                            }

                                        </div>
                                        <button className="carousel-control-prev" type="button" data-bs-target="#img-carousel" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true" />
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#img-carousel" data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true" />
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                                

                            <div className='row' style={{ width: "100%", margin: "auto" }}>
                                <div className='col-xl-6'>
                                    <p className="m-0" style={{fontWeight:"600"}}>Exact Location: <span style={{fontWeight:"400"}}>{complete_address}</span></p>
                                    <p className="m-0" style={{fontWeight:"600"}}>Landmark: <span style={{fontWeight:"400"}}>{landmark}</span></p>
                                    <p className="m-0" style={{fontWeight:"600"}}>Barangay: <span style={{fontWeight:"400"}}>{barangay}</span></p>
                                    <span className="m-0" style={{fontWeight:"600"}}>Type of Waste:
                                    <span style={{fontWeight:"400"}}>
                                        <ul>
                                            {dump&&dump.waste_type&&dump.waste_type.map((wt) => {
                                                c += 1
                                                return (
                                                <li key={wt.type + c}>{wt.type}</li>
                                                )
                                            })
                                            }
                                        </ul>
                                    </span>
                                    </span>
                                </div>
                                <div className='col-xl-6'>
                                    <p className="m-0" style={{fontWeight:"600"}}>Additional Information: <span style={{fontWeight:"400"}}>{additional_desciption}</span></p>
                                    <p className="m-0" style={{fontWeight:"600"}}>Reported By: <span style={{fontWeight:"400"}}>{additional_desciption} {dump && dump.user_id && dump.user_id.first_name} {dump && dump.user_id && dump.user_id.last_name}<i>({dump && dump.user_id && dump.user_id.alias})</i> from {dump && dump.user_id && dump.user_id.barangay}</span></p>
                                   
                                </div>
                            </div>

                        </div>
                        <div className='col-xl-5' style={{ borderLeft: "1px solid lightGray" }}>
                        {updateLoading?<LoaderNoBg/>:
                            <form onSubmit={submitHandler}>
                            <p className="m-0">Collectors</p>
                                <div>
                                        <Select
                                            onChange={(val) => { setCollectors2(val) }}
                                            value={collectors2}
                                            isMulti
                                            options={collectors}
                                        />
                                </div>

                            {console.log(collectors)}
                                
                            <p className="m-0">Category of Violation</p>
                                    <select value={category_violation} onChange={(e) => { setCategory_violation(e.target.value) }} className="form-select">
                                        <option value=""></option>
                                        <option value="Littering, Illegal dumping, Illegal disposal of garbage">Littering, Illegal dumping, Illegal disposal of garbage</option>
                                        <option value="Dirty frontage and immediate surroundings for establisments owners">Dirty frontage and immediate surroundings for establisments owners</option>
                                        <option value="Improper and untimely stacking of garbage outside residence or establishment">Improper and untimely stacking of garbage outside residence or establishment</option>
                                        <option value="Obstruction">Obstruction</option>
                                        <option value="Other">Other</option>
                                    </select>

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
                                            <br/>
                                            <br/>
                                            <br/>
                                            
                                            <button style={{margin:"auto"}} className="btn bh-submitBtn m-3" type="submit">Save To Confirm</button>
                                            </form>
                        }
                        </div>
                    </div>

                </div>
            </div>
        </Fragment>
    )
}

export default ReportsConfirm