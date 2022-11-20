import React, {Fragment, useEffect, useState} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import SidebarUser from '../../components/layouts/sidebar-user';
import LoaderNoBg from '../layouts/LoaderNoBg'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getItemList, clearErrors } from '../../actions/itemActions'
import Pagination from 'react-js-pagination'
import MetaData from '../../components/layouts/MetaData'

const PublicDonationsList = () => {
	const [currentPage, setCurrentPage] = useState(1)
	const [district, setDistrict] = useState(0)
    const [barangay, setBarangay] = useState(0)
    const [type, setType] = useState(0)
    const [itemList, setItemList] = useState([])
    const [keyword, setKeyword] = useState('');

	const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {loading, error, items, itemsCount, filteredItemCount, resPerPage } = useSelector(state => state.items);

	useEffect(() => {
		if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        dispatch(getItemList(keyword, currentPage, district, barangay, type));

    
    }, [currentPage, keyword, error, district, barangay, type]);

	const formatDate = (itemDate) => {
		let dateCreated = new Date(itemDate);

		const months = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"];
		const month = months[dateCreated.getMonth()];
		const year = dateCreated.getFullYear();

		const formattedDate = month + " " + dateCreated.getDate() + ", " + year;

		return formattedDate;
	}

	// const itemType = (types) => {
	// 	let typeList = "";
	// 	for(let i = 0; i <= types.length - 1; i++) {
	// 		if(i === types.length - 1) {
	// 			typeList += types[i].type
	// 		}
	// 		else {
	// 			typeList += types[i].type + ", "
	// 		}
	// 	}
	// 	return typeList;
	// }

	function setCurrentPageNo(pageNumber) {
        setCurrentPage(pageNumber)
    }

    let count = itemsCount;
    if (keyword) {
        count = filteredItemCount
    }

    const searchHandler = (e) => {
        e.preventDefault()
        if (keyword.trim()) {
            navigate(`/reports/search/${keyword}`)
        } else {
            navigate('/reports')
        }
    }


	return(
		<Fragment>
		<MetaData title={"Donations"} />
			<div className="bh-container">
				<div>
					<SidebarUser/>
				</div>
				<div className="bh-container-3 px-3">
					<h3 className="m-0">Donations</h3>
					<small className="fw-bold">Find Items</small>

					<div className="input-group">
						<input defaultValue={keyword} onChange={(e) => setKeyword(e.target.value)} type="text" className="form-control"/>
						<button className="btn bh-submitBtn m-0"><span className="bi bi-search"/></button>
					</div>

					
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
								<p className="m-0">Type</p>
								<select onChange={(e)=>{setType(e.target.value)}} className="form-select">			
									<option value=""></option>						
									<option value="Food">Food</option>
									<option value="Clothes">Clothes</option>
									<option value="Medical">Medical</option>
									<option value="Appliances">Appliances</option>
									<option value="Furnitures">Furnitures</option>
									<option value="Other">Other</option>
								</select>
							</div>
						</div>
						<div className="row row-cols-1 w-100 m-auto pb-3 px-md-5 px-0">	
						{loading?<LoaderNoBg/>:
							items && items.map((item) => {
								{console.log(item)}
								return(
									<Fragment>
										<Link to={"/donation/" + item._id} className="col mt-3 bh-reports-item">		
											<div className="bh-thumbnail" style={{backgroundImage:`url(${item && item.images[0] && item.images[0].url})`}}></div> 
											<div className="bh-info">
											<p className="my-1">{item && item.name}</p>
											<small>{item.addional_desciption}</small>
											<small className="float-end">{formatDate(item.createdAt)}</small>
											</div>
										</Link>
									</Fragment>
								)
							})
						}
					</div>

					</Fragment>:

					<div className="row row-cols-1 w-100 m-auto pb-3 px-md-5 px-0">	
						
					{loading?<LoaderNoBg/>:
						items && items.map((item) => {
								{console.log(item)}
								return(
									<Fragment>
										<Link to={"/donation/" + item._id} className="col mt-3 bh-reports-item">					
											<div className="bh-thumbnail" style={{backgroundImage:`url(${item && item.images[0] && item.images[0].url})`}}></div> 
											<div className="bh-info">
											<p className="my-1">{item && item.name}</p>
											<small>{item.addional_desciption}</small>
											<small className="float-end">{formatDate(item.createdAt)}</small>
											</div>
										</Link>
									</Fragment>
								)
							})
					}

					</div>}

					{resPerPage <= count && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resPerPage}
                                totalItemsCount={itemsCount}
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

export default PublicDonationsList




							
						