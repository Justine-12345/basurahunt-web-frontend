import React, {useRef, Fragment, useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Sidebar from '../../../components/layouts/sidebar';

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { newItem, clearErrors } from '../../../actions/itemActions'
import { NEW_ITEM_RESET } from '../../../constants/itemConstants'
import LoaderNoBg from '../../layouts/LoaderNoBg'
import MetaData from '../../../components/layouts/MetaData'
	
import Webcam from "react-webcam"
import imageCompression from 'browser-image-compression';

const DonationsAdd = () => {
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

    const [camLoading,setCamLoading] = useState(true);
	const [addImageMode, setAddImageMode] = useState('')

	const alert = useAlert();
    const dispatch = useDispatch();
    let navigate = useNavigate()

    const { error, success, loading } = useSelector(state => state.newItem);
    const FACING_MODE_USER = "user";
	const FACING_MODE_ENVIRONMENT = "environment";

	const videoConstraints = {
	  facingMode: FACING_MODE_USER
	};

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
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (success) {
            navigate('/admin/donations');
            alert.success('Item created successfully');
            dispatch({ type: NEW_ITEM_RESET });
        }

    }, [dispatch, alert, error, success, navigate]);

    const onChange = (e) => {
        const files = Array.from(e.target.files)
        const numberOfImages = files.length+images.length
       
        if(files.length+images.length<6){
        	
	        files.forEach(async(file) => {

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
	      }else{
		  		alert.show("Maximum number(5) of images has been reached")
		  	}


    }

    const showImage = () => {

	 	if(images.length < 5){
		    imgg = webRef.current.getScreenshot();
		    setImages(oldArray => [...oldArray, imgg])
		    alert.success("Image Captured")
	  	}else{
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


	const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('addional_desciption', additionalDescription);
        formData.set('barangay_hall', barangay);
        formData.set('item_desc', itemDesc);
		formData.set('donate_using', donateUsing);
		// formData.set('status', status);

		itemTypes.forEach(itemType => {
            formData.append('item_types', itemType)
        })

		images.forEach(images => {
		      formData.append('images', images)
		})
		// console.log(additionalDescription)

        dispatch(newItem(formData))
    }

	const [fdBgColor, setFdBgColor]= useState({backgroundColor: "#808080"});
	const [clBgColor, setClBgColor]= useState({backgroundColor: "#808080"});
	const [medBgColor, setMedBgColor]= useState({backgroundColor: "#808080"});
	const [dvBgColor, setDvBgColor]= useState({backgroundColor: "#808080"});
	const [frBgColor, setFrBgColor]= useState({backgroundColor: "#808080"});
	const [otherBgColor, setOtherBgColor]= useState({backgroundColor: "#808080"});

	const [otherInput, setOtherInput]= useState({visibility:"hidden"});

	return(
		<Fragment>
		<MetaData title={`Add Donation`} />
			<div className="bh-dashboard">
				<div>
					<Sidebar/>
				</div>
				<div className="bh-dashboard-section">
					<h5 className="py-2 px-3">Add Donation</h5>

					<hr className="m-0"/>
					{loading?<LoaderNoBg/>:
					<form onSubmit={submitHandler}>
						<div className="contents">
							{/* <div className="row text-center">
								<div className="col-lg-4 col-md-12 m-auto">
									<p>Status:
										<select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
											<option value="Claimed">Claimed</option>
											<option value="Unclaimed">Unclaimed</option>
											<option value="Received">Received</option>
										</select>
									</p>
								</div>
								<div className="col-lg-4 col-md-6 m-auto">
									<p>Date Posted: <input type="date" className="form-control"/></p>
								</div>
								<div className="col-lg-4 col-md-6 m-auto">
									<p>Date Claimed: <input type="date" className="form-control"/></p>
								</div>
							</div> */}
							<p className="section mt-0">Images ({images.length}/5)</p>
							<div className="crud-images" style={{margin:"30px"}}>
								<span className="center btnTakePhoto" onClick={()=>{addImageMode!=="camera"?setAddImageMode('camera'):setAddImageMode(''); setCamLoading(true);}} style={{background:"#1e5128"}}><i className="bi bi-camera-fill"></i> Use Camera</span>&nbsp;&nbsp;
								<span className="center btnTakePhoto" onClick={()=>{addImageMode!=="upload"?setAddImageMode('upload'):setAddImageMode('')}} style={{background:"#1e5128"}}><i className="bi bi-upload"></i> Upload Images</span>

								<br/>
					            <br/>
					            {images.map((image)=>(
									<Fragment key={image}>
										<a target="_blank" style={{diplay:"inline"}} href={image}><div className="crud-img" style={{diplay:"inline",backgroundImage: `url(${image})`}}></div></a>
										<i onClick={()=>(removeOldImage(image))} style={{ color:"#93d555", textShadow:"2px 2px 6px #1e5128", position:"relative", bottom:"14px", left:"-30px"}} on className="bi bi-x-circle-fill"></i> 
									</Fragment>
								))
								}
								<br/>
					            <br/>

								{addImageMode==="upload"?
									<Fragment>
								  		<input
								  			accept="image/*"
							                type='file'
							                name='images'
							                className='custom-file-input form-control'
							                id='customFile'
							                data-buttonText="Your label here."
							                onChange={onChange}
							                id="file-upload"
							                multiple
							            />
										<label htmlFor="file-upload" style={{padding:"20px", border:"5px dashed #98bf56", width:"50vw", borderRadius:"10px", margin:"30px"}}><i className="bi bi-upload"></i><br/>Upload Images</label>
					              	</Fragment>
					            :addImageMode==="camera"?
					                <Fragment>
					            	<div className="row" style={{width:"70%", margin:"auto", position:"relative", top:"60px"}}>
					            		<i class="bi bi-arrow-repeat rotate-cam" onClick={switchCam}></i>
					            	</div>
					                <div className="row">
					                	<div className="col-xl-12 center-block">
						              	    <Webcam className="center" 
						              	    forceScreenshotSourceSize="true" 
						              	    onUserMedia={cameraLoading} 
						              	    ref={webRef} 
						              	    style={{width: !camLoading?"70%":"0px", margin:!camLoading?"24px":"0px"}}
						              	    videoConstraints={{
									          ...videoConstraints,
									          facingMode
									        }}
						              	    />
					              	    </div>  
							            {camLoading? <LoaderNoBg/>:
							            	<Fragment>
							            	<div className="row">
								            	<div className="col-xl-12" style={{height:"50px",margin:"auto"}}>
								                	<div className="center btnTakePhoto" onClick={()=>{showImage()}} style={{}}><i className="bi bi-camera-fill"></i> Capture</div>&nbsp;&nbsp;
								                	<div className="center btnTakePhoto" onClick={()=>{setAddImageMode(''); setCamLoading(true);}} style={{background:"#e33434"}}><i className="bi bi-x-circle-fill"></i> Close</div>	
								                </div>
								            </div>
							               </Fragment>
							            }
					            	</div>
					            	</Fragment>
					            	:""
					            }
					            

							</div>
							<p className="section mt-0">Location</p>
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
							<p className="section mt-0">Other Information</p>
							<p className="m-0">Type of Donation</p>
							<div className="crud-checkboxes">
								<input type="checkbox" className="btn-check" onChange={(e) => {!itemTypes.includes("Food") ? setItemTypes(oldArray => [...oldArray, e.target.value]):setItemTypes(itemTypes.filter(type => type !== e.target.value))}}  value="Food" autoComplete="on" id="food-gb"/>
                                <label className="btn btn-success crud-checkbox" style={ itemTypes.includes("Food")?{backgroundColor: "#1e5128"}: {backgroundColor: "#808080"}} htmlFor="food-gb">
									<span className="bi bi-egg-fried"/> Food</label>

								<input type="checkbox" className="btn-check" onChange={(e) => {!itemTypes.includes("Clothes") ? setItemTypes(oldArray => [...oldArray, e.target.value]):setItemTypes(itemTypes.filter(type => type !== e.target.value))}}  value="Clothes" autoComplete="on" id="clothes-gb"/>
                                <label className="btn btn-success crud-checkbox" style={ itemTypes.includes("Clothes")?{backgroundColor: "#1e5128"}: {backgroundColor: "#808080"}} htmlFor="clothes-gb">
									<span className="bi bi-tags"/> Clothes</label>	

								<input type="checkbox" className="btn-check" onChange={(e) => {!itemTypes.includes("Medical") ? setItemTypes(oldArray => [...oldArray, e.target.value]):setItemTypes(itemTypes.filter(type => type !== e.target.value))}}  value="Medical" autoComplete="on" id="medical-gb"/>
                                <label className="btn btn-success crud-checkbox" style={ itemTypes.includes("Medical")?{backgroundColor: "#1e5128"}: {backgroundColor: "#808080"}} htmlFor="medical-gb">
									<span className="bi bi-capsule"/> Medical</label>

								<input type="checkbox" className="btn-check" onChange={(e) => {!itemTypes.includes("Appliances") ? setItemTypes(oldArray => [...oldArray, e.target.value]):setItemTypes(itemTypes.filter(type => type !== e.target.value))}}  value="Appliances" autoComplete="on" id="appliances-gb"/>
                                <label className="btn btn-success crud-checkbox" style={ itemTypes.includes("Appliances")?{backgroundColor: "#1e5128"}: {backgroundColor: "#808080"}} htmlFor="appliances-gb">
									<span className="bi bi-laptop"/> Appliances</label>

								
								<input type="checkbox" className="btn-check" onChange={(e) => {!itemTypes.includes("Furnitures") ? setItemTypes(oldArray => [...oldArray, e.target.value]):setItemTypes(itemTypes.filter(type => type !== e.target.value))}}  value="Furnitures" autoComplete="on" id="furnitures-gb"/>
                                <label className="btn btn-success crud-checkbox" style={ itemTypes.includes("Furnitures")?{backgroundColor: "#1e5128"}: {backgroundColor: "#808080"}} htmlFor="furnitures-gb">
									<span className="bi bi-lamp"/> Furnitures</label>

								<input type="checkbox" className="btn-check" onChange={(e) => {!itemTypes.includes("Other") ? setItemTypes(oldArray => [...oldArray, e.target.value]):setItemTypes(itemTypes.filter(type => type !== e.target.value))}}  value="Other" autoComplete="on" id="other-gb"/>
                                <label className="btn btn-success crud-checkbox" style={ itemTypes.includes("Other")?{backgroundColor: "#1e5128"}: {backgroundColor: "#808080"}} htmlFor="other-gb">
                                    <span className="bi bi-question-circle"/> Other</label>


                                <input value={itemDesc} onChange={(e)=>{setItemDesc(e.target.value)}} className="form-control" style={itemTypes.includes("Other")?{visibility:""}:{visibility:"hidden"}}  type="text" placeholder="If other, please specify" id="item-other-specify"/>
							</div>

							<p className="m-0">Item Name</p>
							<input className="form-control" value={name} onChange={(e) => setName(e.target.value)}></input>

							<p className="m-0">Additional Details</p>
							<textarea className="form-control" value={additionalDescription} onChange={(e) => setAdditionalDescription(e.target.value)}/>
						
							<p className="m-0 fw-bold">Donated by:</p>
							<select className="form-select mb-3" value={donateUsing} onChange={(e) => setDonateUsing(e.target.value)}>
								<option>Name to be shown</option>
								<option value="Real name">Real name</option>
								<option value="Alias">Alias</option>
								<option value="Anonymous">Anonymous</option>
							</select>
						</div>
						<hr className="m-0"/>
						<button className="btn bh-submitBtn m-3" type="submit">Save Changes</button>
					</form>
					}
				</div>
			</div>
		</Fragment>
		)
}

export default DonationsAdd