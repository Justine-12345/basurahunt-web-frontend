import React, {Fragment, useEffect} from 'react';
import {Link} from 'react-router-dom';
import SidebarCollector from '../../components/layouts/sidebar-collector';
import MetaData from '../../components/layouts/MetaData'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getDumpList, clearErrors } from '../../actions/dumpActions'

const CollectorFinished = () => {
	const dispatch = useDispatch();
	const alert = useAlert();
    const { error, dumps } = useSelector(state => state.allDumps);
	const { user } = useSelector(state => state.auth)
    
    useEffect(() => {
        dispatch(getDumpList());

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

    }, [dispatch, error, alert]);

	const collector = (dump) => {
		let isTrue = false;
		
		if(user) {
			dump && dump.collectors.forEach((collector) => {
				if(collector.collector === user._id) {
					isTrue = true;
				}
			});
		}

		return isTrue;
	}

	return(
		<Fragment>
		<MetaData title={`Finished`} />
			<div className="bh-container">
				<div>
					<SidebarCollector/>
				</div>
				<div className="bh-container-3 px-3">
					<h3 className="m-0">Finished</h3>

					<div className="row row-cols-1 w-100 m-auto pb-3 px-md-5 px-0">
						{
							dumps && dumps.map((dump) => {
								console.log(collector(dump))
								return (
									<Fragment>
										{
											collector(dump) === true && dump.status === "Cleaned" && (
												<Link to={"/report/" + dump._id} className="col mt-3 bh-reports-item">
													<div className="bh-thumbnail" style={{backgroundImage:`url(${dump.images[0] && dump.images[0].url})`}}></div>
													<div className="bh-info">
														<p className="my-1">{dump.complete_address + ", Brgy. " + dump.barangay}</p>
														<small>{dump.additional_desciption}</small>
														<small className="float-end">July 28,2022</small>
													</div>
												</Link>
											)
										}
									</Fragment>
								)
							})
						}

						{/* <a href="/report/id" className="col mt-3 bh-reports-item">
							<div className="bh-thumbnail" style={{backgroundImage:"url('https://images.pexels.com/photos/2409022/pexels-photo-2409022.jpeg?auto=compress&cs=tinysrgb&w=300')"}}></div>
							<div className="bh-info">
								<p className="my-1">Lorem Street, Brgy. Ipsum</p>
								<small>LoremLorem ipsum dasdasdasdasdasdolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.</small>
								<small className="float-end">July 28,2022</small>
							</div>
						</a> */}
						{/*-----------------*/}
					</div>
				</div>
			</div>
		</Fragment>
		)
}

export default CollectorFinished