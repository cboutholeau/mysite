window.addEventListener("DOMContentLoaded",init); //La fonction principale s'exécute une fois que la page est chargée
let i =0; //Compteur pour les tableaux de météo par heure


//Fonction principale
function init() {
	fetch("https://api.open-meteo.com/v1/forecast?latitude=48.11&longitude=-1.67&timezone=auto&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m") //API avec coordonnées de Rennes
		.then(function(response) {
			return response.json();
		})
		.then((json)=>{
		console.log(json)
		
		//Entrée des dates
		var jour = document.getElementById("jour"); //Date d'aujourd'hui pour la météo "par heure"
		jour.innerHTML = String.prototype.concat("Aujourd'hui : ",date(json.current_weather.time)); //Format : jour mois année 
		var lendemain = document.getElementById("lendemain"); //Date dde demain pour la météo "par heure"
		lendemain.innerHTML = String.prototype.concat("Demain : ",date(json.hourly.time[24])); //Format : jour mois année 
		var horaire = document.getElementById("horaire"); //Date d'aujourd'hui + heure actuelle pour la météo "maintenant"
		horaire.innerHTML = String.prototype.concat(date(json.current_weather.time)," - ", heure(json.current_weather.time)); //Format jour mois année + heure 

		//Entrée des données météo pour "Maintenant"
		var temps = document.getElementById("temps"); //Description du temps 
		temps.innerHTML = transformecodemeteo(json.current_weather.weathercode); //Traduction code météo -> signification
		var temperature = document.getElementById("temperature"); //Température
		var utemperature = json.hourly_units.temperature_2m; //Unité de la température
		temperature.innerHTML = String.prototype.concat(json.current_weather.temperature," ",utemperature); //Affichage température avec son unité
		var vitesse = document.getElementById("vitesse"); //Vitesse du vent
		var uvitesse = json.hourly_units.windspeed_10m; //Unité de la vitesse du vent
		vitesse.innerHTML = String.prototype.concat("Vitesse : ",json.current_weather.windspeed," ",uvitesse); //Affichage vitesse du vent avec son unité
		var direction = document.getElementById("direction"); //Direction du vent (en °)
		direction.innerHTML = String.prototype.concat("Direction : ",transformedirectionvent(json.current_weather.winddirection)); //Traduction degré -> Direction avec points cardinaux
		
		//Remplissage des tableaux "Par heure"
		var tableajd = document.getElementById("ajd"); //Tableau pour aujourd'hui
		var tabledmn = document.getElementById("demain"); //Tableau pour demain
		for (i=0;i<24;i++) { //24 lignes pour 24 heures
			//Remplissage pour aujourd'hui
			var rowajd=tableajd.insertRow(); //Nouvelle ligne
			var ajdheure = rowajd.insertCell(0); //Colonne 1 : l'heure
			var ajdtemperature = rowajd.insertCell(1); //Colonne 2 : la température
			var ajdhumidite = rowajd.insertCell(2); //Colonne 3 : le taux d'humidité
			var ajdvent = rowajd.insertCell(3); //Colonne 4 : la vitesse du vent
			ajdheure.innerHTML=heure(json.hourly.time[i]); //Affichage de l'heure, format 00h
			ajdtemperature.innerHTML=String.prototype.concat(json.hourly.temperature_2m[i]," ",utemperature); //Affichage température avec son unité
			ajdhumidite.innerHTML=String.prototype.concat(json.hourly.relativehumidity_2m[i],"%"); //Affichage taux d'humidité avec son unité
			ajdvent.innerHTML=String.prototype.concat(json.hourly.windspeed_10m[i]," ",uvitesse); //Affichage vitesse du vent avec son unité
			//Remplissage pour demain
			var rowdmn=tabledmn.insertRow(); //Nouvelle ligne
			var dmnheure = rowdmn.insertCell(0); //Colonne 1 : l'heure
			var dmntemperature = rowdmn.insertCell(1); //Colonne 2 : la température
			var dmnhumidite = rowdmn.insertCell(2); //Colonne 3 : le taux d'humidité
			var dmnvent = rowdmn.insertCell(3); //Colonne 4 : la vitesse du vent
			dmnheure.innerHTML=heure(json.hourly.time[i+24]); //Affichage de l'heure, format 00h
			dmntemperature.innerHTML=String.prototype.concat(json.hourly.temperature_2m[i+24]," ",utemperature); //Affichage température avec son unité
			dmnhumidite.innerHTML=String.prototype.concat(json.hourly.relativehumidity_2m[i+24],"%"); //Affichage taux d'humidité avec son unité
			dmnvent.innerHTML=String.prototype.concat(json.hourly.windspeed_10m[i+24]," ",uvitesse); //Affichage vitesse du vent avec son unité
		}
	});
}

