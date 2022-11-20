import React, {Fragment, useEffect, useState} from 'react';
import { Link, useParams, useNavigate} from 'react-router-dom';
import Sidebar from '../../../components/layouts/sidebar';
import TimePicker from 'react-time-picker';
import Select from 'react-select'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import HyperModal from 'react-hyper-modal';
import { getCollectionPointDetails, clearErrors } from '../../../actions/collectionPointActions'
import MetaData from '../../../components/layouts/MetaData'
	
const SchedulesView = () => {
	const [customs, setCustoms] = useState([]);
	const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
	const [repeats, setRepeats] = useState([]);
	const [collectors2, setCollectors2] = useState([]);
	const [collectionPerTruck, setCollectionPerTruck] = useState([]);


	const alert = useAlert();
    const dispatch = useDispatch();
    let navigate = useNavigate()
    const { error, collectionPoint } = useSelector(state => state.collectionPointDetails);
	const { isUpdated } = useSelector(state => state.collectionPoint);
	const { error: collectorError, collectors } = useSelector(state => state.collectors);
	let { id } = useParams();

	const [repeatList, setRepeatList] = useState([]);

	useEffect(() => {

		if (collectionPoint && collectionPoint._id !== id || isUpdated) {
			dispatch(getCollectionPointDetails(id));
		} else {
			setStartTime(collectionPoint.startTime);
            setEndTime(collectionPoint.endTime);
			
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
		setCollectors2([])
		console.log(collectionPoint && collectionPoint.collectors)
		collectionPoint && collectionPoint.collectors && collectionPoint.collectors.forEach(collector => {
			// console.log(collector.collector._id === undefined)
			if(collector.collector !== null){
				setCollectors2(oldArray => [...oldArray, {value: collector.collector._id, label: collector.collector.first_name + " " + collector.collector.last_name}])
			}
			 
		})

		console.log(collectionPoint && collectionPoint)
		setCollectionPerTruck([])
		collectionPoint && collectionPoint.collectionPerTruck && collectionPoint.collectionPerTruck.forEach(collectionPTruck=>{
			setCollectionPerTruck(oldArray => [...oldArray, collectionPTruck])
		})

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

    }, [dispatch, collectionPoint, error, alert]);

    useEffect(()=>{
    	dispatch(getCollectionPointDetails(id));
    },[id])

	const repeatListCheck = repeatList.includes("Sunday") || repeatList.includes("Monday") || repeatList.includes("Tuesday") || repeatList.includes("Wednesday") || repeatList.includes("Thursday") || repeatList.includes("Friday") || repeatList.includes("Saturday");
	console.log(repeatListCheck)
	console.log(repeatList)

	let TotalTons = 0

	return(
		<Fragment>
		<MetaData title={`${collectionPoint.name}`} />
			<div className="bh-dashboard">
				<div>
					<Sidebar/>
				</div>
				<div className="bh-dashboard-section">
					<h5 className="py-2 px-3">Collection Schedule <i className="crud-id fw-light small user-select-all">({collectionPoint._id})</i></h5>
					<hr/>
					<div className="contents">
						<div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 m-auto">
							<div className="col">
								<div className="row row-cols-1">
									<div className="col">
										<p>TRUCK NUMBER/LANDFILLS NAME: <input disabled type="text" className="form-control" value={collectionPoint.name}/></p>
									</div>
									<div className="col">
											<p>START TIME: <TimePicker disabled type="text" className="form-control" value={startTime} onChange={setStartTime}/></p>
										</div>
										<div className="col">
											<p>END TIME: <TimePicker disabled type="text" className="form-control" value={endTime} onChange={setEndTime}/></p>
										</div>
									<div className="col">
										<p>BARANGAY: <select disabled className="form-select" value={collectionPoint.barangay}>
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
										<p>TYPE: <select disabled className="form-select" value={collectionPoint.type}>
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
												isDisabled="true"
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
													<input disabled className="form-check-input" type="checkbox" value="" id="once" checked={repeats.includes("Once") ? true : ""}/>
													<label className="form-check-label" for="once">Once</label>
												</div>
												<div className="col form-check">
													<input disabled className="form-check-input" type="checkbox" value="" id="every-sunday" checked={repeats.includes("Every Sunday") ? true : ""}/>
													<label className="form-check-label" for="every-sunday">Every Sunday</label>
												</div>
												<div className="col form-check">
													<input disabled className="form-check-input" type="checkbox" value="" id="every-monday" checked={repeats.includes("Every Monday") ? true : ""}/>
													<label className="form-check-label" for="every-monday">Every Monday</label>
												</div>
												<div className="col form-check">
													<input disabled className="form-check-input" type="checkbox" value="" id="every-tuesday" checked={repeats.includes("Every Tuesday") ? true : ""}/>
													<label className="form-check-label" for="every-tuesday">Every Tuesday</label>
												</div>
												<div className="col form-check">
													<input disabled className="form-check-input" type="checkbox" value="" id="every-wedday" checked={repeats.includes("Every Wednesday") ? true : ""}/>
													<label className="form-check-label" for="every-wedday">Every Wednesday</label>
												</div>
												<div className="col form-check">
													<input disabled className="form-check-input" type="checkbox" value="" id="every-thursday" checked={repeats.includes("Every Thursday") ? true : ""}/>
													<label className="form-check-label" for="every-thursday">Every Thursday</label>
												</div>
												<div className="col form-check">
													<input disabled className="form-check-input" type="checkbox" value="" id="every-friday" checked={repeats.includes("Every Friday") ? true : ""}/>
													<label className="form-check-label" for="every-friday">Every Friday</label>
												</div>
												<div className="col form-check">
													<input disabled className="form-check-input" type="checkbox" value="" id="every-saturday" checked={repeats.includes("Every Saturday") ? true : ""}/>
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
														      		<h2>Custom day(s)</h2>
																	<div className="col form-check" style={{ height:"40px"}}>
																		<input disabled className="form-check-input" type="checkbox" value="Sunday" id="sunday" checked={repeats.includes("Sunday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Sunday"]): delete customs[customs.indexOf("Sunday")] }}/>
																		<label className="form-check-label" for="sunday"> Sunday</label>
																	</div>
														        	<div className="col form-check" style={{ height:"40px"}}>
																		<input disabled className="form-check-input" type="checkbox" value="Monday" id="monday" checked={repeats.includes("Monday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Monday"]): delete customs[customs.indexOf("Monday")] }}/>
																		<label className="form-check-label" for="monday"> Monday</label>
																	</div>
																	<div className="col form-check" style={{ height:"40px"}}>
																		<input disabled className="form-check-input" type="checkbox" value="Tuesday" id="tuesday" checked={repeats.includes("Tuesday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Tuesday"]): delete customs[customs.indexOf("Tuesday")] }}/>
																		<label className="form-check-label" for="tuesday"> Tuesday</label>
																	</div>
																	<div className="col form-check" style={{ height:"40px"}}>
																		<input disabled className="form-check-input" type="checkbox" value="Wednesday" id="wednesday" checked={repeats.includes("Wednesday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Wednesday"]): delete customs[customs.indexOf("Wednesday")] }}/>
																		<label className="form-check-label" for="wednesday"> Wednesday</label>
																	</div>
																	<div className="col form-check" style={{ height:"40px"}}>
																		<input disabled className="form-check-input" type="checkbox" value="Thursday" id="thursday" checked={repeats.includes("Thursday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Thursday"]): delete customs[customs.indexOf("Thursday")] }}/>
																		<label className="form-check-label" for="thursday"> Thursday</label>
																	</div>
																	<div className="col form-check" style={{ height:"40px"}}>
																		<input disabled className="form-check-input"  type="checkbox" value="Friday" id="friday" checked={repeats.includes("Friday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Friday"]): delete customs[customs.indexOf("Friday")] }}/>
																		<label className="form-check-label" for="friday"> Friday</label>
																	</div>
																	<div className="col form-check" style={{ height:"40px"}}>
																		<input disabled className="form-check-input"  type="checkbox" value="Saturday" id="saturday" checked={repeats.includes("Saturday") ? true : ""} onChange={(e) => {e.target.checked ? setRepeats(oldArray => [...oldArray, e.target.value]):setRepeats(repeats.filter(item => item !== e.target.value)); e.target.checked?setCustoms([...customs,"Saturday"]): delete customs[customs.indexOf("Saturday")] }}/>
																		<label className="form-check-label" for="saturday"> Saturday</label>
																	</div>
														      </div>
														</HyperModal>
											</div>
										</p>
									</div>
									<div className="col">
										<p>COLLECTION POINTS: <textarea disabled className="form-control" value={collectionPoint.collectionPoint}/></p>
									</div>
									{collectionPerTruck&&collectionPerTruck.map((cl)=>{
												TotalTons += parseInt(cl.numOfTruck) 
											})}
									<div className="col">
											<p>
											<small className="fw-bold" style={{float:"right"}}><h5>Total: <b>{TotalTons} <span style={{fontSize:"12px"}}><i>(Number of dump truck/s)</i></span></b></h5></small>
											Enter Total Collected Waste: 
											</p>
											
											
											{collectionPerTruck&&collectionPerTruck.map((collectionPTruck)=>{
												return(
														<Fragment>
																<div className="bh-comment" style={{background:"white", border:"1px solid #d3d3d3"}}>
																
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
					<hr className="mb-auto"/>
					<Link to={"/admin/schedule/" + collectionPoint._id + "/edit"} className="btn bh-submitBtn m-3">Edit</Link>
				</div>
			</div>
		</Fragment>
		)
}

export default SchedulesView