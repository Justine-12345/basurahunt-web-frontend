import React, {Fragment} from 'react';
// import {Link} from 'react-router-dom';
import SidebarUser from '../../components/layouts/sidebar-user';

const AccessDenied = () => {
	return(
		<Fragment>
			<div className="bh-container">
				<div>
					<SidebarUser/>
				</div>
				<div className="bh-container-3 m-auto text-center">
					<p className="m-1 fs-2 fw-bold">You cannot access this yet!</p>
					<p className="m-1 fs-4">Please wait until your account has been verified. Thank you!</p>
					<small><i class="bi bi-info-circle"></i> &nbsp;Your account will be verified based on your first submitted report of illegal dumps. If it is real or eligible, your account can be verified.</small>
				</div>
			</div>
		</Fragment>
		)
}

export default AccessDenied