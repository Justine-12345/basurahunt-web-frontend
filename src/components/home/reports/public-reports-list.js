import React, {Fragment, useEffect, useState} from 'react';
import SidebarUser from '../../../components/layouts/sidebar-user';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from '../../layouts/Loader'
import LoaderNoBg from '../../layouts/LoaderNoBg'
import Pagination from 'react-js-pagination'
import MetaData from '../../../components/layouts/MetaData'

import { getDumps, clearErrors} from '../../../actions/dumpActions'


const PublicReportsList = () => {
	const [currentPage, setCurrentPage] = useState(1)
	const [district, setDistrict] = useState(0)
    const [barangay, setBarangay] = useState(0)
    const [size, setSize] = useState(0)
    const [type, setType] = useState(0)
    const [dumpList, setDumpList] = useState([])
    const [keyword, setKeyword] = useState('');

    const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();
	const { loading, dumps, dumpsCount, error, resPerPage, filteredDumpCount } = useSelector(state => state.dumps)
    const { user } = useSelector(state => state.auth)
    
	useEffect(()=>{

		if (error) {
            return alert.error(error)
        }
        
        	dispatch(getDumps(keyword, currentPage, district, barangay, size, type));
    
      

	},[currentPage, keyword, error, district, barangay, size, type])

	function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }

    let count = dumpsCount;
    if (keyword) {
        count = filteredDumpCount
    }

     const searchHandler = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            navigate(`/donations/search/${keyword}`)
        } else {
            navigate('/donations')
        }
    }

	return(
		<Fragment>
		<MetaData title={"Reports"} />
			<div className="bh-container">
				<div>
					<SidebarUser/>
				</div>
				
				<div className="bh-container-3 px-3">
					<h3>Reported Illegal Dumps</h3>
					<form onSubmit={searchHandler}>
						<div className="input-group">
							<input defaultValue={keyword} onChange={(e) => setKeyword(e.target.value)} type="text" className="form-control"/>
							<button type="submit" className="btn bh-submitBtn m-0"><span className="bi bi-search"/></button>
						</div>	
					</form>
					
					{keyword?<Fragment>
						<p className="m-0">Filter:</p>
						<div className="row row-cols-lg-4 row-cols-sm-2 row-cols-1 w-100 px-md-5 px-0 m-auto">
							<div className="col">
								<p className="m-0">District</p>
								<select onChange={(e)=>{setDistrict(e.target.value)}} className="form-select">
									<option value=""></option>
									<option value="1">1</option>
									<option value="2">2</option>
								</select>
							</div>
							<div className="col">
								<p className="m-0">Barangay</p>
								<select onChange={(e)=>{setBarangay(e.target.value)}} className="form-select" required>
											<option value=""></option>
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
							<div className="col">
								<p className="m-0">Size</p>
								<select onChange={(e)=>{setSize(e.target.value)}} className="form-select">
									<option value="" ></option>
									<option value="Dump Truck" >Dump Truck</option>
									<option value="Trash Bin" >Trash Bin</option>
								</select>
							</div>
							<div className="col">
								<p className="m-0">Type</p>
								<select onChange={(e)=>{setType(e.target.value)}} className="form-select">			
									<option value=""></option>						
									<option value="Animal Corpse">Animal Corpse</option>
									<option value="Automotive">Automotive</option>
									<option value="Construction">Construction</option>
									<option value="Electronics">Electronics</option>
									<option value="Hazardous">Hazardous</option>
									<option value="Household">Household</option>
									<option value="Liquid Waste">Liquid Waste</option>
									<option value="Metal/Can">Metal/Can</option>
									<option value="Paper">Paper</option>
									<option value="Plastic">Plastic</option>
									<option value="Glass Bottle">Glass Bottle</option>
									<option value="Organic/Food">Organic/Food</option>
									<option value="Other">Other</option>
								</select>
							</div>
						</div>
						<div className="row row-cols-1 w-100 m-auto pb-3 px-md-5 px-0">	
						{loading?<LoaderNoBg/>:
							dumps&&dumps.map((dump)=>{
								return(
										<Link to={`/report/${dump._id}/${dump&&dump.coordinates&&dump.coordinates.longtitude}/${dump&&dump.coordinates&&dump.coordinates.latitude}/`} className="col mt-3 bh-reports-item">
												<div className="bh-thumbnail" style={{backgroundImage:`url(${dump.images[0].url})`}}></div>
												<div className="bh-info">
												<p className="my-1">{dump.complete_address}</p>
												<small>{dump.additional_desciption?
													dump.additional_desciption:dump.waste_type.map((wt)=>{
														return(<Fragment>{wt.type}&nbsp;</Fragment>)
													})

												}</small>
												<small className="float-end">{new Date(dump.createdAt).toDateString()}</small>
												</div>
									</Link>
									)
							})
						}
					</div>

					</Fragment>:

					<div className="row row-cols-1 w-100 m-auto pb-3 px-md-5 px-0">	
						
					{loading?<LoaderNoBg/>:
						dumps&&dumps.map((dump)=>{
							return(
									<Link to={`/report/${dump._id}/${dump&&dump.coordinates&&dump.coordinates.longtitude}/${dump&&dump.coordinates&&dump.coordinates.latitude}/`} className="col mt-3 bh-reports-item">
											<div className="bh-thumbnail" style={{backgroundImage:`url(${dump.images[0].url})`}}></div>
											<div className="bh-info">
											<p className="my-1">{dump.complete_address}</p>
											<small>{dump.additional_desciption?
												dump.additional_desciption:dump.waste_type.map((wt)=>{
													return(<Fragment>{wt.type}&nbsp;</Fragment>)
												})

											}</small>
											<small className="float-end">{new Date(dump.createdAt).toDateString()}</small>
											</div>
								</Link>
								)
						})
					}

					</div>}

						{resPerPage <= count && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resPerPage}
                                totalItemsCount={dumpsCount}
                                onChange={setCurrentPageNo}
                                nextPageText={'Next'}
                                prevPageText={'Prev'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>
                    )}
				</div>
				

			</div>
		</Fragment>
		)
}

export default PublicReportsList