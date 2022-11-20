import React, { Fragment, useEffect, useState } from 'react';
import Sidebar from '../../../components/layouts/sidebar';
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { updateDumpStatus, allDumps, updatedump, getSingleDump, clearErrors, deleteDump } from '../../../actions/dumpActions'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../../layouts/Loader'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { UPDATE_DUMP_STATUS_RESET, DELETE_DUMP_RESET, DUMP_DETAILS_RESET } from '../../../constants/dumpConstants'
import ReactStars from "react-rating-stars-component";
import MetaData from '../../../components/layouts/MetaData'

import cryptoRandomString from 'crypto-random-string';
import NotificationSender from '../../../notificationSender';

import { SOCKET_PORT } from '../../../constants/socketConstants'
import io from "socket.io-client";
const socket = io.connect(SOCKET_PORT);

const ReportsList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const [initLoading, setInitLoading] = useState(true)
  const { loading, dumps, error } = useSelector(state => state.allDumps)
  const { isDeleted, isUpdatedStatus, error: upDelError, loading: dumpLoading } = useSelector(state => state.dump)
  const { user } = useSelector(state => state.auth)

  let rate

  let navigate = useNavigate()

  useEffect(() => {

    if (error) {
      alert.error(error)
      dispatch(clearErrors)
    }

    dispatch(allDumps());

    if (!loading) {
      setInitLoading(false)
    }


  }, [dispatch, dumps, dumpLoading, isUpdatedStatus, isDeleted, upDelError]);

  useEffect(() => {
    if (isDeleted) {
      dispatch({ type: DELETE_DUMP_RESET })
      alert.success("Dump Deleted Successfully")
    }

    if (isUpdatedStatus) {


      dispatch({ type: UPDATE_DUMP_STATUS_RESET })
      alert.success("Dump Updated Successfully")
    }


  }, [isDeleted, isUpdatedStatus, upDelError])

  const columns = [
    { title: "Address", field: "complete_address" },
    { title: "Barangay", field: "barangay" },
    { title: "Types", field: "waste_type" },
    { title: "Size", field: "waste_size" },
    { title: "Acess", field: "accessible_by" },
    { title: "Status", field: "status" },
    { title: "Action", field: "action" },
    { searchable: true, hidden: true, field: "statusHidden" },
    { searchable: true, hidden: true, field: "idHidden" }
  ];
  let c = 0
  const setReports = () => {
    let rows = []
    dumps.forEach((dump) => {
      rows.push({
        complete_address: dump.complete_address,
        barangay: dump.barangay,
        waste_type:
          <Fragment>
            <ul>
              {dump.waste_type.map((wt) => {
                c += 1
                return (
                  <li key={wt.type + c}>{wt.type}</li>
                )
              })
              }
            </ul>
          </Fragment>

        ,
        waste_size: dump.waste_size? dump.waste_size:<span><i style={{color:"grey"}}>Unknown</i></span>,
        accessible_by: dump.accessible_by?dump.accessible_by:<span><i style={{color:"grey"}}>Unknown</i></span>,
        statusHidden: dump.status,
        idHidden: dump._id,
        status:
          <Fragment>
            { dump.status === "newReport"?
              <Fragment>
              <Link to={`/admin/report/${dump && dump._id}/${dump && dump.coordinates && dump.coordinates.longtitude}/${dump && dump.coordinates && dump.coordinates.latitude}/confirm/`} type="button" class="btn btn-success"  style={{fontSize:"10px"}}>Confirm</Link>&nbsp;
              <button onClick={(e) => updateRoleHandler(dump._id, dump.status, 'Rejected', dump.user_id, dump.chat_id.room, dump && dump)} type="button" class="btn btn-danger"  style={{fontSize:"10px"}}>Reject</button>
              </Fragment>:dump.status === "Confirmed"?
              <select value={dump.status} onChange={(e) => updateRoleHandler(dump._id, dump.status, e.target.value, dump.user_id, dump.chat_id.room, dump && dump)} className="form-select" style={{ fontSize: "12px", width: "130px" }}>
                <option value="Confirmed">Confirmed</option>
                <option value="Unfinish">Unfinish</option>
                <option value="Cleaned">Cleaned</option>
              </select>:dump.status === "Unfinish" || dump.status === "Cleaned" ?
              <select value={dump.status} onChange={(e) => updateRoleHandler(dump._id, dump.status, e.target.value, dump.user_id, dump.chat_id.room, dump && dump)} className="form-select" style={{ fontSize: "12px", width: "130px" }}>
                <option value="Unfinish">Unfinish</option>
                <option value="Cleaned">Cleaned</option>
              </select>:dump.status === "Rejected"?
              <p style={{color:"red", fontSize:"12px"}}><b>Rejected</b></p>:
              ""
            }
          </Fragment>
        ,
        action:
          <Fragment>
            <span className="showBtn"><Link to={`/admin/report/${dump && dump._id}/${dump && dump.coordinates && dump.coordinates.longtitude}/${dump && dump.coordinates && dump.coordinates.latitude}/`}><i className="bi bi-eye-fill table-icons"></i></Link></span>&nbsp;
            <span className="update"><Link to={`/admin/report/${dump && dump._id}/${dump && dump.coordinates && dump.coordinates.longtitude}/${dump && dump.coordinates && dump.coordinates.latitude}/edit/`}><i className="bi bi-pen-fill table-icons"></i></Link></span>&nbsp;
            <span className="delete"><span onClick={() => deleteDumpHandler(dump._id)}><i className="bi bi-trash3-fill table-icons"></i></span></span>&nbsp;
          </Fragment>
      })
    })
    return rows
  }

  const setReportsForExport = () => {
    let rows = []
    dumps.forEach((dump) => {
      rows.push({
        complete_address: dump.complete_address,
        barangay: dump.barangay,
        waste_type: dump.waste_type.map((wt) => {
          return wt.type
        })
        ,
        waste_size: dump.waste_size,
        accessible_by: dump.accessible_by,
        statusHidden: dump.status,
        idHidden: dump._id,
        status: dump.status
        ,
        action: "---"
      })
    })
    return rows
  }
  const deleteDumpHandler = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to delete this Dump?</p>
            <button onClick={onClose}>No</button>
            <button
              onClick={() => {
                dispatch(deleteDump(id))
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

  const updateRoleHandler = (id, old_status, new_status, user, room, dump) => {



    confirmAlert({
      customUI: ({ onClose }) => {
        rate = 0
        return (
          <div className='custom-ui' style={{ height: "fit-content" }}>
            <h1>Are you sure?</h1>
            <p>You want to change the status from <b>{old_status}</b> to <b>{new_status}</b> ?</p>

            {new_status === "Cleaned" && <div style={{ width: "fit-content", margin: "auto" }}>
              Rate <i>'{user.first_name} {user.last_name}'</i>
              <ReactStars
                {...{
                  size: 50,
                  value: 0,
                  edit: true,
                  onChange: newValue => {
                    rate = newValue;
                  }
                }}
              />
            </div>}

            {new_status !== "Cleaned" ?
              <Fragment>
                <button onClick={onClose}>No</button>
                <button
                  onClick={() => {
                    let notifCode = cryptoRandomString({ length: 20, type: 'url-safe' })
                   
                    const formData = new FormData();
                    formData.set('old_status', old_status)
                    formData.set('new_status', new_status)
                    formData.set('rate', rate)
                    formData.set('notifCode', notifCode);
                    dispatch(updateDumpStatus(id, formData))

                    socket.emit("join_room", room)
                    const messageData = {
                      room: room,
                      message: new_status,
                      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
                      type: "status"
                    }
                    socket.emit("send_message", messageData);


                    let notifTitle
                    if (new_status === "Confirmed") {
                      notifTitle = "Your reported illegal dump has been confirmed by the admin"
                    } if (new_status === "Unfinish") {
                      notifTitle = "Your Reported Illegal Dump Is Unfinish"
                    } if (new_status === "Cleaned") {
                      notifTitle = "Congratulation Your Reported Illegal Dump Is Already Cleaned"
                    } if (new_status === "newReport") {
                      notifTitle = "Your Reported Illegal Dumps is Pending"
                    } if (new_status === "Rejected") {
                      notifTitle = "Your Reported Illegal Dumps is Rejected"
                    }
                    
                    NotificationSender(notifTitle, user._id, dump.user_id._id, dump.barangay, 'illegalDump-update-status', notifCode, dump && dump)
                  
                    onClose();
                  }}
                >
                  Yes, Change it!
                </button>
              </Fragment>
              :
              <Fragment>
                <button onClick={onClose}>No</button>
                <button
                  onClick={() => {
                    let notifCode = cryptoRandomString({ length: 20, type: 'url-safe' })
                    let notifCode1 = cryptoRandomString({ length: 20, type: 'url-safe' })
                    const formData = new FormData();
                    formData.set('old_status', old_status)
                    formData.set('new_status', new_status)
                    formData.set('rate', rate)
                    formData.set('notifCode', notifCode);
                    formData.set('notifCode1', notifCode1);

                    if (rate === undefined || rate === 0) {
                      alert.show("Please Rate Before You Submit")
                    } else {
                      dispatch(updateDumpStatus(id, formData))

                      socket.emit("join_room", room)
                      const messageData = {
                        room: room,
                        message: new_status,
                        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
                        type: "status"
                      }
                      socket.emit("send_message", messageData);


                      let notifTitle
                      if (new_status === "Confirmed") {
                        notifTitle = "Your Reported Illegal Dump Has Been Confirmed By The Admin"
                      } if (new_status === "Unfinish") {
                        notifTitle = "Your Reported Illegal Dump Is Unfinish"
                      } if (new_status === "Cleaned") {
                        notifTitle = "Congratulation Your Reported Illegal Dump Is Already Cleaned"
                      } if (new_status === "newReport") {
                        notifTitle = "Your Reported Illegal Dumps is Pending"
                      }if (new_status === "Rejected") {
                        notifTitle = "Your Reported Illegal Dumps is Rejected"
                    }

                    NotificationSender(notifTitle, user._id, dump.user_id._id, dump.barangay, 'illegalDump-update-status', notifCode, dump && dump)

                    if(dump.user_id.role === "newUser" && new_status === "Cleaned"){
                      const notifTitle1 = "Congratulation you are now a verified user."
                      NotificationSender(notifTitle1, user._id, dump.user_id._id, dump.barangay, 'user-verified', notifCode1, dump && dump)
                    }
                    
                      onClose();
                    }

                  }}
                >
                  Submit Rating!
                </button>
              </Fragment>
            }


          </div>
        );
      }
    });
  }


  return (
    <Fragment>
      <MetaData title={`Reports`} />
      <div className="bh-dashboard">
        <div>
          <Sidebar />
        </div>
        <div className="bh-table" style={{ width: "100%" }}>
          {/*Material Table Docs Link : https://material-table.com/#/docs/get-started*/}

          {initLoading || dumpLoading ? <Loader /> :

            <MaterialTable
              style={{ fontSize: "12px" }}
              columns={columns}
              data={setReports()}
              title="Dumps Table"
              options={{
                exportMenu: [
                  {
                    label: "Export CSV",
                    //// You can do whatever you wish in this function. We provide the
                    //// raw table columns and table data for you to modify, if needed.
                    // exportFunc: (cols, datas) => console.log({ cols, datas })
                    exportFunc: (cols, datas) =>
                      ExportCsv(cols, setReportsForExport(), "BasuraHunt-IllegalDumpsReport")
                  },
                  {
                    label: "Export PDF",
                    exportFunc: (cols, datas) =>
                      ExportPdf(cols, setReportsForExport(), "BasuraHunt-IllegalDumpsReport")
                  }
                ],
                search: true,
                showTitle: true,
                isLoading: true,

                //exportDelimiter: '        ',
                headerStyle: { fontWeight: '700' }
              }}
              actions={[
                {
                  icon: 'add',
                  tooltip: 'Add User',
                  isFreeAction: true,
                  onClick: (event) => navigate("/admin/report/new")
                }
              ]}
            />
          }
        </div>
      </div>
    </Fragment>

  )
}

export default ReportsList