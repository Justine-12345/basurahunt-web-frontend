import React, {Fragment, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import SidebarCollector from '../../components/layouts/sidebar-collector';
import MetaData from '../../components/layouts/MetaData'
	
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getUpcomingCollectionPointList, clearErrors } from '../../actions/collectionPointActions'

const CollectorScheduleUpcoming = () => {
	const alert = useAlert();
    const dispatch = useDispatch();
    let navigate = useNavigate()
    const { error, collectionPoints } = useSelector(state => state.collectionPoints);
	const { user } = useSelector(state => state.auth)

	useEffect(() => {
        dispatch(getUpcomingCollectionPointList());

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

    }, [dispatch, error, navigate, alert]);

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

	const filterRepeat = (repeat) => {
		let repeatArray = repeat.split(" ");

		if(repeatArray.includes("Every")) {
			return repeatArray[1];
		}
		else {
			return repeat;
		}
	}

	const upcomingDate = (repeat) => {
		const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
			"Saturday"];
		const months = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"];
		
		const filteredRepeat = filterRepeat(repeat);

		let dateToday = new Date(Date.now());
		let upcomingDay = new Date();

		const indexToday = dateToday.getDay();
		const indexUpcoming = days.indexOf(filteredRepeat);
				
		if(indexToday < indexUpcoming) {
			upcomingDay.setDate(dateToday.getDate() + (indexUpcoming - indexToday))
		}
		else {
			upcomingDay.setDate(dateToday.getDate() + 7 + (indexUpcoming - indexToday))
		}

		const month = months[upcomingDay.getMonth()];
		const year = upcomingDay.getFullYear();

		const date = month + " " + upcomingDay.getDate() + ", " + year;

		return date;
	}

	const repeatCheck = (repeat) => {
		let dateToday = new Date(Date.now());
		const repeatDate = new Date(repeat.date);

		let repeatCheck = "";
		if(repeat.date === undefined) {
			repeatCheck = true;
		}
		else if(repeatDate.setHours(0,0,0,0) >= dateToday.setHours(0,0,0,0)) {
			repeatCheck = true;
		}
		else {
			repeatCheck = false;
		}
		
		return repeatCheck;
	}

	const upcomingSchedule = (collectionPoint, repeat) => {

		const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
			"Saturday"];
		let dateToday = new Date(Date.now());
		const day = days[dateToday.getDay()];
		
		
		if(repeat.repeat !== "Once" && filterRepeat(repeat.repeat) !== day && repeatCheck(repeat)) {
			return(
				<Fragment key={repeat}>
					
					<div className="schedule-item s-upcoming">
					<p className="m-0 text-center">{filterRepeat(repeat.repeat)}</p>
					<h5 className="fw-bold text-center">{upcomingDate(repeat.repeat)}</h5>

					<div className="row row-cols-md-3 row-cols-sm-2 row-cols-1 text-center m-auto">
						<div className="col">
							<small className="fw-bold">Type:</small>
							<p>{collectionPoint.type}</p>
						</div>
						<div className="col col-sm-12 order-md-1 order-sm-3">
							<small className="fw-bold">Collection Points:</small>
							<p>{collectionPoint.collectionPoint}</p>
						</div>
						<div className="col order-3 order-sm-2">
							<small className="fw-bold">Time:</small>
							<p>{collectionPointTime(collectionPoint)}</p>
						</div>
					</div>
					</div>
				</Fragment>
			)
		}
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
							<p className="m-0 fw-bold">Upcoming</p>
						</div>
						<div className="col text-sm-end">
							<p className="m-0 fw-bold">Barangay {user && user.barangay}</p>
						</div>
					</div>
					
					{
						collectionPoints.map((collectionPoint) => {
							return(
								<Fragment key={collectionPoint._id}>
									{
										collectionPoint.repeats.map((repeat) => {
											return(
												upcomingSchedule(collectionPoint, repeat)
									)})
								}
								</Fragment>
							)
						})
					}
				</div>
			</div>
		</Fragment>
		)
}

export default CollectorScheduleUpcoming