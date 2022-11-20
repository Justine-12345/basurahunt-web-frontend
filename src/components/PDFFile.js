import React, {Fragment} from 'react';
import jsPDF from "jspdf";
import CertificateImg from "../Photos/certificate.png"
import badge1 from "../Photos/badge1.png"
import badge2 from "../Photos/badge2.png"
import badge3 from "../Photos/badge3.png"
import badge4 from "../Photos/badge4.png"

const Certificate = ({first_name, last_name, level}) => {



	const DCert = () =>{

		const doc = new jsPDF('landscape','px', 'a4', 'false')
		var width = doc.internal.pageSize.getWidth();
		var height = doc.internal.pageSize.getHeight();
		doc.addImage(CertificateImg, 'PNG', 0, 0, width, height)
		doc.setFontSize(40);
		doc.setTextColor(0, 79, 12);
		doc.setFont("helvetica", "bold");
		doc.text(first_name+" "+last_name, width-50, 200, null, null, "right");

		if(level>=6 && level<=10){
			doc.setFontSize(30);
			doc.text("Eco Master", width-50, 295, null, null, "right");
			doc.addImage(badge2, 'PNG',  width-210, 263, 35, 35)
		}

		if(level>=11 && level<=15){
			doc.setFontSize(30);
			doc.text("Eco King", width-50, 295, null, null, "right");
			doc.addImage(badge3, 'PNG',  width-190, 263, 35, 35)
		}

		if(level>=16 && level<=20){
			doc.setFontSize(30);
			doc.text("Eco Hero", width-50, 295, null, null, "right");
			doc.addImage(badge4, 'PNG',  width-190, 263, 35, 35)
		}

		doc.setFontSize(11);
		doc.setFont("courier", "normal");

		doc.text(new Date(Date.now()).toDateString(), width-50, 395, null, null, "right");


		doc.save('BHcertificate.pdf')
	}

	return(
			<Fragment>
				<button onClick={DCert} className="btn btn-success w-100">Download E-Certificate</button>
			</Fragment>
		)


}

export default Certificate;