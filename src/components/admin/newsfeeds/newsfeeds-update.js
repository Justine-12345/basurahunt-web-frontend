import React, {Fragment, useEffect, useState} from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import SidebarUser from '../../../components/layouts/sidebar-user';
import SidebarBarangay from '../../../components/layouts/sidebar-barangay';
import SidebarCollector from '../../../components/layouts/sidebar-collector';
import Sidebar from '../../../components/layouts/sidebar';
import LoaderNoBg from '../../layouts/LoaderNoBg'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';
import imageCompression from 'browser-image-compression';
import MetaData from '../../../components/layouts/MetaData'
	
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getNewsfeeds, getNewsfeedDetails, clearErrors, updateNewsfeed } from '../../../actions/newsfeedActions'
import { UPDATE_NEWSFEED_RESET } from '../../../constants/newsfeedConstants'

const NewsfeedsUpdate = () => {
	const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [tagsList, setTagsList] = useState([]);
	const alert = useAlert();
    const dispatch = useDispatch();
    let navigate = useNavigate();
	const { error, newsfeed, tags:allTags } = useSelector(state => state.newsfeedDetails);
	const { error: newsfeedsError, newsfeeds } = useSelector(state => state.newsfeeds);
	const { error: updateError, isUpdated, loading } = useSelector(state => state.newsfeed);
	const { user } = useSelector(state => state.auth)
	
	let { id } = useParams();

	useEffect(() => {
		dispatch(getNewsfeeds());

		if (newsfeed && newsfeed._id !== id || isUpdated) {
            dispatch(getNewsfeedDetails(id));
			setTags([]);
			setImages([]);
			setTagsList([])
        } else {
			setTags([]);
            setTitle(newsfeed.title);
            setContent(newsfeed.content);
            setTagsList(allTags)
        }
		
		newsfeed && newsfeed.tags && newsfeed.tags.forEach(tag => {
			console.log(tag._id === undefined)
			if(tag._id !== undefined){
				setTags(oldArray => [...oldArray, {value: tag.tag, label: tag.tag}])
			}
			 
		})

		newsfeed && newsfeed.images && newsfeed.images.forEach(image => {
				setOldImages(oldArray => [...oldArray, image.url])
		})

		if (isUpdated) {
            navigate('/admin/newsfeeds/new');
            alert.success('Newsfeed updated successfully');
            dispatch({ type: UPDATE_NEWSFEED_RESET });
        }

		if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors())
        }

		if (newsfeedsError) {
            alert.error(newsfeedsError);
            dispatch(clearErrors())
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

    }, [dispatch, newsfeed, isUpdated, updateError, newsfeedsError, error, alert, navigate]);

	const formatDate = (newsfeedDate) => {
		let dateCreated = new Date(newsfeedDate);

		const months = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"];
		
		const month = months[dateCreated.getMonth()];
		const year = dateCreated.getFullYear();

		const formattedDate = month + " " + dateCreated.getDate() + ", " + year;

		return formattedDate;
	}

	const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('title', title);
        formData.set('content', content);

		tags.forEach(tag => {
            formData.append('tags', tag.value)
        })

         images.forEach(images => {
		    formData.append('images', images)
		})


        dispatch(updateNewsfeed(newsfeed._id, formData))
    }

	// const tagList = (newsfeeds) => {
	// 	let tagList = []
	// 	let filterList = []

	// 	newsfeeds.forEach(newsfeed => {
	// 		newsfeed.tags.forEach(tag => {
	// 			// console.log(tagList)
	// 			// filterList.push(tag.tag)
	// 			// if(filterList.includes(tag.tag)) {
	// 				tagList.push({"value": "tag.tag", "label": "tag.tag"})
	// 			// }
	// 		})
	// 	})

	// 	return tagList
	// }

	

	// const tagsList = [
	// 	{ value: '1', label: 'announcements' },
	// 	{ value: '2', label: 'event' },
	// 	{ value: '3', label: 'news' },
	// ]


	const onChange = e => {
        const files = Array.from(e.target.files)

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
	
    }

	let imageCount = 0
  	let imgIndicatorCount = 0

  	let oldImageCount = 0
  	let oldImgIndicatorCount = 0


    const revertImages = e =>{
    	e.preventDefault()
    	setImages([])
    	setOldImages([])
    	imageCount = 0
	  	imgIndicatorCount = 0

	  	oldImageCount = 0
	  	oldImgIndicatorCount = 0
    	newsfeed && newsfeed.images && newsfeed.images.forEach(image => {
				setOldImages(oldArray => [...oldArray, image.url])
		})
    }

	return(
		<Fragment>
		<MetaData title={`${newsfeed.title}`} />
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
						<form onSubmit={submitHandler}>
							<div className="float-end m-0">
								<Link to={"/post/" + newsfeed._id} className="btn bh-backBtn float-none">Cancel</Link>
								<button type="submit" className="btn bh-submitBtn float-none">Save Changes</button>
							</div>
							<textarea className="form-control fs-3 px-3" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Type Title Here..."/>
							<p className="select-multi small my-3 px-3">Tags:</p>
								<CreatableSelect
									className="m-3" 
									placeholder="Type Tags Here..."
									onChange={(val)=>{setTags(val)}}
									value={tags}
									isMulti
									options={tagsList}
								/>
								{images&&images.length<=0?
									<div id="newsfeed-carousel" className="carousel slide" data-bs-ride="true">
									<div className="carousel-indicators">
										{oldImages&&oldImages.map((image)=>{
											oldImgIndicatorCount += 1

											return(
												<button type="button" data-bs-target="#img-carousel" data-bs-slide-to={oldImgIndicatorCount-1} className={oldImgIndicatorCount===1?"active":""} aria-current="true" aria-label={`Slide ${oldImgIndicatorCount}`}></button>
											)
										})

										}		
									</div>
									<div className="carousel-inner">
										{oldImages&&oldImages.map((image)=>{
											oldImageCount += 1

											return(
												<div key={oldImageCount} className={`carousel-item ${oldImageCount===1?"active":""}`}>
													<div className="img-carousel-item">
														<img src={image}/>
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
								</div>:

									<div id="newsfeed-carousel" className="carousel slide" data-bs-ride="true">
									<div className="carousel-indicators">
										{images&&images.map((image)=>{
											imgIndicatorCount += 1

											return(
												<button type="button" data-bs-target="#img-carousel" data-bs-slide-to={imgIndicatorCount-1} className={imgIndicatorCount===1?"active":""} aria-current="true" aria-label={`Slide ${imgIndicatorCount}`}></button>
											)
										})

										}		
									</div>
									<div className="carousel-inner">
										{images&&images.map((image)=>{
											imageCount += 1

											return(
												<div key={imageCount} className={`carousel-item ${imageCount===1?"active":""}`}>
													<div className="img-carousel-item">
														<img src={image}/>
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


								}
							




									<input
									className="form-control"
									type="file"
									accept="image/*"
									onChange={onChange}
	                                multiple
									/>
							

									<button onClick={revertImages} disabled={images&&images.length <= 0?"true":""} className="btn btn-success">Revert Old Images</button>


							<p className="small m-0 px-3">Date Published: <strong>{formatDate(newsfeed.createdAt)}</strong></p>
							{ newsfeed && newsfeed.updatedAt !== null &&
								<p className="small m-0 px-3">Last Updated: <strong>{newsfeed.updatedAt}</strong></p>
							}
							{/*author/s are only visible to admins*/}
							<p className="small m-0 px-3">Author: <strong>{newsfeed && newsfeed.user_id && newsfeed.user_id.first_name + " " + newsfeed.user_id.last_name}</strong> ({newsfeed && newsfeed.user_id && newsfeed.user_id._id})</p>
							
							<textarea className="newsfeed-content-textarea form-control fs-5 px-5" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Type Content Here..."/>
						
						</form>	
					</div>
				</div>
			</div>
		</Fragment>
		)
}

export default NewsfeedsUpdate