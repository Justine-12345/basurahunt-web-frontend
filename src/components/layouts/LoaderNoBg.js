import React, {Fragment} from 'react'

const Loading = () => {

  return(
    <Fragment>
      {/*<div className="loading-container">
        <div className="spinner spinner-grow my-auto" role="status"/>
        <div className="spinner spinner-grow my-auto" role="status"/>
        <div className="spinner spinner-grow my-auto" role="status"/>
      </div>*/}


      <div className="loading-container-nobg" style={{margin:"0px", padding:"0px", background:"transparent", zIndex:"0"}}>
        <div className="spinner-logo-dg spinner-border my-auto" role="status"/>
      </div>
    </Fragment>
    )
}

export default Loading