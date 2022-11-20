import React, { Fragment, useEffect, useState } from 'react';
import Sidebar from '../../../components/layouts/sidebar';
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { allUsers, updateUser, clearErrors, deleteUser } from '../../../actions/userActions'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../../layouts/Loader'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { DELETE_USER_RESET, UPDATE_USER_RESET } from '../../../constants/userConstants'
import MetaData from '../../../components/layouts/MetaData'


const UsersList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, users, error } = useSelector(state => state.allUsers)
  const { isDeleted, isUpdated, error: upDelError, loading: userLoading } = useSelector(state => state.user)


  let navigate = useNavigate()

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors)
    }

    if (isDeleted) {
      dispatch({ type: DELETE_USER_RESET })
      alert.success("User Deleted Successfully")
    }
    if (isUpdated) {
      dispatch({ type: UPDATE_USER_RESET })
      alert.success("User Updated Successfully")
    }

    dispatch(allUsers());

  }, [isDeleted, isUpdated, upDelError]);


  const columns = [
    { title: "Email", field: "email" },
    { title: "First Name", field: "first_name" },
    { title: "Last Name", field: "last_name" },
    { title: "House No.", field: "house_number" },
    { title: "Street", field: "street" },
    { title: "Barangay", field: "barangay" },
    { title: "Role", field: "role" },
    { title: "Action", field: "action" },
    { searchable: true, hidden: true, field: "roleHidden" },
    { searchable: true, hidden: true, field: "jobDescHidden" },
    { searchable: true, hidden: true, field: "idHidden" }
  ];


  const setUsers = () => {
    let rows = []
    users.forEach((user) => {
      rows.push({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        house_number: user.house_number,
        street: user.street,
        barangay: user.barangay,
        roleHidden: user.role,
        jobDescHidden: user.role === "garbageCollector" ? user.jobDesc : "",
        idHidden: user._id,
        role:
          <Fragment>
            <select value={user.role} onChange={(e) => updateRoleHandler(user._id, user.role, e.target.value, user.email)} className="form-select" style={{ fontSize: "12px", width: "130px" }}>
              <option value="newUser">newUser</option>
              <option value="user">user</option>
              <option value="administrator">administrator</option>
              <option value="barangayAdministrator">barangayAdministrator</option>
              <option value="garbageCollector">garbageCollector</option>
              <option value="banned">banned</option>
            </select>
          </Fragment>
        ,
        action:
          <Fragment>
            <span className="showBtn"><Link to={`/admin/user/${user._id}`}><i className="bi bi-eye-fill table-icons"></i></Link></span>&nbsp;
            <span className="update"><Link to={`/admin/user/${user._id}/edit`}><i className="bi bi-pen-fill table-icons"></i></Link></span>&nbsp;
            <span className="delete"><span onClick={() => deleteUserHandler(user._id)}><i className="bi bi-trash3-fill table-icons"></i></span></span>&nbsp;
          </Fragment>
      })
    })
    return rows
  }



  const setUsersExport = () => {
    let rows = []
    users.forEach((user) => {
      rows.push({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        house_number: user.house_number,
        street: user.street,
        barangay: user.barangay,
        roleHidden: user.role,
        idHidden: user._id,
        role: user.role,
        action: "---"
      })
    })
    return rows
  }

  const deleteUserHandler = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to delete this User?</p>
            <button onClick={onClose}>No</button>
            <button
              onClick={() => {
                dispatch(deleteUser(id))
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

  const updateRoleHandler = (id, old_role, new_role, email) => {
    let jobDesc
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui' style={{ height: "fit-content" }}>
            <h1>Are you sure?</h1>
            <p>You want to change <b>{email}</b> role from <b>{old_role}</b> to <b>{new_role}</b> ?</p>
            {new_role === "garbageCollector"?
              <div>
                <p className="m-0">Job Description</p>
                <select name="jobDesc" defaultValue={jobDesc} onChange={(e)=>{jobDesc = e.target.value}} className="form-select">
                  <option value="">---Select Job Desc---</option>
                  <option value="Collector">Collector</option>
                  <option value="Driver">Driver</option>
                  <option value="Sweeper">Sweeper</option>
                </select>
              </div>:""
            }
            <button onClick={onClose}>No</button>
            <button
              onClick={() => {
                console.log(jobDesc)
                if(new_role === "garbageCollector" && !jobDesc ){
                  alert.error('Please select job description')
                }else{
                  const formData = new FormData();
                  if(new_role === "garbageCollector"){
                    formData.set('jobDesc', jobDesc)
                  }
                  formData.set('role', new_role)
                  dispatch(updateUser(id, formData))
                  onClose();
                }

              

                
              }}
              
            >
              Yes, Change it!
            </button>
          </div>
        );
      }
    });
  }


  return (
    <Fragment>
      <MetaData title={"Users"} />
      <div className="bh-dashboard">
        <div>
          <Sidebar />
        </div>
        <div className="bh-table" style={{ width: "100%" }}>

          {loading || userLoading ? <Loader /> :

            <MaterialTable
              style={{ fontSize: "12px" }}
              columns={columns}
              data={setUsers()}
              title="Users Table"

              options={{
                exportMenu: [
                  {
                    label: "Export CSV",
                    //// You can do whatever you wish in this function. We provide the
                    //// raw table columns and table data for you to modify, if needed.
                    // exportFunc: (cols, datas) => console.log({ cols, datas })
                    exportFunc: (cols, datas) =>
                      ExportCsv(cols, setUsersExport(), "BasuraHunt-UsersReport")
                  },
                  {
                    label: "Export PDF",
                    exportFunc: (cols, datas) =>
                      ExportPdf(cols, setUsersExport(), "BasuraHunt-UsersReport")
                  }
                ],
                search: true,
                showTitle: true,
                isLoading: true,

                //exportDelimiter: '        ',
                headerStyle: { fontWeight: '700' }
              }}
            />
          }
        </div>
      </div>
    </Fragment>
  )
}

export default UsersList