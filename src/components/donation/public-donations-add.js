import React, { useRef, Fragment, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import SidebarUser from '../../components/layouts/sidebar-user';

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, clearErrors } from '../../actions/itemActions'
import { ADD_ITEM_RESET } from '../../constants/itemConstants'
import LoaderNoBg from '../layouts/LoaderNoBg'
import MetaData from '../../components/layouts/MetaData'
import { confirmAlert } from 'react-confirm-alert';

import cryptoRandomString from 'crypto-random-string';
import NotificationSender from '../../notificationSender';

import Webcam from "react-webcam"
import imageCompression from 'browser-image-compression';

const PublicDonationsAdd = () => {
	const webRef = useRef(null)
	let imgg = "httpsL;';'";
	const [name, setName] = useState('');
	const [additionalDescription, setAdditionalDescription] = useState('');
	const [barangay, setBarangay] = useState('');
	const [itemTypes, setItemTypes] = useState([]);
	const [itemDesc, setItemDesc] = useState('');
	const [donateUsing, setDonateUsing] = useState('');
	const [status, setStatus] = useState('');
	const [images, setImages] = useState([]);


	const [camLoading, setCamLoading] = useState(true);
	const [addImageMode, setAddImageMode] = useState('')

	const [notifCode, setNotifCode] = useState('')

	const alert = useAlert();
	const dispatch = useDispatch();
	let navigate = useNavigate()

	const { loading, error, success, item } = useSelector(state => state.newItem);
	const { user } = useSelector(state => state.auth)

	const FACING_MODE_USER = "user";
	const FACING_MODE_ENVIRONMENT = "environment";

	const videoConstraints = {
		facingMode: FACING_MODE_USER
	};

	const NotAllowedPlatformCam = [
		"HP-UX",
		"Linux i686",
		"Linux armv7l",
		"Mac68K",
		"MacPPC",
		"MacIntel",
		"SunOS",
		"Win16",
		"Win32",
		"WebTV OS"
	]

	const [facingMode, setFacingMode] = useState(FACING_MODE_USER);

	const switchCam = () => {
		setFacingMode(
			prevState =>
				prevState === FACING_MODE_USER
					? FACING_MODE_ENVIRONMENT
					: FACING_MODE_USER
		)
	}

	useEffect(() => {

		setNotifCode(cryptoRandomString({ length: 20, type: 'url-safe' }))

		if (error) {
			alert.error(error);
			dispatch(clearErrors());
		}

		if (success) {

			NotificationSender(`New donated item has been added`, user._id, null, barangay, 'donation-new', notifCode, item && item)

			navigate('/donations');
			alert.success('Item added successfully');
			dispatch({ type: ADD_ITEM_RESET });
		}

	}, [dispatch, alert, error, success, navigate]);

	const submitHandler = (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.set('name', name);
		formData.set('addional_desciption', additionalDescription);
		formData.set('barangay_hall', barangay);
		formData.set('item_desc', itemDesc);
		formData.set('donate_using', donateUsing);
		// formData.set('status', status);
		formData.set('notifCode', notifCode);

		itemTypes.forEach(itemType => {
			formData.append('item_types', itemType)
		})

		images.forEach(images => {
			formData.append('images', images)
		})

		// console.log(additionalDescription)

		dispatch(addItem(formData))
	}

	const [fdBgColor, setFdBgColor] = useState({ backgroundColor: "#808080" });
	const [clBgColor, setClBgColor] = useState({ backgroundColor: "#808080" });
	const [medBgColor, setMedBgColor] = useState({ backgroundColor: "#808080" });
	const [dvBgColor, setDvBgColor] = useState({ backgroundColor: "#808080" });
	const [frBgColor, setFrBgColor] = useState({ backgroundColor: "#808080" });
	const [otherBgColor, setOtherBgColor] = useState({ backgroundColor: "#808080" });
	const [otherInput, setOtherInput] = useState({ visibility: "hidden" });

	const onChange = (e) => {
		const files = Array.from(e.target.files)
		const numberOfImages = files.length + images.length

		if (files.length + images.length < 6) {

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

		if (images.length < 5) {
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

	const removeOldImage = (image) => {
		setImages(images.filter(type => type !== image))
		alert.success("Image removed successfully")
	};

	
	const typeOfDonationInfo = () => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className='custom-ui-info'>
						<span onClick={onClose} style={{float:'right', position:'fixed', right:"14vw"}}><i class="bi bi-x-circle-fill" style={{fontSize:"30px"}}></i></span>
						<h2 id="types">Types of Donation</h2>
						<ol className="fs-5 mx-xl-5">
							<li><strong>Food</strong>
								<ul>Users can donate that can help Taguig residents that experiencing insufficient food or can't eat meals three times a day. <i>Examples: canned goods, instant noodles</i></ul>
							</li>
							<li><strong>Clothes</strong>
								<ul>Users can donate their used or brand-new clothes to the Taguig residents who lack clothes for everyday use. <i>Examples: shirt, pants, shorts</i></ul>
							</li>
							<li><strong>Medical</strong>
								<ul>Users especially the medical personnel can give medical supplies that can improve the people’s body resistance to the illness that are contagious such as colds, flu, and coughs, and for a remedy for a specific disease. <i>Examples: medicines, vitamins</i></ul>
							</li>
							<li><strong>Devices</strong>
								<ul>Users can give their used or excess devices that can help Taguig residents that don’t have a device for particular purposes such as education and work. <i>Examples: cellphone, tablet, laptop</i></ul>
							</li>
							<li><strong>Furniture</strong>
								<ul>Users can donate their used or excess furniture/s from their houses to help those people who don’t have furniture and can’t afford to buy new furniture/s. <i>Examples: refrigirator, couches, tables</i></ul>
							</li>
						</ol>
					</div>
				);
			}
		});
	}

	const donatedByInfo = () => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className='custom-ui-info'>
						<span onClick={onClose} style={{float:'right', position:'fixed', right:"14vw"}}><i class="bi bi-x-circle-fill" style={{fontSize:"30px"}}></i></span>
						<h2 id="name">Shown Name</h2>
						<ol className="fs-5 mx-xl-5">
							<li><strong>Real Name</strong>
								<ul>The user's name will be prompted or displayed in the information of reported illegal dumpsand donation. Admins, employees, and users can view or glimpse the name of the reporting user and donator.</ul>
							</li>
							<li><strong>Alias/Nickname</strong>
								<ul>The user's enlisted nickname or alias will be prompted or displayed in the information of reported illegal dumps and donation. Admins, employees, and users can view or glimpse the registered alias or nickname of the reporting user and donator.</ul>
							</li>
							<li><strong>Anonymous</strong>
								<ul>The user's name or nickname will not be prompted or displayed in the information of reported illegal dumps and donation. “Anonymous” will be the one that will be displayed on the information of the reported illegal dumps and donation. Admins, employees, and users can only see the “anonymous” to the reporting user or donator.</ul>
							</li>
						</ol>
					</div>
				);
			}
		});
	}

	return (
		<Fragment>
			{/* {console.log("Platform",navigator.platform)} */}
			<MetaData title={"Donate"} />
			<div className="bh-container">
				<div>
					<SidebarUser />
				</div>
				<div className="bh-container-3 px-3">
					<h3>Donate Items</h3>
					{loading ? <LoaderNoBg /> :
						<form onSubmit={submitHandler}>
							<div className="stepper">
								<div className="d-flex mb-1">
									<div className="d-flex flex-column pe-4 align-items-center">
										<div className="circle rounded-circle py-2 px-3 mb-1">
											1
										</div>
										<div className="line h-100"></div>
									</div>
									<div className="w-100">
										<h3>Images</h3>
										<div>
											<div className="text-md-start text-center row">

												<div className="col-xl-2">
													<span className="btn bh-submitBtn float-none" onClick={() => { addImageMode !== "upload" ? setAddImageMode('upload') : setAddImageMode('') }}>Upload Image</span>
												</div>
												{NotAllowedPlatformCam.includes(navigator.platform) ?"":
													<Fragment>
														<div className="col-xl-1" style={{ paddingTop: "10px", paddingLeft: "20px" }}>
															<span className=" fw-bold" >or</span>
														</div>

														<div className="col-xl-2">
															<span className="btn bh-submitBtn float-none" onClick={() => { addImageMode !== "camera" ? setAddImageMode('camera') : setAddImageMode(''); setCamLoading(true); }}>Capture Image</span>
														</div>
													</Fragment>
												}
											</div>

											{addImageMode === "upload" ?
												<Fragment>
													<input
														accept="image/*"
														type='file'
														name='images'
														className='custom-file-input form-control'
														data-buttonText="Your label here."
														onChange={onChange}
														id="file-upload"
														multiple
													/>
													<label htmlFor="file-upload" style={{ padding: "20px", border: "5px dashed #98bf56", width: "50vw", borderRadius: "10px", margin: "30px", textAlign: "center" }}><i className="bi bi-upload"></i><br />Upload Images</label>
												</Fragment>
												: addImageMode === "camera" ?
													<Fragment>
														<div className="row" style={{ width: "70%", marginLeft: "24px", position: "relative", top: "60px" }}>
															<i class="bi bi-arrow-repeat rotate-cam" onClick={switchCam}></i>
														</div>
														<div className="row">
															<div className="col-xl-12 center-block">
																<Webcam
																	className="center"
																	forceScreenshotSourceSize="true"
																	onUserMedia={cameraLoading}
																	ref={webRef}
																	style={{ width: !camLoading ? "70%" : "0px", margin: !camLoading ? "24px" : "0px" }}
																	videoConstraints={{
																		...videoConstraints,
																		facingMode
																	}}
																/>
															</div>
														</div>

														{camLoading ? <LoaderNoBg /> :
															<Fragment>
																<div className="row" style={{ width: "70%", marginLeft: "24px" }}>
																	<div className="col-sm-6" style={{ height: "100px", margin: "auto" }}>
																		<div style={{ width: "fit-content", margin: "auto" }}>
																			<div className="center btnTakePhoto" onClick={() => { showImage() }}><i className="bi bi-camera-fill"></i> Capture</div>&nbsp;&nbsp;
																			<div className="center btnTakePhoto" onClick={() => { setAddImageMode(''); setCamLoading(true); }} style={{ background: "#e33434" }}><i className="bi bi-x-circle-fill"></i> Close</div>
																		</div>
																	</div>
																</div>
															</Fragment>
														}


													</Fragment>
													: ""
											}


											<div className="stepper-images">


												{images.map((image) => (
													<Fragment key={image}>
														<a target="_blank" style={{ diplay: "inline" }} href={image}><div className="crud-img" style={{ diplay: "inline", backgroundImage: `url(${image})` }}></div></a>
														<i onClick={() => (removeOldImage(image))} style={{ color: "#93d555", textShadow: "2px 2px 6px #1e5128", position: "relative", bottom: "14px", left: "-30px" }} on className="bi bi-x-circle-fill"></i>
													</Fragment>
												))
												}


											</div>
										</div>
									</div>
								</div>
								{/*-----------------*/}
								<div className="d-flex mb-1">
									<div className="d-flex flex-column pe-4 align-items-center">
										<div className="circle rounded-circle py-2 px-3 mb-1">
											2
										</div>
										<div className="line h-100"></div>
									</div>
									<div className="w-100 mb-3">
										<h3>Location</h3>
										<div>
											<p className="fw-bold m-0">Barangay Hall</p>
											<i>(To ensure the security of both parties, the meetup location for donation should only be in the Barangay Hall of one of the involved parties. )</i>
											<select className="form-control mb-2" value={barangay} onChange={(e) => setBarangay(e.target.value)}>
												<option>Select...</option>
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
										</div>
									</div>
								</div>
								{/*-----------------*/}
								<div className="d-flex mb-1">
									<div className="d-flex flex-column pe-4 align-items-center">
										<div className="circle rounded-circle py-2 px-3 mb-1">
											3
										</div>
										<div className="line h-100"></div>
									</div>
									<div className="w-100">
										<h3>Other Information</h3>
										<div>
											<p className="m-0">Type of Donation <i onClick={typeOfDonationInfo} class="bi bi-question-circle questionMark"></i></p>
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

											<p className="m-0">Item Name</p>
											<input className="form-control" value={name} onChange={(e) => setName(e.target.value)}></input>

											<p className="m-0">Additional Details</p>
											<textarea className="form-control" value={additionalDescription} onChange={(e) => setAdditionalDescription(e.target.value)} />

											<p className="m-0 fw-bold">Donated by: <i onClick={donatedByInfo} class="bi bi-question-circle questionMark"></i></p>
											<select className="form-select mb-3" value={donateUsing} onChange={(e) => setDonateUsing(e.target.value)}>
												<option>Name to be shown</option>
												<option value="Real name">Real name</option>
												<option value="Alias">Alias</option>
												<option value="Anonymous">Anonymous</option>
											</select>
										</div>
									</div>
								</div>
								{/*-----------------*/}
								<div className="d-flex mb-1">
									<div className="d-flex flex-column pe-4 align-items-center">
										<div className="circle rounded-circle py-2 px-3 mb-1">
											4
										</div>
										<div className="line h-100 d-none"></div>
									</div>
									<div className="w-100">
										<button type="submit" className="m-0 btn bh-submitBtn float-none">Submit Donation</button>
									</div>
								</div>
								{/*-----------------*/}
							</div>
						</form>
					}
				</div>
			</div>
		</Fragment>
	)
}

export default PublicDonationsAdd