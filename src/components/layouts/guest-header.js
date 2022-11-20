import React, {Fragment,useEffect, useState} from 'react';
import {Link} from 'react-router-dom';


const GuestHeader = () => {

	return(
		<Fragment>
			<div className="bh-header">
				<nav className="navbar navbar-expand-sm navbar-dark">
					<div className="container-fluid">
						<Link className="navbar-brand fs-1" to="/newsfeed">
							<img alt="BasuraHunt Logo" src="https://res.cloudinary.com/basurahunt/image/upload/v1658224082/BasuraHunt/Static/BasuraHunt_-_logo_v2aymh.png"/>BasuraHunt</Link>
						<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bh-header" aria-controls="bh-header" aria-expanded="false" aria-label="Toggle navigation">
							<span className="navbar-toggler-icon"></span>
						</button>
						<div className="collapse navbar-collapse" id="bh-header">

								<div className="navbar-nav ms-auto guest">
									<Link className="nav-link" to="/login" id="bh-loginBtn">Login</Link>
									<Link className="nav-link" to="/register" id="bh-registerBtn">Sign Up</Link>
								</div>
						</div>
					</div>
				</nav>
			</div>
		</Fragment>


		)
}

export default GuestHeader