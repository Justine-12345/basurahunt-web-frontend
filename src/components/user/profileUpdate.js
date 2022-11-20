import React, {Fragment, useEffect, useState} from 'react';
import SidebarUser from '../../components/layouts/sidebar-user';
import SidebarBarangay from '../../components/layouts/sidebar-barangay';
import SidebarCollector from '../../components/layouts/sidebar-collector';
import Sidebar from '../../components/layouts/sidebar';
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile, loadUser, clearErrors} from '../../actions/userActions'
import { Link, useNavigate, useParams} from 'react-router-dom'
import LoaderNoBg from '../layouts/LoaderNoBg'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { UPDATE_USER_RESET, USER_DETAILS_RESET} from '../../constants/userConstants'
import imageCompression from 'browser-image-compression';

const ProfileUpdate = () => {

	const alert = useAlert();
    const dispatch = useDispatch();
    let navigate = useNavigate() 

    const {  error, isUpdated, loading:updateLoading, user:updatedUser} = useSelector(state => state.user)
    const {user, loading } = useSelector(state => state.auth)

    const [first_name, setFirst_name] = useState('')
    const [middle_name, setMiddle_name] = useState('')
    const [last_name, setLast_name] = useState('')
    const [suffix, setSuffix] = useState('')
    const [birthday, setBirthday] = useState('')
    const [phone_number, setPhone_number] = useState('')
    const [gender, setGender] = useState('')

    const [house_number, setHouse_number] = useState('')
    const [street, setStreet] = useState('')
    const [barangay, setBarangay] = useState('')

    const [email, setEmail] = useState('')
    const [alias, setAlias] = useState('')

    const [availableEmail, setAvailableEmail ] = useState(null)

    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')

    useEffect(()=>{

  
       if(!user || isUpdated){
       	 dispatch(loadUser());
   	   }
   	else{
   	   setFirst_name(user&&user.first_name);
	      setMiddle_name(user&&user.middle_name);
	      setLast_name(user&&user.last_name)
		   setSuffix(user&&user.suffix)
		   setBirthday(user&&user.birthday)
		   setPhone_number(user&&user.phone_number)
		   setGender(user&&user.gender)

		   setHouse_number(user&&user.house_number)
		   setStreet(user&&user.street)
		   setBarangay(user&&user.barangay)

		   setEmail(user&&user.email)
		   setAlias(user&&user.alias)
		   setAvatarPreview(user&&user.avatar&&user.avatar.url);
   	   }
   	
   	if(error){
         alert.error(error)
      }  


   	if(isUpdated){
       	 dispatch({type: UPDATE_USER_RESET})
       	 dispatch({type: USER_DETAILS_RESET})
       	 alert.success('User updated successfully')
    	if(user&&user.role === "barangayAdministrator"){
      		navigate('/barangay/profile')
	    }
	    if(user&&user.role === "garbageCollector"){
      		navigate('/collector/profile')
	    }
	    if(user&&user.role === "administrator"){
	     	navigate(`/admin/profile`)
	    }
	    if(user&&user.role === "user" || user&&user.role === "newUser"){
	     	navigate(`/username`)
	    }
      }


       // console.log("id",id)
       // console.log(user)

     
       // console.log("first_name", first_name)
       // console.log("userDumps",userDumps.success)
       // console.log("userDonatedItems",userDonatedItems)
  
      
       	
    }, [dispatch, user, error, isUpdated, updateLoading, loading, alert, navigate]);


    const onChange = async (e) => {
        if (e.target.name === 'avatar') {

            const fileType = e.target.files[0].type.split("/")[0]

            if(fileType === "image"){

                const imageFile = e.target.files[0]

                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                }

                 try {
                    const compressedFile = await imageCompression(imageFile, options);

                     const reader = new FileReader();
                        reader.onload = () => {
                            if (reader.readyState === 2) {
                                setAvatarPreview(reader.result)
                                setAvatar(reader.result)
                            }
                        }
                        reader.readAsDataURL(compressedFile)

                  } catch (error) {
                    console.log(error);
                  }
               
            }
            else{
                setAvatarPreview("/images/default_avatar.jpg")
                setAvatar("")
                fileType?alert.error(`${fileType} are not accept, Upload Image only For Profile Picture`):alert.error(`This are not accept, Upload Image only For Profile Picture`)
                
            }



        }
    
    }

	const getAge = (d1, d2) => {
        d2 = d2 || new Date();
        var diff = d2.getTime() - d1.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }

    const submitHandler = (e) => {
        e.preventDefault();
      	const formData = new FormData();
		
		if(getAge(new Date(birthday))<18){
			alert.error("You Must be 18 years old or above")
		}else{
      	formData.set('first_name',first_name)
		formData.set('middle_name',middle_name)
		formData.set('last_name',last_name)
		formData.set('suffix',suffix)
		formData.set('birthday',birthday)
		formData.set('phone_number',phone_number)
		formData.set('gender',gender)
		formData.set('house_number',house_number)
		formData.set('street',street)
		formData.set('barangay',barangay)
		formData.set('email',email)
		formData.set('alias',alias)
		formData.set('avatar', avatar);

      	dispatch(updateProfile(formData))
		}
    }


	return(
		<Fragment>
				<div className="bh-dashboard">
				<div>
	
		       	 {user&&user.role === "administrator"?
		       	 	<Sidebar/>:
		       	  user&&user.role === "newUser" || user&&user.role === "user"?
		       	  	<SidebarUser/>:
		       	  user&&user.role === "barangayAdministrator"?
		       	  	<SidebarBarangay/>:
		       	  user&&user.role === "garbageCollector"?
		       	   	<SidebarCollector/>:""
		       	 }

					
				</div>
				<div className="bh-dashboard-section">
						<h5 className="py-2 px-3">
						Update User Information</h5>
						<hr className="m-0"/>

						{updateLoading||loading?<LoaderNoBg/>:
						<form onSubmit={submitHandler}>
						<div className="contents">
							<p className="section">Account</p>
							<div className="account">
								<div className="row m-auto">
									<div className="col-lg-auto col-sm-12 m-auto">
										<div className="account-img mb-1" style={{backgroundImage: `url(${avatarPreview})`}}></div>
										<input name="avatar" onChange={onChange} style={{position:"relative", zIndex:"100"}} type="file" className="form-control" accept="image/*"/>
									</div>
										<p></p><p></p><p></p>
									<div className="col-lg-9 col-sm-12 m-auto">
										<div className="row row-cols-lg-4 row-cols-md-4 row-cols-2">
											<div className="col">EMAIL:</div>
											<div className="col fw-bold"><input defaultValue={email} onChange={(e)=>{setEmail(e.target.value)}} className="form-control" type="email" required/></div>
											<div className="col">ALIAS/USERNAME:</div>
											<div className="col fw-bold"><input defaultValue={alias} onChange={(e)=>{setAlias(e.target.value)}} className="form-control" type="text" required/></div>
										
										</div>
									</div>
								</div>
							</div>
							
							<p className="section">Personal</p>
							<div className="row row-cols-lg-4 row-cols-md-4 row-cols-2 m-auto">
								<div className="col">FIRST NAME:</div>
								<div className="col fw-bold"><input defaultValue={first_name} onChange={(e)=>{setFirst_name(e.target.value)}} className="form-control" type="text" required/></div>
								<div className="col">MIDDLE NAME:</div>
								<div className="col fw-bold"><input defaultValue={middle_name} onChange={(e)=>{setMiddle_name(e.target.value)}} className="form-control" type="text" required/></div>
								<div className="col">LAST NAME:</div>
								<div className="col fw-bold"><input defaultValue={last_name} onChange={(e)=>{setLast_name(e.target.value)}} className="form-control" type="text" required/></div>
								<div className="col">SUFFIX:</div>
								<div className="col fw-bold"><input defaultValue={suffix} onChange={(e)=>{setSuffix(e.target.value)}} className="form-control" type="text" /></div>
								<div className="col">BIRTHDATE:</div>
								<div className="col fw-bold"><input defaultValue={birthday&&birthday.substring(0,10)} onChange={(e)=>{ setBirthday(e.target.value)}} className="form-control" type="date" required/></div>
								<div className="col">GENDER:</div>
								<div className="col fw-bold">

								<select value={gender} onChange={(e)=>{setGender(e.target.value)}} className="form-select" required>
				                    <option value="Male">MALE</option>
									<option value="Female">FEMALE</option>
									<option value="Rather not say">RATHER NOT SAY</option>
								</select></div>
								<div className="col">PHONE NUMBER:</div>
								<div className="col fw-bold">
								<PhoneInput
                                  onlyCountries={['ph']}
								  masks={{ph: '...-....-...'}}
                                  placeholder="+63 ...-....-..."
								  value={phone_number} 
                                  onChange={(phone)=>setPhone_number(phone)}
								  country={'ph'}
								  required
								/>
								</div>
							</div>

							{user&&user.role !== 'barangayAdministrator' && user.role !== 'garbageCollector'?
							<Fragment>	
							<p className="section">Address</p>
							<div className="row row-cols-lg-4 row-cols-md-4 row-cols-2 m-auto">
									<div className="col">HOUSE NUMBER:</div>
									<div className="col fw-bold"><input onChange={(e)=>{setHouse_number(e.target.value)}} defaultValue={house_number} className="form-control" type="text" required/></div>
									<div className="col">STREET/BUILDING:</div>
									<div className="col fw-bold"><input onChange={(e)=>{setStreet(e.target.value)}} defaultValue={street} className="form-control" type="text" required/></div>
									<div className="col">BARANGAY:</div>
									<div className="col fw-bold">
									<select value={barangay} onChange={(e)=>{setBarangay(e.target.value)}} className="form-select" required>
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
									</select></div>
								</div>
							</Fragment>:""
						}

									
						</div>
						<hr className="m-0"/>
						<button className="btn bh-submitBtn" type="submit">Save Changes</button>
					</form>
					}

				</div>
			</div>
		</Fragment>
		)
}

export default ProfileUpdate