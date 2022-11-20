import React, {Fragment} from 'react';

const AccessDenied = () => {
	return(
		<Fragment>
			<div className="bh-container">
				<div className="bh-container-3 m-auto text-center">
					<p className="m-1 fs-2 fw-bold">You're banned from BasuraHunt</p>
					<p className="m-1 fs-4">You have violated our terms of service</p>
				</div>
			</div>
		</Fragment>
		)
}

export default AccessDenied