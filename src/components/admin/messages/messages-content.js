import React, {Fragment} from 'react';
// import {Link} from 'react-router-dom';
import Sidebar from '../../../components/layouts/sidebar';
import MessagesSidebar from './messages-sidebar';

const Messages = () => {
	return(
		<Fragment>
			<div className="bh-container-4">
				<div>
					<Sidebar/>
				</div>
				<div>
					<MessagesSidebar/>
				</div>
				<div className="bh-container-5">
					<div className="msg-content-header">
						<p className="msg-content-header">Long name here because blah blah blah blah blah blah blah</p>
					</div>
						{/*<div className="msg-container">*/}
							    <div className="msg-content">
								    <div className="msg-bubble">
										<div className="msg-bubble-1"
											title="Aug. 12, 2022 12:00pm">
											<p>asdasdsadsadsadsadsadsaasdasdsadsadsadsadsadsaasdasdsadsadsadsadsadsaasdasdsadsadsadsadsadsaasdasdsadsadsadsadsadsaasdasdsadsadsadsadsadsaasdasdsadsadsadsadsadsaasdasdsadsadsadsadsadsaasdasdsadsadsadsadsadsaasdasdsadsadsadsadsadsaasdasdsadsadsadsadsadsaasdasdsadsadsadsadsadsaasdasdsadsadsadsadsadsaasdasdsadsadsadsadsadsa</p>
										</div>
								</div>


							</div>
							<form>
								<div className="msg-chat">
									<div className="input-group">
										<textarea className="form-control"/>
										<button type="submit" className="btn bh-submitBtn">SEND</button>
									</div>
								</div>
							</form>
						{/*</div>*/}
				</div>
			</div>
		</Fragment>
		)
}

export default Messages