//Transformation du code météo (paramètre code) en sa signification en français
function transformecodemeteo(code) {
	let signification;
	switch (code) {
		case 0 : signification = "0 : Ciel dégagé"; break;
		case 1 : signification = "1 : Ciel plutôt dégagé"; break;
		case 2 : signification = "2 : Ciel partiellement nuageux"; break;
		case 3 : signification = "3 : Ciel couvert"; break;
		case 45 : signification = "45 : Brouillard"; break;
		case 48 : signification = "48 : Dépôt de brouillard givré"; break;
		case 51 : signification = "51 : Bruine légère"; break;
		case 53 : signification = "53 : Bruine modérée"; break;
		case 55 : signification = "55 : Bruine dense"; break;
		case 56 : signification = "56 : Bruine verglaçante légère"; break;
		case 57 : signification = "57 : Bruine verglaçante forte"; break;
		case 61 : signification = "61 : Pluie faible"; break;
		case 63 : signification = "63 : Pluie modérée"; break;
		case 65 : signification = "65 : Pluie forte"; break;
		case 66 : signification = "66 : Pluie verglaçante légère"; break;
		case 67 : signification = "67 : Pluie verglaçante forte"; break;
		case 71 : signification = "71 : Chute de neige légère"; break;
		case 73 : signification = "73 : Chute de neige modérée"; break;
		case 75 : signification = "75 : Chute de neige forte"; break;
		case 77 : signification = "77 : Neige en grains"; break;
		case 80 : signification = "80 : Averses de pluie légères"; break;
		case 81 : signification = "81 : Averses de pluies modérées"; break;
		case 82 : signification = "82 : Averses de pluie violentes"; break;
		case 85 : signification = "85 : Averses de neige légères"; break;
		case 86 : signification = "86 : Averses de neige fortes"; break;
		case 95 : signification = "95 : Orage léger à modéré"; break;
		case 96 : signification = "96 : Orage avec légère grêle"; break;
		case 97 : signification = "97 : Orage avec forte grêle"; break;
		default : signification = "Indeterminé";
	}
	return signification;
}


//Transformation du degré de direction du vent en direction avec points cardinaux
function transformedirectionvent(degre) {
	let direction;
	if ((degre<22.5)||(degre>=333.5)) { direction = "Nord";} 
	else {
		if ((degre>=22.5)&(degre<67.5)) {direction = "Nord-Est";}
		else {
			if ((degre>=67.5)&(degre<112.5)) {direction="Est";}
			else {
				if ((degre>=112.5)&(degre<157.5)) {direction="Sud-Est";}
				else {
					if((degre>=157.5)&(degre<202.5)) {direction="Sud";}
					else {
						if((degre>=202.5)&(degre<247.5)) {direction="Sud-Ouest";}
						else {
							if ((degre>=247.5)&(degre<292.5)) {direction="Ouest";}
							else {
								direction="Nord-Ouest";
							}
						}
					}
				}
			}
		}
	}
	return direction;
}


//Extraction et transformation de la date d'aujourd'hui (ex: 2023-01-19T08:00 -> 19 janvier 2023)
function date(chaine) {
	let année = String.prototype.concat(chaine[0],chaine[1],chaine[2],chaine[3]); //Concaténation des 4 chiffres de l'année
	let mois = transformemois(String.prototype.concat(chaine[5],chaine[6])); //Concaténation des 2 chiffres du mois + transformation en lettres(transformemois)
	let jour = String.prototype.concat(chaine[8],chaine[9]); //Concaténation des 2 chiffres du jour
	return(String.prototype.concat(jour," ",mois," ",année));
}

//Extraction et transformation de l'heure (ex: 2023-01-19T08:00 -> 08h)
function heure(chaine) {
	return(String.prototype.concat(chaine[11],chaine[12],"h")); //Concaténation des 2 chiffres de l'heure et du h
}

//Transformation du mois de chiffres en lettres
function transformemois(moisenchiffres) {
	let moisenlettres;
	switch (moisenchiffres) {
		case "01": moisenlettres = "janvier"; break;
		case "02": moisenlettres = "fevrier"; break;
		case "03": moisenlettres = "mars"; break;
		case "04": moisenlettres = "avril"; break;
		case "05": moisenlettres = "mai"; break;
		case "06": moisenlettres = "juin"; break;
		case "07": moisenlettres = "juillet"; break;
		case "08": moisenlettres = "août"; break;
		case "09": moisenlettres = "septembre"; break;
		case "10": moisenlettres = "octobre"; break;
		case "11": moisenlettres = "novembre"; break;
		case "12": moisenlettres = "decembre"; break;
	}
	return moisenlettres;
}