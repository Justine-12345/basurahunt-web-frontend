import React, {Fragment, useEffect, useState} from 'react';
import SidebarUser from '../../../components/layouts/sidebar-user';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import LoaderNoBg from '../../layouts/LoaderNoBg'
import { reportedDumps, clearErrors} from '../../../actions/userActions'
import MetaData from '../../../components/layouts/MetaData'
			

const UserReportsList = () => {

	const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, userDumps } = useSelector(state => state.userReportsAndItems)


    useEffect(()=>{

     	dispatch(reportedDumps());

	},[])



	useEffect(()=>{

		if (error) {
            return alert.error(error)
        }


     	dispatch(reportedDumps());


	},[error])

	const deletedPrompt = () =>{
		alert.show("This Report Has been Deleted")
	}

	return(
		<Fragment>
			<MetaData title={"My Reports"} />
			<div className="bh-container">
			{console.log(userDumps)}
				<div>
					<SidebarUser/>
				</div>
				<div className="bh-container-3 px-3">
					<h3 className="m-0">My Reports</h3>
					<small className="fw-bold">Total: {userDumps&&userDumps.length}</small>
					

					{loading?<LoaderNoBg/>:
							userDumps&&userDumps.map((dumpDetail)=>{
								let dump = dumpDetail.dump

								if(dump !== null){
								 	return(

										<div className="row row-cols-1 w-100 m-auto pb-3 px-md-5 px-0">
											<Link to={`/report/${dump._id}/${dump&&dump.coordinates&&dump.coordinates.longtitude}/${dump&&dump.coordinates&&dump.coordinates.latitude}/`} className="col mt-3 bh-reports-item">
												<div className="bh-thumbnail" style={{backgroundImage:`url(${dump.images[0].url})`}}></div>
												<div className="bh-info">
												<small style={{float:"right", color:dump.status==="Rejected"?"red":"darkgreen"}}><b>{dump&&dump.status === "newReport"?"New Report":dump.status}</b></small>
													<p className="my-1">{dump.complete_address}</p>
													<small>{dump.additional_desciption?
													dump.additional_desciption:dump.waste_type.map((wt)=>{
														return(<Fragment>{wt.type}&nbsp;</Fragment>)
													})
													}</small>
													<small className="float-end">{new Date(dump.createdAt).toDateString()}</small>
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
													<p className="my-1">This Report Has Been Deleted</p>
													
												</div>
											</span>	
										</div>
										)
								}
							}).reverse()
						}


				</div>
			</div>
		</Fragment>
		)
}

export default UserReportsList