import React, {Fragment, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../../../components/layouts/sidebar';
import HyperModal from 'react-hyper-modal';
import Select from 'react-select';
import TimePicker from 'react-time-picker';
import MetaData from '../../../components/layouts/MetaData'
	
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { newCollectionPoint, getCollectors, clearErrors } from '../../../actions/collectionPointActions'
import { NEW_COLLECTION_POINT_RESET } from '../../../constants/collectionPointConstants'

import cryptoRandomString from 'crypto-random-string';
import NotificationSender from '../../../notificationSender';

const SchedulesAdd = () => {
	const [customs, setCustoms] = useState([]);
	
	const [name, setName] = useState('');
    const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');
    const [barangay, setBarangay] = useState('');
    const [type, setType] = useState('');
	const [collectors2, setCollectors2] = useState([]);
	const [repeats, setRepeats] = useState([]);
	const [collectionPoint, setCollectionPoint] = useState('');
	const [notifCode, setNotifCode] = useState('')
	const alert = useAlert();
    const dispatch = useDispatch();
    let navigate = useNavigate()
    
    const { error, success } = useSelector(state => state.newCollectionPoint);
	const { error: collectorError, collectors } = useSelector(state => state.collectors);
	const { user } = useSelector(state => state.auth)

	useEffect(() => {
		dispatch(getCollectors());
		setNotifCode(cryptoRandomString({length: 20, type: 'url-safe'}))

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

		if (collectorError) {
            alert.error(collectorError);
            dispatch(clearErrors());
        }



        if (success) {
        	NotificationSender(`New garbage collection schedule has been added to your barangay | Time: ${startTime}-${endTime} ${repeats.join()} | Collection Point: ${collectionPoint} | Type: ${type}`, user._id, null,barangay, 'Schedule', notifCode)
           	
        	collectors2&&collectors2.forEach((coll2)=>{
        		NotificationSender(`A new garbage collection schedule has been assigned to you | Time: ${startTime}-${endTime} ${repeats.join()} | Collection Point: ${collectionPoint} | Type: ${type}`, user._id, coll2.value, barangay, 'Schedule', notifCode)
        	})

           	// console.log("collector2",collectors2)

            navigate('/admin/schedules');
            alert.success('Schedule created successfully');
            dispatch({ type: NEW_COLLECTION_POINT_RESET });
        }

    }, [dispatch, alert, error, collectorError, success, navigate]);

	const submitHandler = (e) => {
        e.preventDefault();

       
        const formData = new FormData();
        formData.set('name', name);
        formData.set('startTime', startTime);
        formData.set('endTime', endTime);
        formData.set('barangay', barangay);
        formData.set('type', type);
		formData.set('collectionPoint', collectionPoint);
		formData.set('notifCode', notifCode);

		repeats.forEach(repeat => {
            formData.append('repeats', repeat)
        })

		collectors2.forEach(collector2 => {
            formData.append('collectors', collector2.value)
        })

		dispatch(newCollectionPoint(formData))
    }

	
	return(
		<Fragment>
		<MetaData title={`Add Schedule`} />
			<div className="bh-dashboard">
				<div>
					<Sidebar/>
				</div>
				<div className="bh-dashboard-section">
					<h5 className="py-2 px-3">Add Collection Schedule</h5>
					<hr/>
					<form onSubmit={submitHandler}>
						<div className="contents" style={{borderBottom:"1px solid #c8c9ca"}}>
							<div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 m-auto">
								<div className="col">
									<div className="row row-cols-1">
										<div className="col">
											<p>TRUCK NUMBER/LANDFILLS NAME: <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)}/></p>
										</div>
										<div className="col">
											<p>START TIME: <TimePicker  type="text" className="form-control" value={startTime} onChange={setStartTime}/></p>
										</div>
										<div className="col">
											<p>END TIME: <TimePicker  type="text" className="form-control" value={endTime} onChange={setEndTime}/></p>
										</div>
										<div className="col">
											<p>BARANGAY: <select className="form-select" value={barangay} onChange={(e) => setBarangay(e.target.value)}>
												<option>Select...</option>
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
											</select></p>
										</div>
										<div className="col">
											<p>TYPE: <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
												<option value="None">None</option>
												<option value="Biodegradable">Biodegradable</option>
												<option value="Non-Biodegradable">Non-Biodegradable</option>
												<option value="Recyclable">Recyclable</option>
												<option value="Hazardous Waste">Hazardous Waste</option>
												<option value="Oil">Oil</option>
												<option value="Tires">Tires</option>
												<option value="Glassware">Glassware</option>
											</select></p>
										</div>
									</div>
								</div>
								<div className="col">
									<div className="row row-cols-1">
										<div className="col">
											<p>COLLECTORS: 

											<Select
											  onChange={(val)=>{setCollectors2(val)}}
										      isMulti
										      options={collectors}
										    />

											</p>
										</div>
										<div className="col">
											<p>REPEAT:
												<div className="row row-cols-auto m-auto">
													<div className="col form-check">
														<input className="form-check-input" type="checkbox" value="Once" id="once" onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)) }}/>
														<label className="form-check-label" for="once">Once</label>
													</div>
													<div className="col form-check">
														<input className="form-check-input" type="checkbox" value="Every Sunday" id="every-sunday" onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)) }}/>
														<label className="form-check-label" for="every-sunday">Every Sunday</label>
													</div>
													<div className="col form-check">
														<input className="form-check-input" type="checkbox" value="Every Monday" id="every-monday" onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)) }}/>
														<label className="form-check-label" for="every-monday">Every Monday</label>
													</div>
													<div className="col form-check">
														<input className="form-check-input" type="checkbox" value="Every Tuesday" id="every-tuesday" onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)) }}/>
														<label className="form-check-label" for="every-tuesday">Every Tuesday</label>
													</div>
													<div className="col form-check">
														<input className="form-check-input" type="checkbox" value="Every Wednesday" id="every-wednesday" onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)) }}/>
														<label className="form-check-label" for="every-wednesday">Every Wednesday</label>
													</div>
													<div className="col form-check">
														<input className="form-check-input" type="checkbox" value="Every Thursday" id="every-thursday" onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)) }}/>
														<label className="form-check-label" for="every-thursday">Every Thursday</label>
													</div>
													<div className="col form-check">
														<input className="form-check-input" type="checkbox" value="Every Friday" id="every-friday" onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)) }}/>
														<label className="form-check-label" for="every-friday">Every Friday</label>
													</div>
													<div className="col form-check">
														<input className="form-check-input" type="checkbox" value="Every Saturday" id="every-saturday" onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)) }}/>
														<label className="form-check-label" for="every-saturday">Every Saturday</label>
													</div>
													
													


													<HyperModal
													
														    renderOpenButton={(requestOpen) => {

														        return (
															        	  <span style={{padding:"0px 10px 0px 10px" }} className="btn btn-success" onClick={requestOpen}>{customs.filter(function( element ) {return element !== undefined;}).length>0?customs.filter(function( element ) {return element !== undefined;}).map((custom)=>(custom+" ")):"Custom"}</span>
														        );
														      }}
														    >
														    													

														      <div className="col-lg-4" style={{ margin:"auto"}}>
														      <br/>
														      		<h2>Pick day</h2>
																	  <div className="col form-check" style={{ height:"40px"}}>
																		<input className="form-check-input" type="checkbox" value="Sunday" id="sunday" onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Sunday"]): delete customs[customs.indexOf("Sunday")] }}/>
																		<label className="form-check-label" for="sunday"> Sunday</label>
																	</div>
														        	<div className="col form-check" style={{ height:"40px"}}>
																		<input className="form-check-input" type="checkbox" value="Monday" id="monday" onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Monday"]): delete customs[customs.indexOf("Monday")] }}/>
																		<label className="form-check-label" for="monday"> Monday</label>
																	</div>
																	<div className="col form-check" style={{ height:"40px"}}>
																		<input className="form-check-input" type="checkbox" value="Tuesday" id="tuesday" onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Tuesday"]): delete customs[customs.indexOf("Tuesday")] }}/>
																		<label className="form-check-label" for="tuesday"> Tuesday</label>
																	</div>
																	<div className="col form-check" style={{ height:"40px"}}>
																		<input className="form-check-input"  type="checkbox" value="Wednesday" id="wednesday" onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Wednesday"]): delete customs[customs.indexOf("Wednesday")] }}/>
																		<label className="form-check-label" for="wednesday"> Wednesday</label>
																	</div>
																	<div className="col form-check" style={{ height:"40px"}}>
																		<input className="form-check-input" type="checkbox" value="Thursday" id="thursday" onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Thursday"]): delete customs[customs.indexOf("Thursday")] }}/>
																		<label className="form-check-label" for="thursday"> Thursday</label>
																	</div>
																	<div className="col form-check" style={{ height:"40px"}}>
																		<input className="form-check-input" type="checkbox" value="Friday" id="friday" onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Friday"]): delete customs[customs.indexOf("Friday")] }}/>
																		<label className="form-check-label" for="friday"> Friday</label>
																	</div>
																	<div className="col form-check" style={{ height:"40px"}}>
																		<input className="form-check-input" type="checkbox" value="Saturday" id="saturday" onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Saturday"]): delete customs[customs.indexOf("Saturday")] }}/>
																		<label className="form-check-label" for="saturday"> Saturday</label>
																	</div>
														      </div>
														</HyperModal>


												</div>
											</p>
										</div>
										<div className="col">
											<p>COLLECTION POINTS: <textarea className="form-control" value={collectionPoint} onChange={(e) => setCollectionPoint(e.target.value)}/></p>
										</div>
									</div>
								</div>
							</div>
						</div>
						
						<button className="btn bh-submitBtn m-3" type="submit">Set Schedule</button>
					</form>
				</div>
			</div>
		</Fragment>
		)
}

export default SchedulesAdd