import React, {Fragment, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import SidebarUser from '../../../components/layouts/sidebar-user';
import LoaderNoBg from '../../../components/layouts/LoaderNoBg'
import MetaData from '../../../components/layouts/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import { getNewsfeeds, clearErrors } from '../../../actions/newsfeedActions'
import { useAlert } from 'react-alert'

const NewsfeedsList = () => {
		
		const alert = useAlert();
    	const dispatch = useDispatch();
		
		const { error, newsfeeds, loading } = useSelector(state => state.newsfeeds);
	    useEffect(() => {
	        dispatch(getNewsfeeds());

	        if (error) {
	            alert.error(error);
	            dispatch(clearErrors())
	        }

	    }, [error])

	return(
		<Fragment>
			<MetaData title={"Newsfeed"} />
			<div className="bh-container">
				<div>
					<SidebarUser/>
				</div>
				{loading?<LoaderNoBg/>:
				<div className="bh-container-3 px-3">
					<h3>Newsfeed</h3>
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
				}
			</div>
		</Fragment>
		)
}

export default NewsfeedsList