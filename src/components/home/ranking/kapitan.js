import React, {Fragment} from 'react';



const Kapitan = ({barangay}) => {
	let KapitanName = ""


	if(barangay === "Bagumbayan"){
		KapitanName = "Ogalinola-Pajarin, Carmi"
	}
	else if(barangay === "Bambang"){
		KapitanName = "Cruz, Jaime T Jr"
	}
	else if(barangay === "Calzada"){
		KapitanName = "Tanyag, Marilyn R."
	}
	else if(barangay === "Hagonoy"){
		KapitanName = "Gutierrez, Renato O"
	}
	else if(barangay === "Ibayo-Tipas"){
		KapitanName = "Mendiola, Erwin C."
	}
	else if(barangay === "Ligid-Tipas"){
		KapitanName = " Manosca, Lamberto M."
	}
	else if(barangay === "Ibayo-Tipas"){
		KapitanName = "Mendiola, Erwin C."
	}
	else if(barangay === "Lower Bicutan"){
		KapitanName = "Pacayra, Roel O."
	}
	else if(barangay === "New Lower Bicutan"){
		KapitanName = "Franco, Gregorio S Jr."
	}
	else if(barangay === "Napindan"){
		KapitanName = "Dela Paz, Virgilio C."
	}
	else if(barangay === "Palingon"){
		KapitanName = "Mendiola Jerome M."
	}
	else if(barangay === "San Miguel"){
		KapitanName = "Espital, Vicente G."
	}
	else if(barangay === "Santa Ana"){
		KapitanName = "Flogen, Roberto M."
	}
	else if(barangay === "Tuktukan"){
		KapitanName = "Ulunday, Suranie G."
	}
	else if(barangay === "Ususan"){
		KapitanName = "Marcelino, Marilyn F."
	}
	else if(barangay === "Wawa"){
		KapitanName = "Buenaflor, Phillip E."
	}
	else if(barangay === "Central Bicutan"){
		KapitanName = "Alit, Jennifer F."
	}
	else if(barangay === "Central Signal Village"){
		KapitanName = "Duenas, Henry III A."
	}
	else if(barangay === "Fort Bonifacio"){
		KapitanName = "Bocobo, Jorge Daniel S."
	}
	else if(barangay === "Katuparan"){
		KapitanName = "Baptitsta, Edgar Victor S."
	}
	else if(barangay === "Maharlika Village"){
		KapitanName = "Pautin, Hareem P."
	}
	else if(barangay === "North Daang Hari"){
		KapitanName = "Fortuno, Lorenzo O."
	}
	else if(barangay === "North Signal Village"){
		KapitanName = "Pullente, Jesus J."
	}
	else if(barangay === "Pinagsama"){
		KapitanName = "Veloria, Nomie S."
	}
	else if(barangay === "South Daang Hari"){
		KapitanName = "Hernadez, Velerado D."
	}
	else if(barangay === "South Signal Village"){
		KapitanName = "Odevilas, Michelle-Ann M."
	}
	else if(barangay === "Tanyag"){
		KapitanName = "Teodoro, Cecilia C."
	}
	else if(barangay === "Upper Bicutan"){
		KapitanName = "Penolio, Alexander S."
	}
	else if(barangay === "Western Bicutan"){
		KapitanName = "Bermas, Pedrito"
	}







	return(
			<Fragment>
				{KapitanName}
			</Fragment>
		)


}

export default Kapitan;