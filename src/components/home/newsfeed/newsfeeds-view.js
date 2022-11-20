import React, {Fragment, useEffect, useState} from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import SidebarUser from '../../../components/layouts/sidebar-user';
import SidebarBarangay from '../../../components/layouts/sidebar-barangay';
import SidebarCollector from '../../../components/layouts/sidebar-collector';
import Sidebar from '../../../components/layouts/sidebar';
import LoaderNoBg from '../../../components/layouts/LoaderNoBg'
import MetaData from '../../../components/layouts/MetaData'

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getNewsfeedDetails, clearErrors, deleteNewsfeed } from '../../../actions/newsfeedActions'
import { DELETE_NEWSFEED_RESET } from '../../../constants/newsfeedConstants'

const Newsfeed = () => {
	const alert = useAlert();
    const dispatch = useDispatch();
    let navigate = useNavigate();

	const { error, newsfeed, loading } = useSelector(state => state.newsfeedDetails);
	const { error: deleteError, isDeleted } = useSelector(state => state.newsfeed);
	const { user } = useSelector(state => state.auth)
	let { id } = useParams();

	useEffect(() => {
		if (newsfeed && newsfeed._id !== id || isDeleted) {
			dispatch(getNewsfeedDetails(id))
		}

		if (isDeleted) {
            navigate('/admin/newsfeeds/new');
            alert.success('Newsfeed deleted successfully');
            dispatch({ type: DELETE_NEWSFEED_RESET });
        }

		if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors())
        }


        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

    }, [dispatch, isDeleted, deleteError, error, alert]);

	const formatDate = (newsfeedDate) => {
		let dateCreated = new Date(newsfeedDate);

		const months = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"];
		
		const month = months[dateCreated.getMonth()];
		const year = dateCreated.getFullYear();

		const formattedDate = month + " " + dateCreated.getDate() + ", " + year;

		return formattedDate;
	}

	const getTags = (tags) => {
		let tagLists = "";

		for (let i = 0; i < tags.length ; i++) {
	    	
			if(i !== tags.length - 1) {
				tagLists = tagLists + tags[i].tag + ", "
			}
			else {
				tagLists = tagLists + tags[i].tag
			}
	    }
		
		return tagLists;
	}

	const carouselIndicator = (images) => {
		let indcator = null;

		for (let i = 0; i < images.length ; i++) {
			if(i === 0) {
				indcator = indcator + (
					<button type="button" data-bs-target="#newsfeed-carousel" data-bs-slide-to={'"' + i + '"'} className="active" aria-current="true" aria-label={"Slide " + (i + 1)}></button>
				)
			}
			else {
				indcator = indcator + (
					<button type="button" data-bs-target="#newsfeed-carousel" data-bs-slide-to={'"' + i + '"'} aria-current="true" aria-label={"Slide " + (i + 1)}></button>
				)
			}
	    }

		return (<Fragment>{indcator}</Fragment>)
	}

	const deleteNewsfeedHandler = (id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                    <h1>Are you sure?</h1>
                    <p>You want to delete this newsfeed?</p>
                    <button onClick={onClose}>No</button>
                    <button
                        onClick={() => {
                           dispatch(deleteNewsfeed(id));
                        onClose();
                        }}
                    >
                        Yes, Delete it!
                    </button>
                    </div>
                );
            }
       });
   }

	const getImages = (images) => {
		for (let i = 0; i < images.length ; i++) {
	    	
		
	    }
	}

	let imageCount = 0
  	let imgIndicatorCount = 0

	return(
		<Fragment>
		<MetaData title={newsfeed.title} />
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
				<div className="bh-container-3">
					
					<div className="newsfeed-content">
						<div className="float-end m-0">
						{user && user.role === "administrator" && (
							<Fragment>
								<Link to={"/post/"+newsfeed._id+"/edit"} className="btn bh-submitBtn float-none">Edit</Link>
								<button onClick={() => deleteNewsfeedHandler(newsfeed._id)} className="btn bh-backBtn float-none">Delete</button>
							</Fragment>
						)}
						</div>
						<h3 className="px-3">{newsfeed.title}</h3>
						{loading?<LoaderNoBg/>:
						<Fragment>
							<p className="small m-0 px-3">Tags: <i>
								{newsfeed && newsfeed.tags && getTags(newsfeed.tags)}
							</i></p>
							
							<div id="newsfeed-carousel" className="carousel slide" data-bs-ride="true">
								
								<div className="carousel-indicators">
										{newsfeed&&newsfeed.images&&newsfeed.images.map((image)=>{
											imgIndicatorCount += 1

											return(
												<button type="button" data-bs-target="#img-carousel" data-bs-slide-to={imgIndicatorCount-1} className={imgIndicatorCount===1?"active":""} aria-current="true" aria-label={`Slide ${imgIndicatorCount}`}></button>
											)
										})

										}		

								</div>

								<div className="carousel-inner">
									{newsfeed&&newsfeed.images&&newsfeed.images.map((image)=>{
											imageCount += 1

											return(
												<div key={image.url} className={`carousel-item ${imageCount===1?"active":""}`}>
													<div className="img-carousel-item">
														<a className="image-link" target="_blank" href={image.url}><img src={image.url}/></a>
													</div>
												</div>
											)
										})

										}

								</div>
								<button className="carousel-control-prev" type="button" data-bs-target="#newsfeed-carousel" data-bs-slide="prev">
									<span className="carousel-control-prev-icon" aria-hidden="true"/>
									<span className="visually-hidden">Previous</span>
								</button>
								<button className="carousel-control-next" type="button" data-bs-target="#newsfeed-carousel" data-bs-slide="next">
									<span className="carousel-control-next-icon" aria-hidden="true"/>
									<span className="visually-hidden">Next</span>
								</button>
							</div>
							<p className="small m-0 px-3">Date Published: <strong>{formatDate(newsfeed.createdAt)}</strong></p>
							{ newsfeed && newsfeed.updatedAt !== null &&
								<p className="small m-0 px-3">Last Updated: <strong>{formatDate(newsfeed.updatedAt)}</strong></p>
							}
							{/*authors are only visible to admins*/}
							<p className="small m-0 px-3">Author: <strong>{newsfeed && newsfeed.user_id && newsfeed.user_id.first_name + " " + newsfeed.user_id.last_name}</strong></p>
							
							<p className="my-2 mx-5 fs-5">{newsfeed.content}</p>
						</Fragment>
						}

					</div>
				</div>
			</div>
		</Fragment>
		)
}

export default Newsfeed