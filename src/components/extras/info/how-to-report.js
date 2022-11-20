import React, {Fragment, useEffect} from 'react';
import SidebarUser from '../../../components/layouts/sidebar-user';
import SidebarBarangay from '../../../components/layouts/sidebar-barangay';
import SidebarCollector from '../../../components/layouts/sidebar-collector';
import Sidebar from '../../../components/layouts/sidebar';
import { useSelector } from 'react-redux'

const HowToReport = () => {
	const {user } = useSelector(state => state.auth)

	useEffect(()=>{
		if(user&&user.role ){
		if(window.location.hash.includes('types')){
			const availabilitySectionNode = document.getElementById('types')
		
			availabilitySectionNode 
			&& availabilitySectionNode.scrollIntoView({behavior: "smooth"});
		  }
		}
	},[user])

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
						<h2>How to Report Illegal Dumps?</h2>
						<p className="fs-5 mx-xl-5">
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Illegal dumping is one of the major problems in our country and worldwide since they can produce 
							plenty of negative impacts on people's health and our environment. An example of the negative effect 
							of illegal dumps are floods, diseases to the community, and climate change. 
							The application's main objective is to reduce and prevent illegal dumps in Taguig City with the help of 
							the Taguig residents. With the help of our application and reporting of the dumping in unauthorized 
							garbage collection points in Taguig City, we can save not only our community but also our mother 
							nature. With the following steps, we can protect and keep our surroundings:
						</p>
						<ol className="fs-5 mx-xl-5">
							<li>Click the <i>Report Illegal Dumps</i> tab.
								<img className="img-fluid" src='https://res.cloudinary.com/basurahunt/image/upload/v1662993540/BasuraHunt/Static/about-info/how-to-report-1_ltgass.png'/>
							</li>
							<li>Upload or capture an image of the scene or location where the illegal dump is and provide at least 1 picture and not more than five (User can also upload or record a video of the scene where the illegal dump is).
								<img className="img-fluid" src='https://res.cloudinary.com/basurahunt/image/upload/v1662993540/BasuraHunt/Static/about-info/how-to-report-2_uhkyhs.png'/>
							</li>
							<li>Pin the exact location or place on the map where the illegal dump is.</li>
							<li>Enter the complete address/location of the illegal dumps inlcuding the nearest landmark.</li>
							<li>Select all the possible <a href="#types">types</a> of garbage that can be seen in the illegal dump.
								<img className="img-fluid" src='https://res.cloudinary.com/basurahunt/image/upload/v1662993540/BasuraHunt/Static/about-info/how-to-report-3_tmygai.png'/>
							</li>
							<li>Select the possible <a href="#sizes">size</a> of garbage that will be collected by the trash collector.</li>
							<li>Choose from the <a href="#access">options</a> which can access the illegal dump based on its location.</li>
							<li>Select the appropriate <a href="#violations">violation</a> based on the scene encountered.</li>
							<li>Include as much information about the scene and location of the illegal dump as possible.</li>
							<li>Choose whether to stay anonymous, use real name, or use alias when reporting to protect/hide your <a href="#name">identity</a>.</li>
							<li>Submit the report and wait for the action of the authorities.</li>
						</ol>
						<hr/>
						<h2 id="types">Types of Waste</h2>
						<ol className="fs-5 mx-xl-5">
							<li><strong>Animal Corpse</strong>
								<ul>Any dead or slaughtered animal, usually seen on the road because of an accident. <i>Examples: animal bones, dead rat</i></ul>
							</li>
							<li><strong>Automotive</strong>
								<ul>Any automobile or vehicle waste that was part of an automobile, usually damaged or not functioning component of vehicles. <i>Examples: wheels, automotive battery</i></ul>
							</li>
							<li><strong>Construction</strong>
								<ul>Any waste that was generated or produced by any construction activities and materials that are damaged. <i>Examples: hollow blocks, broken ply woods, steel rod</i></ul>
							</li>
							<li><strong>Electronics</strong>
								<ul>Any electronic waste or part of electronic devices that are not functioning or not working properly. <i>Examples: light bulb, wires, broken televisions</i></ul>
							</li>
							<li><strong>Hazardous</strong>
								<ul>Any waste that is potentially dangerous or harmful to the environment and any human once inhaled or touched when disposed improperly. <i>Examples: pesticides, ammonia, paint/solvent</i></ul>
							</li>
							<li><strong>Household</strong>
								<ul>Any waste that may be solid or liquid materials that any family produced in a household. <i>Examples: broken table, broken cabinet, broken appliances</i></ul>
							</li>
							<li><strong>Liquid Waste </strong>
								<ul>Any waste that is formed in any liquid substances and may be produced by any household or industrial activity. <i>Examples: chemicals, used oils, acids</i></ul>
							</li>
							<li><strong>Metal/Can</strong>
								<ul>Any waste that is formed in any metal materials that may be in form of any ferrous and non-ferrous metals. <i>Examples: tin can, canned goods, steel</i></ul>
							</li>
							<li><strong>Paper</strong>
								<ul>Any waste that is formed in any paper and can be recycled, usually produced by work or industries. <i>Examples: magazine, newspaper, cardboard</i></ul>
							</li>
							<li><strong>Plastic</strong>
								<ul>Any waste that forms in any plastic and is usually hard to decompose. <i>Examples: plastic bottles, plastic bags</i></ul>
							</li>
							<li><strong>Glass Bottle</strong>
								<ul>Any waste that forms in any glass bottle usually contains a liquid. <i>Examples: wine bottle, broken glass</i></ul>
							</li>
							<li><strong>Organic/Food</strong>
								<ul>Any waste that is from plants or animals and food that is discarded and usually biodegradable and may use as a fertilizer. <i>Examples: leftover food, expired food, rotten plant</i></ul>
							</li>
							<li><strong>Burned</strong>
								<ul>Any waste that is currently burning or burned that is usually emits harmful and toxic gases or chemicals that can harm or pollute the environment. <i>Examples: Burned plastics, Treated Woods, Burned Paper</i></ul>
							</li>
							<li><strong>Other</strong>
								<ul>Any waste that is not specified in the categories.</ul>
							</li>
						</ol>
						<hr/>
						<h2 id="sizes">Size of Waste</h2>
						<ol className="fs-5 mx-xl-5">
							<li><strong>Trash Bin</strong>
								<ul>Trash that is small and can only be collected in a trash bin.</ul>
							</li>
							<li><strong>Dump Truck</strong>
								<ul>A large amount of waste that cannot be disposed of in a trash can and must be collected using a dump truck.</ul>
							</li>
						</ol>
						<hr/>
						<h2 id="access">Accessible By</h2>
						<ol className="fs-5 mx-xl-5">
							<li><strong>People</strong>
								<ul>Trash collectors will accumulate the illegal dumps in the specific area when the reported location in Taguig City are not yet fully developed, and any vehicles cannot access or make an entry into the area.</ul>
							</li>
							<li><strong>Tricycle</strong>
								<ul>Tricycle or any three wheels vehicle will collect the reported illegal dumps when the reported location or place is only accessible by any petite or three wheels vehicle.</ul>
							</li>
							<li><strong>Motorcycle/Bike</strong>
								<ul>Motorcycle, Bike, or any two wheels vehicle will collect the reported illegal dumps when the reported location or place is only accessible by any petite or two wheels vehicle.</ul>
							</li>
							<li><strong>Truck/Car</strong>
								<ul>Small or Big Dump Trucks or any vehicle will collect the reported illegal dumps when the reported location is accessible by any vehicles or automobile.</ul>
							</li>
							<li><strong>Boat</strong>
								<ul>Only accessible by a boat to collect and clean the illegal waste when the reported area is not yet fully developed and is near to the shorelines, rivers, or any body of water such as ‘Estero’.</ul>
							</li>
						</ol>
						<hr/>
						<h2 id="violations">Violations</h2>
						<ol className="fs-5 mx-xl-5">
							<li><strong>Littering, Illegal dumping, Illegal disposal of garbage</strong>
								<ul>Users or Taguig residents can report to the application once they see garbage or trashes that are improperly disposed of in unauthorized trash collection points. <i>Examples: Bulk trashes in abandoned place, garbage in any bodies of water</i></ul>
							</li>
							<li><strong>Dirty frontage and immediate surroundings for establishment owners</strong>
								<ul>Users or Taguig residents can report to the application once they see scattered garbage or trashes that are improperly disposed in front of an establishment or store that may affect people’s health. <i>Examples: Scattered small garbage, trash that no longer fits in the full trash can</i></ul>
							</li>
							<li><strong>Improper and untimely stacking of garbage outside residence or establishment</strong>
								<ul>Users or Taguig residents can report to the application once they see a bulk or stacking of garbage or trash that is improperly disposed around their houses or an establishment that may affect people due to rotten smell and the health of the Taguig residents. <i>Examples: food waste, pile of garbages</i></ul>
							</li>
							<li><strong>Obstruction (any dilapidated appliance, vehicle, and etc., display of merchandise, illegal structure along sidewalk)</strong>
								<ul>Users or Taguig residents can report to the application once they see any pile of garbage or trashes that are improperly disposed of in any sidewalk that may cause inconvenience to the community and Taguig residents. <i>Examples: Broken tables, plywoods/Woods, broken appliances, furnitures and vehicle in the sidewalk</i></ul>
							</li>
						</ol>
						<hr/>
						<h2 id="name">Shown Name</h2>
						<ol className="fs-5 mx-xl-5">
							<li><strong>Real Name</strong>
								<ul>The user's name will be prompted or displayed in the information of reported illegal dumpsand donation. Admins, employees, and users can view or glimpse the name of the reporting user and donator.</ul>
							</li>
							<li><strong>Alias/Nickname</strong>
								<ul>The user's enlisted nickname or alias will be prompted or displayed in the information of reported illegal dumps and donation. Admins, employees, and users can view or glimpse the registered alias or nickname of the reporting user and donator.</ul>
							</li>
							<li><strong>Anonymous</strong>
								<ul>The user's name or nickname will not be prompted or displayed in the information of reported illegal dumps and donation. “Anonymous” will be the one that will be displayed on the information of the reported illegal dumps and donation. Admins, employees, and users can only see the “anonymous” to the reporting user or donator.</ul>
							</li>
						</ol>
					</div>
				</div>
			</div>
		</Fragment>
		)
}

export default HowToReport