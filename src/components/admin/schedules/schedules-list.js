import React, {Fragment, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Sidebar from '../../../components/layouts/sidebar';
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import Loader from '../../layouts/Loader'
import MetaData from '../../../components/layouts/MetaData'
	
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getCollectionPoints, deleteCollectionPoint, clearErrors } from '../../../actions/collectionPointActions'
import { DELETE_COLLECTION_POINT_RESET } from '../../../constants/collectionPointConstants'


const SchedulesList = () => {
	const alert = useAlert();
    const dispatch = useDispatch();
    let navigate = useNavigate()
    const { loading, error, collectionPoints } = useSelector(state => state.collectionPoints);
    const { error: deleteError, isDeleted, loading:cPLoading} = useSelector(state => state.collectionPoint);

    useEffect(() => {
        dispatch(getCollectionPoints());

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors())
        }

        if (isDeleted) {
            navigate('/admin/schedules');
            alert.success('Schedule deleted successfully');
            dispatch({ type: DELETE_COLLECTION_POINT_RESET })
        }

    }, [dispatch, error, navigate, alert, deleteError, isDeleted]);

	const deleteScheduleHandler = (id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                    <h1>Are you sure?</h1>
                    <p>You want to delete this item?</p>
                    <button onClick={onClose}>No</button>
                    <button
                        onClick={() => {
                           dispatch(deleteCollectionPoint(id));
                        onClose();
                        }}
                    >
                        Yes, Delete it!
                    </button>
                    </div>
                );
            }
       });
   }

	const columns =[
		{ title: "ID", field: "collectionPoint_id" },
        { title: "Name", field: "name" },
        { title: "Time", field: "time" },
        { title: "Barangay", field: "barangay" },
		{ title: "Type", field: "type" },
        { title: "Status", field: "status" },
		{ title: "Collection Point", field: "collectionPoint" },
        { title: "Actions", field: "actions" }
    ];

	const setSchedules = () => {
		let rows = []
		collectionPoints.forEach((collectionPoint)=>{
			const startTimeArray = collectionPoint.startTime.split(":");
			const endTimeArray = collectionPoint.endTime.split(":");
			var ampmStartTime = startTimeArray[0] >= 12 ? 'PM' : 'AM';
			var ampmEndTime = endTimeArray[0] >= 12 ? 'PM' : 'AM';
			const hoursStartTime = (startTimeArray[0] % 12) == 0 ? 12 : startTimeArray[0] % 12;
			const minutesStartTime = startTimeArray[1];
			const hoursEndTime = (endTimeArray[0] % 12) == 0 ? 12 : endTimeArray[0] % 12;
			const minutesEndTime = endTimeArray[1];

			console.log(startTimeArray[0] % 12)

			rows.push({
				collectionPoint_id: collectionPoint._id,
				name: collectionPoint.name,
				time: hoursStartTime + ":" + minutesStartTime + " " + ampmStartTime + "-" + hoursEndTime + ":" + minutesEndTime + " " + ampmEndTime,
				barangay: collectionPoint.barangay,
				type: collectionPoint.type,
				status: collectionPoint.status,
				collectionPoint: collectionPoint.collectionPoint,
				actions:
				<Fragment>
					<span className="showBtn"><Link to={`/admin/schedule/${collectionPoint._id}`}><i className="bi bi-eye-fill table-icons"></i></Link></span>&nbsp;
					<span className="update"><Link to={`/admin/schedule/${collectionPoint._id}/edit`}><i className="bi bi-pen-fill table-icons"></i></Link></span>&nbsp;
					<span className="delete"><span onClick={() => deleteScheduleHandler(collectionPoint._id)}><i className="bi bi-trash3-fill table-icons"></i></span></span>&nbsp;
				</Fragment>
			})
		})
		return rows
	}



	const setSchedulesForExport = () => {
		let rows = []
		collectionPoints.forEach((collectionPoint)=>{
			const startTimeArray = collectionPoint.startTime.split(":");
			const endTimeArray = collectionPoint.endTime.split(":");
			var ampmStartTime = startTimeArray[0] >= 12 ? 'PM' : 'AM';
			var ampmEndTime = endTimeArray[0] >= 12 ? 'PM' : 'AM';
			const hoursStartTime = (startTimeArray[0] % 12) == 0 ? 12 : startTimeArray[0] % 12;
			const minutesStartTime = startTimeArray[1];
			const hoursEndTime = (endTimeArray[0] % 12) == 0 ? 12 : endTimeArray[0] % 12;
			const minutesEndTime = endTimeArray[1];

			console.log(startTimeArray[0] % 12)

			rows.push({
				collectionPoint_id: collectionPoint._id,
				name: collectionPoint.name,
				time: hoursStartTime + ":" + minutesStartTime + " " + ampmStartTime + "-" + hoursEndTime + ":" + minutesEndTime + " " + ampmEndTime,
				barangay: collectionPoint.barangay,
				type: collectionPoint.type,
				status: collectionPoint.status,
				collectionPoint: collectionPoint.collectionPoint,
				actions:"---"
			})
		})
		return rows
	}


	return(
		<Fragment>
		<MetaData title={`Schedules`} />
			<div className="bh-dashboard">
				<div>
					<Sidebar/>
				</div>
				<div className="bh-table" style={{width:"100%"}}>
					{/*Material Table Docs Link : https://material-table.com/#/docs/get-started*/}
					{loading||cPLoading?<Loader/>:
					<MaterialTable
						style={{fontSize:"12px"}}
						columns={columns}
						data={setSchedules()}
						title="Collection Point Schedule Table"
						options={{
							exportMenu: [
								{
								label: "Export CSV",
								//// You can do whatever you wish in this function. We provide the
								//// raw table columns and table data for you to modify, if needed.
								// exportFunc: (cols, datas) => console.log({ cols, datas })
								exportFunc: (cols, datas) =>
									ExportCsv(cols, setSchedulesForExport(), "BasuraHunt-SchedulesReport")
								},
								{
								label: "Export PDF",
								exportFunc: (cols, datas) =>
								ExportPdf(cols, setSchedulesForExport(), "BasuraHunt-ScheduleReport")
								}
							],
							search: true,
							showTitle: true,
							isLoading: true,

							//exportDelimiter: '        ',
							headerStyle:{fontWeight:'700'}
						}}
						actions={[
							{
								icon: 'add',
								tooltip: 'Add Schedule',
								isFreeAction: true,
								onClick: (event) => navigate('/admin/schedule/new')
							}
						]}
		        	/>
		        }
				</div>
			</div>
		</Fragment>
	)
}

export default SchedulesList