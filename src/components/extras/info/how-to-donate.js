import React, {Fragment} from 'react';
import SidebarUser from '../../../components/layouts/sidebar-user';
import SidebarBarangay from '../../../components/layouts/sidebar-barangay';
import SidebarCollector from '../../../components/layouts/sidebar-collector';
import Sidebar from '../../../components/layouts/sidebar';
import { useSelector } from 'react-redux'

const HowToDonate = () => {
	const {user } = useSelector(state => state.auth)
	return(
		<Fragment>
			<div className="bh-container">
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
				<div className="bh-container-3">
					<div className="info">
						<h2>How to Donate?</h2>
						<p className="fs-5 mx-xl-5">
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Donating is one of the best examples of unity towards other people, it brings hope and a future 
							for the people. Giving is not only beneficial to the people who received it, but it also gives those 
							people who give the best impact, experience, and lesson in their life, which is joy. Seeing those 
							people smile when we give even the smallest amount will melt our hearts and it gives us the 
							inspiration to help for their brighter future.
							One of the application's target goal is to assist the residents in Taguig City who needs assistance 
							for their specific necessities such as education, work, health, and personal needs. With the help 
							of our application, we can develop harmony among people, and that may ease the personal 
							problem of residents of Taguig City. With these following steps we can give and donate our 
							things to other people:
						</p>
						<ol className="fs-5 mx-xl-5">
							<li>Click the <i>Donate Items</i> tab under the <i>Donation</i> tab.
								<img className="img-fluid" src='https://res.cloudinary.com/basurahunt/image/upload/v1662996482/BasuraHunt/Static/about-info/how-to-donate-1_zodf45.png'/>
							</li>
							<li>Upload or capture photos of what you want to donate. Minimum of 1 photo and maximum of 5 photos.
								<img className="img-fluid" src='https://res.cloudinary.com/basurahunt/image/upload/v1662996482/BasuraHunt/Static/about-info/how-to-donate-2_yj4htk.png'/>
							</li>
							<li>Select a preferred barangay hall as a meeting place. Donators and recipients are advised to meet in barangay halls to ensure their safety and protection.</li>
							<li>Select the <a href="#types">type/s</a> of donation you are going to give.
								<img className="img-fluid" src='https://res.cloudinary.com/basurahunt/image/upload/v1662996482/BasuraHunt/Static/about-info/how-to-donate-3_kxkqj4.png'/>
							</li>
							<li>Enter a name for your donation.</li>
							<li>Include as much information about the donation as possible.</li>
							<li>Choose whether to stay anonymous, use real name, or use alias when donating to protect/hide your identity.</li>
							<li>Submit the form and wait for a recipient.</li>
						</ol>
						<hr/>
						<h2 id="types">Types of Donation</h2>
						<ol className="fs-5 mx-xl-5">
							<li><strong>Food</strong>
								<ul>Users can donate that can help Taguig residents that experiencing insufficient food or can't eat meals three times a day. <i>Examples: canned goods, instant noodles</i></ul>
							</li>
							<li><strong>Clothes</strong>
								<ul>Users can donate their used or brand-new clothes to the Taguig residents who lack clothes for everyday use. <i>Examples: shirt, pants, shorts</i></ul>
							</li>
							<li><strong>Medical</strong>
								<ul>Users especially the medical personnel can give medical supplies that can improve the people’s body resistance to the illness that are contagious such as colds, flu, and coughs, and for a remedy for a specific disease. <i>Examples: medicines, vitamins</i></ul>
							</li>
							<li><strong>Devices</strong>
								<ul>Users can give their used or excess devices that can help Taguig residents that don’t have a device for particular purposes such as education and work. <i>Examples: cellphone, tablet, laptop</i></ul>
							</li>
							<li><strong>Furniture</strong>
								<ul>Users can donate their used or excess furniture/s from their houses to help those people who don’t have furniture and can’t afford to buy new furniture/s. <i>Examples: refrigirator, couches, tables</i></ul>
							</li>
						</ol>
					</div>
				</div>
			</div>
		</Fragment>
		)
}

export default HowToDonate