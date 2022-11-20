import React, {Fragment} from 'react';
import SidebarUser from '../../../components/layouts/sidebar-user';
import SidebarBarangay from '../../../components/layouts/sidebar-barangay';
import SidebarCollector from '../../../components/layouts/sidebar-collector';
import Sidebar from '../../../components/layouts/sidebar';
import { useSelector } from 'react-redux'

const WhenAndWhere = () => {
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
						<h2>When and Where Can I Put My Garbage?</h2>
						<p className="fs-5 mx-xl-5">
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Illegal dumping has become a big problem and challenge worldwide. Usually, the offenders 
							throw their garbage at night since some people have work or errands during the day and forget to 
							throw their garbage on the exact schedule of collection of trash. Because a single piece of junk 
							that was missed to throw at the right schedule of trash collection by a single person could pile up 
							and produce a problem for the community and the health of the people.
							The application's main objective is to reduce and prevent illegal dumps in Taguig City with the 
							help of the Taguig residents. With the use of our application and knowing where the authorized 
							trash collection points are, we can guarantee an amazing life here in Taguig Cty. Understanding 
							the importance and awareness of the Taguig residents about the authorized garbage collection 
							point is a great advantage to our community and Earth since it grants a lot of benefits such as 
							systemized, organized, and clean city. With the following steps, we can be aware of the 
							collection point and collection system of Taguig City:	
						</p>
						<ol className="fs-5 mx-xl-5">
							<li>The schedule will be displayed based on the user's registered barangay. Select the <i>Collection Today</i> tab under the <i>Schedule</i> tab to see when and where the collection will take place.
								<img className="img-fluid" src='https://res.cloudinary.com/basurahunt/image/upload/v1662999913/BasuraHunt/Static/about-info/when-and-where-1_hlfrqg.png'/>
							</li>
							<li>Click the <i>Upcoming Collection</i> tab to know the schedule of future collections.
								<img className="img-fluid" src='https://res.cloudinary.com/basurahunt/image/upload/v1662999913/BasuraHunt/Static/about-info/when-and-where-2_rmvvrg.png'/>
							</li>
							<li>You can see the details about the scheduled collection such as time and the list of collection points.
								<img className="img-fluid" src='https://res.cloudinary.com/basurahunt/image/upload/v1663000034/BasuraHunt/Static/about-info/when-and-where-3_a0t0yg.png'/>
							</li>
							<li>You may also see whether the collection is still on going or not.</li>
							<li>Click a schedule to see more details about it.
								<img className="img-fluid" src='https://res.cloudinary.com/basurahunt/image/upload/v1662999913/BasuraHunt/Static/about-info/when-and-where-4_pl150u.png'/>
							</li>
						</ol>
					</div>
				</div>
			</div>
		</Fragment>
		)
}

export default WhenAndWhere