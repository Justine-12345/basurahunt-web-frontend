import React, {Fragment, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Sidebar from '../../../components/layouts/sidebar';
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import Loader from '../../layouts/Loader'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getItems, deleteItem, clearErrors } from '../../../actions/itemActions'
import { DELETE_ITEM_RESET } from '../../../constants/itemConstants'
import MetaData from '../../../components/layouts/MetaData'

const DonationList = () => {

    const alert = useAlert();
    const dispatch = useDispatch();
    let navigate = useNavigate()
    const { loading, error, items } = useSelector(state => state.items);
    const { error: deleteError, isDeleted, loading:itemLoading } = useSelector(state => state.item)

    useEffect(() => {
        console.log(items)
        dispatch(getItems());

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors())
        }

        if (isDeleted) {
            navigate('/admin/donations');
            alert.success('Donation deleted successfully');
            dispatch({ type: DELETE_ITEM_RESET })
        }

    }, [dispatch, error, deleteError, alert, isDeleted, navigate]);

    const deleteItemHandler = (id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                    <h1>Are you sure?</h1>
                    <p>You want to delete this item?</p>
                    <button onClick={onClose}>No</button>
                    <button
                        onClick={() => {
                           dispatch(deleteItem(id));
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
        { title: "ID", field: "item_id" },
        { title: "Name", field: "name" },
        { title: "Barangay", field: "barangay_hall" },
        { title: "Donor", field: "donor" },
        { title: "Status", field: "status" },
        { title: "Actions", field: "actions" }
    ];

    const setItems = () => {
        let rows = []
        items.forEach((item)=>{
            rows.push({
                item_id: item._id,
                name: item.name,
                barangay_hall: item.barangay_hall,
                donor: item.user_id.first_name + " " + item.user_id.last_name,
                status: item.status,
                actions:
                <Fragment>
                    <span className="showBtn"><Link to={`/admin/donation/${item._id}`}><i className="bi bi-eye-fill table-icons"></i></Link></span>&nbsp;
                    <span className="update"><Link to={`/admin/donation/${item._id}/edit`}><i className="bi bi-pen-fill table-icons"></i></Link></span>&nbsp;
                    <span className="delete"><span onClick={() => deleteItemHandler(item._id)}><i className="bi bi-trash3-fill table-icons"></i></span></span>&nbsp;
                </Fragment>
            })
        })
        return rows
      }

      const setItemsForExport = () => {
        let rows = []
        items.forEach((item)=>{
            rows.push({
                item_id: item._id,
                name: item.name,
                barangay_hall: item.barangay_hall,
                donor: item.user_id.first_name + " " + item.user_id.last_name,
                status: item.status,
                actions:"---"
            })
        })
        return rows
      }



	return(
		<Fragment>
        <MetaData title={`Donations`} />
			<div className="bh-dashboard">
				<div>
					<Sidebar/>
				</div>
				<div className="bh-table" style={{width:"100%"}}>
                    {/*Material Table Docs Link : https://material-table.com/#/docs/get-started*/}
                    {loading||itemLoading?<Loader/>:
                    <MaterialTable
                        style={{fontSize:"12px"}}
                        columns={columns}
                        data={setItems()}
                        title="Donation Item Table"
                        options={{
							exportMenu: [
								{
								label: "Export CSV",
								//// You can do whatever you wish in this function. We provide the
								//// raw table columns and table data for you to modify, if needed.
								// exportFunc: (cols, datas) => console.log({ cols, datas })
								exportFunc: (cols, datas) =>
									ExportCsv(cols, setItemsForExport(), "BasuraHunt-DonationsReport")
								},
								{
								label: "Export PDF",
								exportFunc: (cols, datas) =>
								ExportPdf(cols, setItemsForExport(), "BasuraHunt-DonationsReport")
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
                                tooltip: 'Add Donation',
                                isFreeAction: true,
                                onClick: (event) => navigate('/admin/donation/new')
                            }
                        ]}
                    />
                    }
				</div>
			</div>
              
		</Fragment>
	)
}

export default DonationList