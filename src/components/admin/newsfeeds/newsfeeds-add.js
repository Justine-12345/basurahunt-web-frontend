import React, {Fragment, useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Sidebar from '../../../components/layouts/sidebar';
import Loading from '../../../components/extras/loading'
import CreatableSelect from 'react-select/creatable';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getNewsfeeds, newNewsfeed, clearErrors } from '../../../actions/newsfeedActions'
import imageCompression from 'browser-image-compression';
import MetaData from '../../../components/layouts/MetaData'

import cryptoRandomString from 'crypto-random-string';
import NotificationSender from '../../../notificationSender';

import { NEW_NEWSFEED_RESET } from '../../../constants/newsfeedConstants'

const NewsfeedsAdd = () => {
	const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagsList, setTagsList] = useState([]);
    const [tags, setTags] = useState([]);
    const [images, setImages] = useState([]);
    const [notifCode, setNotifCode] = useState('')

	const alert = useAlert();
    const dispatch = useDispatch();
    let navigate = useNavigate()
    const { error, newsfeeds, tags:allTags } = useSelector(state => state.newsfeeds);
    const { error: newsfeedError, success, loading, newsfeed } = useSelector(state => state.newNewsfeed);
	const { user } = useSelector(state => state.auth)

    useEffect(() => {
        dispatch(getNewsfeeds());
        setNotifCode(cryptoRandomString({length: 20, type: 'url-safe'}))
        setTagsList(allTags)
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

		if (newsfeedError) {
            alert.error(newsfeedError);
            dispatch(clearErrors())
        }

        if (success) {
        	NotificationSender(`${title}`, user._id, null, user.barangay, 'newsfeeds-add', notifCode, newsfeed&&newsfeed)
            navigate('/admin/newsfeeds/new');
            alert.success('News created successfully');
            dispatch({ type: NEW_NEWSFEED_RESET })
        }

    }, [newsfeedError, success, tagsList, allTags])

	const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('title', title);
        formData.set('content', content);

        images.forEach(images => {
		    formData.append('images', images)
		})

		tags.forEach(tag => {
            formData.append('tags', tag.value)
        })

        formData.set('notifCode', notifCode);

        dispatch(newNewsfeed(formData))
    }

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

	return(
		<Fragment>
		<MetaData title={`Newsfeed`} />
			<div className="bh-dashboard">
				<div>
					<Sidebar/>
				</div>
				<div className="bh-dashboard-section">
					<h5 className="py-2 px-3">Newsfeed</h5>
					<hr/>
					<form onSubmit={submitHandler} encType='multipart/form-data'>
						<div className="contents">
							<input 
								disabled={loading?"true":""}
								className="form-control"
								type="file"
								accept="image/*"
								onChange={onChange}
                                multiple
							/>
							<input 
								disabled={loading?"true":""}
								className="form-control my-2" 
								type="text" 
								placeholder="Type Title Here..."
								value={title}
                                onChange={(e) => setTitle(e.target.value)}
							/>



							<CreatableSelect 
								isDisabled={loading?"true":""}
								className="form-control my-2" 
								placeholder="Type Tags Here..."
								onChange={(val)=>{setTags(val)}}
								isMulti
								options={tagsList}
							/>

							<textarea 
								disabled={loading?"true":""}
								className="form-control"
								type="text"
								placeholder="Type Content Here..."
								value={content}
                                onChange={(e) => setContent(e.target.value)}
							/>
						</div>
						<button disabled={loading?"true":""} className="btn bh-submitBtn m-3" type="submit">{loading?"Uploading...":"Post"}</button>
						
					</form>

					<br/><hr className="mt-5"/>
					<div className="newsfeed-items">
						{
							newsfeeds && newsfeeds.map((newsfeed) => {

								return (
									<Link to={"/post/" + newsfeed._id}><div className="newsfeed-item" style={{backgroundImage:`url(${newsfeed && newsfeed.images[0] && newsfeed.images[0].url})`}}>
										<p>{newsfeed.title}</p>
									</div></Link>
								)
							})
						}
					</div>

				</div>
			</div>
		</Fragment>
		)
}

export default NewsfeedsAdd