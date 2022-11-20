import React, {Fragment, useState} from 'react'
import { Link } from 'react-router-dom'
import MetaData from '../../components/layouts/MetaData'

const About = () => {

	const [sound, setSound] = useState(false)



	return(
		<Fragment>
		<MetaData title={"About"} />
			<div className="bh-about">
				<video autoplay="autoplay" muted loop id="bh-about-video" style={{border:"unset"}} controls>
					<source src="/videos/introduction.mp4" type="video/mp4"/>
				</video>

				<div className="bh-about-items">
					<div className="row">
						<div className="col-md">
							<div className="bh-about-item">
								<h4 className="text-center">How to report illegal dumps?</h4>
								<div className="item-img" style={{backgroundImage: "url('https://images.pexels.com/photos/128421/pexels-photo-128421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"}}></div>
								<p>Illegal dumping is one of the major problems in our country and worldwide since they can produce 
							plenty of negative impacts on people's health and our environment ...</p>
								<Link to="/how-to-report" className="item-btn d-grid text-center">Read more</Link>
							</div>
						</div>
						<div className="col-md">
							<div className="bh-about-item">
								<h4 className="text-center">When and where can I put my garbage?</h4>
								<div className="item-img" style={{backgroundImage: "url('https://res.cloudinary.com/basurahunt/image/upload/v1663065404/BasuraHunt/Static/about-info/pexels-%C5%9Fehriban-karakaya-12068046_zweqdc.jpg')"}}></div>
								<p>Illegal dumping has become a big problem and challenge worldwide. Usually, the offenders 
							throw their garbage at night since some people have work or errands ...</p>
								<Link to="/when-and-where" className="item-btn d-grid text-center">Read more</Link>
							</div>
						</div>
						<div className="col-md">
							<div className="bh-about-item">
								<h4 className="text-center">How to donate my things?</h4>
								<div className="item-img" style={{backgroundImage: "url('https://res.cloudinary.com/basurahunt/image/upload/v1663065400/BasuraHunt/Static/about-info/pexels-julia-m-cameron-6994982_kxdv7m.jpg')"}}></div>
								<p>Donating is one of the best examples of unity towards other people, it brings hope and a future 
								for the people. Giving is not only beneficial to the people who received it, but it also gives ...</p>
								<Link to="/how-to-donate" className="item-btn d-grid text-center">Read more</Link>
							</div>
						</div>
					</div>
				</div>
				<hr/>
				<div className="my-5 bh-about-text">
					<h1 className="text-center">About</h1>
					<p className="mx-5 fs-5 text-center">
					BasuraHunt is a web application that lets a user report illegal dumps and donate usable items. This application aims to reduce and improve the environmental status, particularly in managing illegal dumps and providing self-awareness to the residents of Taguig City.
					</p>
				</div>
				<hr/>
				<div className="my-5">
					<h1 className="text-center">Developers</h1>
					<div className="bh-team">
						<div className="bh-about-TUP user-select-none">
							<img src="/images/TUP_LOGO.png"/>
							Technological University of the Philippines - Taguig
						</div>
						<div className="bh-team-img" style={{backgroundImage: "url('https://res.cloudinary.com/basurahunt/image/upload/v1658252353/BasuraHunt/Developers/basurahunt_mp78vx.png')"}}></div>
						<div className="bh-team-img" style={{backgroundImage: "url('https://res.cloudinary.com/basurahunt/image/upload/v1658252295/BasuraHunt/Developers/basurahunt_neq4iz.png')"}}></div>
						<div className="bh-team-img" style={{backgroundImage: "url('https://res.cloudinary.com/basurahunt/image/upload/v1658252330/BasuraHunt/Developers/basurahunt_xqoog8.jpg')"}}></div>
						<div className="bh-team-img" style={{backgroundImage: "url('https://res.cloudinary.com/basurahunt/image/upload/v1658252315/BasuraHunt/Developers/basurahunt_r2ucjj.jpg')"}}></div>
						<div className="bh-team-img" style={{backgroundImage: "url('https://res.cloudinary.com/basurahunt/image/upload/v1658565253/BasuraHunt/Developers/basurahunt_o7frwc.png')"}}></div>
						<div>
							<p className="text-white user-select-none">Contact us: <span className="user-select-all">basurahunt@gmail.com</span></p>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
		)
}

export default About