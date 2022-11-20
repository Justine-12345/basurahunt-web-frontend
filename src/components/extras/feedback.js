import React, {Fragment, useEffect, useState} from 'react';
import SidebarUser from '../../components/layouts/sidebar-user';
import SidebarBarangay from '../../components/layouts/sidebar-barangay';
import SidebarCollector from '../../components/layouts/sidebar-collector';
import Sidebar from '../../components/layouts/sidebar';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { newfeedback, getFeedback, getUserFeedbacks, getFeedbacks, clearErrors} from '../../actions/feedbackActions'
import { Link} from 'react-router-dom'
import imageCompression from 'browser-image-compression';
import {NEW_FEEDBACK_RESET} from '../../constants/feedbackConstants'
import MetaData from '../../components/layouts/MetaData'

import cryptoRandomString from 'crypto-random-string';
import NotificationSender from '../../notificationSender';

const BarangayScheduleToday = () => {

	const alert = useAlert();
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth)
    const {error:newfeedbackError, loading, success, feedback:newFeedback} = useSelector(state => state.newFeedback)
    const {error:allFeddbacksError, feedbacks} = useSelector(state => state.allFeedBacks)

    const [images, setImages] = useState([])
    const [subject, setSubject] = useState('')
    const [feedback, setFeedback] = useState('')
    const [notifCode, setNotifCode] = useState('')

    useEffect(()=>{



    	if(success){
    		alert.success("Feedback submitted successfully")
    		setSubject('')
    		setFeedback('')
    		setImages([])
    		dispatch({type:NEW_FEEDBACK_RESET})
    	}

    	if(newfeedbackError){
    		alert.error(newfeedbackError)
    	}


    	if(user&&user.role !== 'administrator'){
    		dispatch(getUserFeedbacks())
    	}else{
    		dispatch(getFeedbacks())
    	}

    	

    },[success, user, newfeedbackError, feedbacks ])


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
    

    const removeOldImage = (image) => {
	    setImages(images.filter(type => type !== image))
	    alert.success("Image removed successfully")
  	};


  	const submitHandler = (e) => {
  		e.preventDefault()
  			setNotifCode(cryptoRandomString({length: 20, type: 'url-safe'}))
  			const formData = new FormData();
  			formData.set('subject',subject)
  			formData.set('feedback', feedback)
  			formData.set('notifCode', notifCode)
 			images.forEach(images => {
		      formData.append('images', images)
		    })
		    dispatch(newfeedback(formData))
			NotificationSender(`New feedback has been added`, user&&user._id, null, user&&user.barangay, 'feedback-new', notifCode, newFeedback&&newFeedback)
  	}


	return(
		<Fragment>
			<MetaData title={"Feedback"}/>
			<div className="bh-container">
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
				<div className="bh-container-3 px-3 d-grid">

					<h3 className="m-0">{user&&user.role === 'administrator'?"Feedbacks":"Feedback"}</h3>

					{user&&user.role === 'administrator'?"":
					<Fragment>
						<form onSubmit={submitHandler}>
							{images.map((image)=>(
								<Fragment key={image}>
									<a target="_blank" style={{diplay:"inline"}} href={image}><div className="crud-img" style={{diplay:"inline",backgroundImage: `url(${image})`}}></div></a>
									{loading?"":
										<i onClick={()=>(removeOldImage(image))} style={{ color:"#93d555", textShadow:"2px 2px 6px #1e5128", position:"relative", bottom:"14px", left:"-30px"}} on className="bi bi-x-circle-fill"></i>
									}
								</Fragment>
								))
							}

							{loading?"":
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
										style={{position:"relative"}}
										multiple
									/>
									
									<label htmlFor="file-upload" style={{padding:"20px", border:"5px dashed #98bf56", borderRadius:"10px", width:"100%", textAlign:"center"}}><i className="bi bi-upload"></i><br/>Upload Images</label>
								</Fragment> 
							}      

							<input disabled={loading?`${loading}`:""} className="form-control my-2" type="text" value={subject} onChange={(e)=>{setSubject(e.target.value)}} placeholder="Type Subject Here..."/>
							<textarea disabled={loading?`${loading}`:""} className="form-control" type="text" value={feedback} onChange={(e)=>{setFeedback(e.target.value)}} placeholder="Type Complaints/Feedbacks Here..."/>
							<button disabled={loading?`${loading}`:""} className="btn bh-submitBtn " type="submit">{loading?"Sending...":"Send"}</button>
							<br/>
							<br/>
							<hr/>
							

						</form>
						<h2>My Feedbacks</h2>
					</Fragment>
					}

					


						{feedbacks&&feedbacks.map((feedback)=>{
							return(
									<div className="bh-comment">
										<h4><b>{feedback.subject}</b></h4>
										<p className="m-0">{feedback.feedback}</p>

										{feedback.images.map((image)=>(
											<Fragment key={image}>
												<a target="_blank" style={{diplay:"inline"}} href={image.url}><div className="crud-img" style={{diplay:"inline",backgroundImage: `url(${image.url})`}}></div></a>
											</Fragment>
											))
										}



										<small className="text-secondary float-end"><i>Submitted by: {feedback.user_id.first_name} {feedback.user_id.last_name} ({new Date(feedback.createdAt).toDateString()})</i></small>
									</div>
								)
							})
						}	
				</div>
			</div>
		</Fragment>
		)
}

export default BarangayScheduleToday