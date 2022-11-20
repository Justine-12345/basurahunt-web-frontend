import React, {Fragment, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import SidebarCollector from '../../components/layouts/sidebar-collector';

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getTodayCollectionPointList, clearErrors } from '../../actions/collectionPointActions'
import { liveMapNotification } from '../../actions/collectionPointActions'
import MetaData from '../../components/layouts/MetaData'

import cryptoRandomString from 'crypto-random-string';
import NotificationSender from '../../notificationSender';

const CollectorScheduleToday = () => {
	const alert = useAlert();
    const dispatch = useDispatch();
    let navigate = useNavigate()
    const { error, collectionPoints } = useSelector(state => state.collectionPoints);
	const { user } = useSelector(state => state.auth)
	let collectionPointsCount = 0
	useEffect(() => {
        dispatch(getTodayCollectionPointList());

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

    }, [collectionPoints, dispatch, error, navigate, alert]);

	const collectionPointTime = (collectionPoint) => {
        const startTimeArray = collectionPoint.startTime.split(":");
		const endTimeArray = collectionPoint.endTime.split(":");
		var ampmStartTime = startTimeArray[0] >= 12 ? 'PM' : 'AM';
		var ampmEndTime = endTimeArray[0] >= 12 ? 'PM' : 'AM';
		const hoursStartTime = (startTimeArray[0] % 12) == 0 ? 12 : startTimeArray[0] % 12;
		const minutesStartTime = startTimeArray[1];
		const hoursEndTime = (endTimeArray[0] % 12) == 0 ? 12 : endTimeArray[0] % 12;
		const minutesEndTime = endTimeArray[1];

		return hoursStartTime + ":" + minutesStartTime + " " + ampmStartTime + " - " + hoursEndTime + ":" + minutesEndTime + " " + ampmEndTime;
    }

	const checkTime = (collectionPoint) => {
		const today = new Date();
		const hoursNow = today.getHours();
		const minutesNow = today.getMinutes();
		const startTimeArray = collectionPoint.startTime.split(":");
		const endTimeArray = collectionPoint.endTime.split(":");
		
		let hourNow = hoursNow;
		let minuteNow = minutesNow;
		let timeNow = ""
		if(hoursNow<10) {
			hourNow = "0"+hoursNow;
		}
		if(minutesNow<10) {
			minuteNow = "0"+minutesNow;
		}
		timeNow = hourNow+""+minuteNow;
		let checkTime = timeNow >= startTimeArray[0]+""+startTimeArray[1] && timeNow <= endTimeArray[0]+""+endTimeArray[1];

		if(checkTime) {
			return <p className="sched-status s-ongoing">On-going</p>;
		}
		else if(timeNow <= startTimeArray[0]+""+startTimeArray[1]) {
			return <p className="sched-status s-ongoing">Upcoming</p>;
		}
		else {
			return <p className="sched-status s-finished">Finished</p>;
		}
	}


	const sendNotificationStart = (collpoint)=> {
		const notifCode = cryptoRandomString({length: 20, type: 'url-safe'});

		const formData = new FormData();
        	formData.set('liveStatus', 'start');
        	formData.set('notifCode', notifCode);	
        dispatch(liveMapNotification(collpoint._id,formData))

	 	NotificationSender(`Garbage Collector ${user.first_name} started a live map`, user._id, null,user.barangay, 'live', notifCode, collpoint)


	}

	const getStartBtn = (collectionPoint) => {
		const today = new Date();
		const hoursNow = today.getHours();
		const minutesNow = today.getMinutes();
		const startTimeArray = collectionPoint.startTime.split(":");
		const endTimeArray = collectionPoint.endTime.split(":");
		
		let hourNow = hoursNow;
		let minuteNow = minutesNow;
		let timeNow = ""
		if(hoursNow<10) {
			hourNow = "0"+hoursNow;
		}
		if(minutesNow<10) {
			minuteNow = "0"+minutesNow;
		}
		timeNow = hourNow+""+minuteNow;
		let checkTime = timeNow >= startTimeArray[0]+""+startTimeArray[1] && timeNow <= endTimeArray[0]+""+endTimeArray[1];

		if(checkTime) {
			return <Link type="button" onClick={()=>{sendNotificationStart(collectionPoint)}} to={`/collector/schedule/view/${collectionPoint._id}/${collectionPoint.roomCode}`} class="btn btn-success" style={{width:"80%", margin:"auto", marginTop:"24px",  marginBottom:"24px"}}><b>Start Now</b></Link>;
		}
		else if(timeNow <= startTimeArray[0]+""+startTimeArray[1]) {
			return "";
		}
		else {
			return "";
		}
	}

	const dateNow = () => {
		let dateToday = new Date(Date.now());

		const months = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"];
		
		const month = months[dateToday.getMonth()];
		const year = dateToday.getFullYear();

		const date = month + " " + dateToday.getDate() + ", " + year;

		return date;
	}

	return(
		<Fragment>
		<MetaData title={`Schedule`} />
			<div className="bh-container">
				<div>
					<SidebarCollector/>
				</div>
				<div className="bh-container-3 px-3">

					<h3 className="m-0">Collection Schedule</h3>
					<div className="row row-cols-sm-2 row-cols-1">
						<div className="col">
							<p className="m-0 fw-bold">Today</p>
						</div>
						<div className="col text-sm-end">
							<p className="m-0 fw-bold">Barangay {user && user.barangay}</p>
						</div>
					</div>
					{
						collectionPoints.map((collectionPoint) => {

						return(
							collectionPoint&&collectionPoint.collectors.map((cp)=>{

								if(String(cp&&cp.collector&&cp.collector._id) === String(user&&user._id)){
								collectionPointsCount+=1
								return(
									<Fragment key={collectionPoint._id}>
									<div className="schedule-item" style={{cursor:"default"}}>
										{checkTime(collectionPoint)}
										<h5 className="fw-bold text-center">{dateNow()}</h5>

										<div className="row row-cols-md-3 row-cols-sm-2 row-cols-1 text-center m-auto">
											<div className="col">
												<small className="fw-bold">Type:</small>
												<p>{collectionPoint.type}</p>
											</div>
											<div className="col col-sm-12 order-md-1 order-sm-3" data-toggle="tooltip" data-placement="top" title={collectionPoint.collectionPoint}>
												<small className="fw-bold">Collection Points:</small><br/>
												<span>{collectionPoint.collectionPoint}</span>
											</div>
											<div className="col order-3 order-sm-2">
												<small className="fw-bold">Time:</small>
												<p>{collectionPointTime(collectionPoint)}</p>
											</div>
										</div>
										<div className="row row-cols-md-12 row-cols-sm-12 row-cols-12 text-center m-auto">
										{getStartBtn(collectionPoint)}
												
											</div>
									</div>


									</Fragment>
								)

							}


							}
							)
							)
						})
					}
					{collectionPointsCount?"":"No Collection For Today"}
				</div>
			</div>
		</Fragment>
		)
}

export default CollectorScheduleToday