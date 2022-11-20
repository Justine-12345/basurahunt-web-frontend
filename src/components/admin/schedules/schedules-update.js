import React, {Fragment, useEffect, useState} from 'react';
import { useParams, useNavigate} from 'react-router-dom';

import Sidebar from '../../../components/layouts/sidebar';
import HyperModal from 'react-hyper-modal';
import Select from 'react-select';
import TimePicker from 'react-time-picker';

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getCollectionPointDetails, getCollectors, clearErrors, updateCollectionPoint } from '../../../actions/collectionPointActions'
import { UPDATE_COLLECTION_POINT_RESET, ADD_COLLECTION_NUMBER_OF_TRUCK_RESET } from '../../../constants/collectionPointConstants'
import MetaData from '../../../components/layouts/MetaData'

import cryptoRandomString from 'crypto-random-string';
import NotificationSender from '../../../notificationSender';

const SchedulesUpdate = () => {
	const [customs, setCustoms] = useState([]);

	const [name, setName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [barangay, setBarangay] = useState('');
    const [type, setType] = useState('');
	const [collectors2, setCollectors2] = useState([]);
	const [repeats, setRepeats] = useState([]);
	const [collectionPoints, setCollectionPoints] = useState('');
	const [notifCode, setNotifCode] = useState('')
	const [numOfTruck, setNumOfTruck] = useState(0)
	const [collectionPerTruck, setCollectionPerTruck] = useState([]);

	const alert = useAlert();
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const { error, collectionPoint } = useSelector(state => state.collectionPointDetails);
	const { error: updateError, isUpdated } = useSelector(state => state.collectionPoint);
	const { error: collectorError, collectors } = useSelector(state => state.collectors);
	const { loading:addNumOfTruckLoading, isAdded } = useSelector(state => state.collectionPoint);
	const { user } = useSelector(state => state.auth)

	let { id } = useParams();

	useEffect(() => {
		dispatch(getCollectors());
		
		if (collectionPoint && collectionPoint._id !== id || isUpdated) {
            dispatch(getCollectionPointDetails(id));
			setRepeats([]);
			setCollectors2([]);
        } else {
			setRepeats([]);
			setCollectors2([]);
			setNotifCode(cryptoRandomString({length: 20, type: 'url-safe'}))
            setName(collectionPoint.name);
            setStartTime(collectionPoint.startTime);
            setEndTime(collectionPoint.endTime);
            setBarangay(collectionPoint.barangay);
            setType(collectionPoint.type);
			setCollectionPoints(collectionPoint.collectionPoint);

			// console.log(collectionPoint.collectors)

			if(customs.length < 1) {
				collectionPoint.repeats.forEach(repeat => {
					setRepeats(oldArray => [...oldArray, repeat.repeat])
					
					if(repeat.repeat !== "Once" && repeat.repeat.split(" ")[0] !== "Every") {
						setCustoms(oldArray => [...oldArray, repeat.repeat])
						// setCustoms(customs.filter(item => item !== repeat.repeat))
					}

					// console.log(customs)
				})
			}
        }

		
		collectionPoint && collectionPoint.collectors && collectionPoint.collectors.forEach(collector => {
			console.log(collector)
			if(collector.collector){
				setCollectors2(oldArray => [...oldArray, {value: collector.collector._id, label: collector.collector.first_name + " " + collector.collector.last_name}])
			}
			 
		})
		
			setCollectionPerTruck([])
		collectionPoint && collectionPoint.collectionPerTruck && collectionPoint.collectionPerTruck.forEach(collectionPTruck=>{
			setCollectionPerTruck(oldArray => [...oldArray, collectionPTruck])
		})

		

		if (collectorError) {
            alert.error(collectorError);
            dispatch(clearErrors());
        }

		if (isUpdated) {
			
			NotificationSender(`A garbage collection schedule in your barangay has been updated| Time: ${startTime}-${endTime} ${repeats.join()} | Collection Point: ${collectionPoints} | Type: ${type}`, user._id, null,barangay, 'schedule', notifCode)
           
			collectors2&&collectors2.forEach((coll2)=>{
        		NotificationSender(`An assigned garbage collection schedule to you has been updated | Time: ${startTime}-${endTime} ${repeats.join()} | Collection Point: ${collectionPoints} | Type: ${type}`, user._id, coll2.value, barangay, 'schedule', notifCode)
        	})


            navigate('/admin/schedules');
            alert.success('Schedule updated successfully');
            dispatch({ type: UPDATE_COLLECTION_POINT_RESET });
        }

		if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors())
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if(isAdded){
        	dispatch({type:ADD_COLLECTION_NUMBER_OF_TRUCK_RESET})
        }


    }, [dispatch, collectionPoint, collectorError, isUpdated, updateError, error, alert, navigate]);

	// console.log(repeats)

	const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('startTime', startTime);
        formData.set('endTime', endTime);
        formData.set('barangay', barangay);
        formData.set('type', type);
		formData.set('collectionPoint', collectionPoints);
		formData.set('notifCode', notifCode);

		repeats.forEach(repeat => {
            formData.append('repeats', repeat)
        })

		collectors2.forEach(collector2 => {
            formData.append('collectors', collector2.value)
        })

        collectionPerTruck.forEach(collectionPTruck => {
            formData.append('collectionPerTruck', collectionPTruck.numOfTruck)
        })

        dispatch(updateCollectionPoint(collectionPoint._id, formData))
    }

	// collectors.forEach(collector => {
	// 	currentCollectors.forEach(collector2 => {
	// 		if(collector.value = collector2.collector) {
	// 			console.log(collector)
	// 			updateCollectors.push({value: collector.value, label: collector.label});
	// 		}
	// 	})
	// })


	const removeNumOfTruck = (massId) => {
		setCollectionPerTruck([])
		collectionPerTruck.forEach(collectionPTruck=>{
			if(collectionPTruck._id){
				if(collectionPTruck._id !== massId){
					setCollectionPerTruck(oldArray => [...oldArray, collectionPTruck])
				}
			}else{
				if(collectionPTruck.tempId !== massId){
					setCollectionPerTruck(oldArray => [...oldArray, collectionPTruck])
				}
			}
		
		})
	} 

	const addNumOfTruck = (e) =>{

		e.preventDefault()

		if(numOfTruck === 0){

			alert.error("Invalid input")

		}else{
			setCollectionPerTruck(oldArray => [...oldArray, {numOfTruck, type:collectionPoint&&collectionPoint.type, date:"pending...", tempId:cryptoRandomString({length: 20, type: 'url-safe'}) }])
			setNumOfTruck(0)
		}
	}

	let TotalTons = 0

	return(
		<Fragment>
		<MetaData title={`${collectionPoint.name}`} />
			<div className="bh-dashboard">
				<div>
					<Sidebar/>
				</div>
				<div className="bh-dashboard-section">
					<h5 className="py-2 px-3">Update Collection Schedule <i className="crud-id fw-light small user-select-all">({collectionPoint._id})</i></h5>
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
											<p>START TIME: <TimePicker type="text" className="form-control" value={startTime} onChange={setStartTime}/></p>
										</div>
										<div className="col">
											<p>END TIME: <TimePicker type="text" className="form-control" value={endTime} onChange={setEndTime}/></p>
										</div>
										<div className="col">
											<p>BARANGAY: <select className="form-select" value={barangay} onChange={(e) => setBarangay(e.target.value)}>
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
										      value={collectors2}
										      isMulti
										      options={collectors}
										    />

											</p>
										</div>
										<div className="col">
											<p>REPEAT:
												<div className="row row-cols-auto m-auto">
													<div className="col form-check">
														<input className="form-check-input" type="checkbox" value="Once" id="once" checked={repeats.includes("Once") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)) }}/>
														<label className="form-check-label" for="once">Once</label>
													</div>
													<div className="col form-check">
														<input className="form-check-input" type="checkbox" value="Every Sunday" id="every-sunday" checked={repeats.includes("Every Sunday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)) }}/>
														<label className="form-check-label" for="every-sunday">Every Sunday</label>
													</div>
													<div className="col form-check">
														<input className="form-check-input" type="checkbox" value="Every Monday" id="every-monday" checked={repeats.includes("Every Monday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)) }}/>
														<label className="form-check-label" for="every-monday">Every Monday</label>
													</div>
													<div className="col form-check">
														<input className="form-check-input" type="checkbox" value="Every Tuesday" id="every-tuesday" checked={repeats.includes("Every Tuesday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)) }}/>
														<label className="form-check-label" for="every-tuesday">Every Tuesday</label>
													</div>
													<div className="col form-check">
														<input className="form-check-input" type="checkbox" value="Every Wednesday" id="every-wedday" checked={repeats.includes("Every Wednesday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)) }}/>
														<label className="form-check-label" for="every-wedday">Every Wednesday</label>
													</div>
													<div className="col form-check">
														<input className="form-check-input" type="checkbox" value="Every Thursday" id="every-thursday" checked={repeats.includes("Every Thursday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)) }}/>
														<label className="form-check-label" for="every-thursday">Every Thursday</label>
													</div>
													<div className="col form-check">
														<input className="form-check-input" type="checkbox" value="Every Friday" id="every-friday" checked={repeats.includes("Every Friday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)) }}/>
														<label className="form-check-label" for="every-friday">Every Friday</label>
													</div>
													<div className="col form-check">
														<input className="form-check-input" type="checkbox" value="Every Saturday" id="every-saturday" checked={repeats.includes("Every Saturday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)) }}/>
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
																		<input className="form-check-input" type="checkbox" value="Sunday" id="sunday" checked={repeats.includes("Sunday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Sunday"]): delete customs[customs.indexOf("Sunday")] }}/>
																		<label className="form-check-label" for="sunday"> Sunday</label>
																	</div>
														        	<div className="col form-check" style={{ height:"40px"}}>
																		<input className="form-check-input" type="checkbox" value="Monday" id="monday" checked={repeats.includes("Monday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Monday"]): delete customs[customs.indexOf("Monday")] }}/>
																		<label className="form-check-label" for="monday"> Monday</label>
																	</div>
																	<div className="col form-check" style={{ height:"40px"}}>
																		<input className="form-check-input" type="checkbox" value="Tuesday" id="tuesday" checked={repeats.includes("Tuesday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Tuesday"]): delete customs[customs.indexOf("Tuesday")] }}/>
																		<label className="form-check-label" for="tuesday"> Tuesday</label>
																	</div>
																	<div className="col form-check" style={{ height:"40px"}}>
																		<input className="form-check-input" type="checkbox" value="Wednesday" id="wednesday" checked={repeats.includes("Wednesday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Wednesday"]): delete customs[customs.indexOf("Wednesday")] }}/>
																		<label className="form-check-label" for="wednesday"> Wednesday</label>
																	</div>
																	<div className="col form-check" style={{ height:"40px"}}>
																		<input className="form-check-input" type="checkbox" value="Thursday" id="thursday" checked={repeats.includes("Thursday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Thursday"]): delete customs[customs.indexOf("Thursday")] }}/>
																		<label className="form-check-label" for="thursday"> Thursday</label>
																	</div>
																	<div className="col form-check" style={{ height:"40px"}}>
																		<input className="form-check-input"  type="checkbox" value="Friday" id="friday" checked={repeats.includes("Friday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Friday"]): delete customs[customs.indexOf("Friday")] }}/>
																		<label className="form-check-label" for="friday"> Friday</label>
																	</div>
																	<div className="col form-check" style={{ height:"40px"}}>
																		<input className="form-check-input"  type="checkbox" value="Saturday" id="saturday" checked={repeats.includes("Saturday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Saturday"]): delete customs[customs.indexOf("Saturday")] }}/>
																		<label className="form-check-label" for="saturday"> Saturday</label>
																	</div>
														      </div>
														</HyperModal>

												</div>
											</p>
										</div>
										<div className="col">
											<p>COLLECTION POINTS: <textarea className="form-control" value={collectionPoints} onChange={(e) => setCollectionPoints(e.target.value)}/></p>
										</div>

											{collectionPerTruck&&collectionPerTruck.map((cl)=>{
												TotalTons += parseInt(cl.numOfTruck) 
											})}

										<div className="col">
											<small className="fw-bold" style={{float:"right"}}><h5>Total: <b>{TotalTons} <span style={{fontSize:"12px"}}><i>(Number of dump truck/s)</i></span></b></h5></small>
											Enter Total Collected Waste: 

											<div className="row" style={{margin:"12px"}}>
												<div className="col-md-8">
												<input type="number" placeholder="Number of dump truck\s" className="form-control" value={numOfTruck} onChange={(e) => setNumOfTruck(e.target.value)}/>
												<small><i>Number of dump truck/s</i></small>
												</div>
												<div className="col-md-4">
												<button type="button" onClick={addNumOfTruck} class="btn btn-success" style={{width:"100%"}}><b>Submit</b></button>
												</div>
											</div>

										
											
											{collectionPerTruck&&collectionPerTruck.map((collectionPTruck)=>{
												return(
														<Fragment>
																<div className="bh-comment showBtn" style={{background:"white", border:"1px solid #d3d3d3"}}>
																<i class="bi bi-x-circle" style={{float:"right"}} onClick={()=>{removeNumOfTruck(collectionPTruck&&collectionPTruck._id?collectionPTruck._id:collectionPTruck.tempId)} }></i>
																	<p className="fw-bold m-0">Total Number of Truck: <h4 style={{color:"red"}}><b>{collectionPTruck.numOfTruck}</b></h4></p>
																	<p className="m-0">{collectionPTruck.type}</p>
																	<small className="text-secondary float-end">{collectionPTruck&&collectionPTruck.date&&collectionPTruck.date === "pending..."? collectionPTruck.date:new Date(collectionPTruck&&collectionPTruck.date).toDateString()}</small>
																</div>
														</Fragment>
													)	
												}).reverse()
											}


										</div>


									</div>
								</div>
							</div>
						</div>
						<button className="btn bh-submitBtn m-3" type="submit">Save Changes</button>
					</form>
				</div>
			</div>
			
		</Fragment>
		)
}

export default SchedulesUpdate