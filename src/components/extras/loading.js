import React, {Fragment} from 'react'

const Loading = () => {
	document.onkeydown = function (e){
		return false;
	}
	return(
		<Fragment>
			{/*<div className="loading-container">
				<div className="spinner spinner-grow my-auto" role="status"/>
				<div className="spinner spinner-grow my-auto" role="status"/>
				<div className="spinner spinner-grow my-auto" role="status"/>
			</div>*/}


			<div className="loading-container">
				<div className="spinner-logo spinner-border my-auto" role="status"/>
			</div>
		</Fragment>
		)
}

export default Loading