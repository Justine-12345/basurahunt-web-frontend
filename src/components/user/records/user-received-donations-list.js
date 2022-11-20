import React, {Fragment, useEffect, useState} from 'react';
import SidebarUser from '../../../components/layouts/sidebar-user';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import LoaderNoBg from '../../layouts/LoaderNoBg'
import Pagination from 'react-js-pagination'
import { receiveItems, clearErrors} from '../../../actions/userActions'
import MetaData from '../../../components/layouts/MetaData'

const UserReceivedDonationsList = () => {

	const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, userReceiveItems } = useSelector(state => state.userReportsAndItems)

    useEffect(()=>{
     	dispatch(receiveItems());

	},[])

	useEffect(()=>{
		if (error) {
            return alert.error(error)
        }
     	dispatch(receiveItems());
	},[error])

	const deletedPrompt = () =>{
		alert.show("This Item Has been Deleted")
	}


	return(
		<Fragment>
		<MetaData title={"My Received Items"} />
			<div className="bh-container">
				<div>
					<SidebarUser/>
				</div>
				<div className="bh-container-3 px-3">
					<h3 className="m-0">Received Donations</h3>
					<small className="fw-bold">Total: {userReceiveItems&&userReceiveItems.length}</small>

					<div className="row row-cols-1 w-100 m-auto pb-3 px-md-5 px-0">
						
							{loading?<LoaderNoBg/>:
							 userReceiveItems&&userReceiveItems.map((itemDetail)=>{
								let item = itemDetail.item

								console.log("item",item)
								{if(item !== null){
								 	return(

										<div className="row row-cols-1 w-100 m-auto pb-3 px-md-5 px-0">
											<Link to={`/donation/${item._id}`} className="col mt-3 bh-reports-item">
												<div className="bh-thumbnail" style={{backgroundImage:`url(${item.images&&item.images[0]&&item.images[0].url})`}}></div>
												<div className="bh-info">
												<small style={{float:"right"}}><b>{item.status}</b></small>
													<p className="my-1">{item.name}</p>
													<small>{item.addional_desciption?
													    item.addional_desciption:item&&item.item_type.map((it)=>{
														return(<Fragment>{it.type}&nbsp;</Fragment>)
													})
													}</small>
													<small className="float-end">{new Date(item.date_recieved).toDateString()}</small>
												</div>
											</Link>	
										</div>



							
									)
								}else{
									return(
									<div className="row row-cols-1 w-100 m-auto pb-3 px-md-5 px-0">
											<span onClick={deletedPrompt} className="col mt-3 bh-reports-item">
												<div className="bh-thumbnail" style={{backgroundImage:`url(https://res.cloudinary.com/basurahunt/image/upload/v1658224082/BasuraHunt/Static/BasuraHunt_-_logo_v2aymh.png)`}}></div>
												<div className="bh-info">
													<p className="my-1">This Item Has Been Deleted</p>
													
												</div>
											</span>	
										</div>
										)
								}}


							})
						}





					</div>
				</div>
			</div>
		</Fragment>
		)
}

export default UserReceivedDonationsList