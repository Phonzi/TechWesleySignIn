answers=new Map();
document.getElementsByClassName("subBox")[0].style.display="none";


//If you want to change a color, make sure you change every hard-
//Coded string with it inside of this file as well as the css file
//Because the submission of the form checks the value of fields
//Based on how they're colored
//
//Don't judge me too hashly for that -> It was late, it seemed
//Like a good idea at the time


//If a name cookie exists, add the "areYouThem" question
//Else hide that question box
function cookieCheck(){
	var name=getCookieName();
	if(name!=""){
		var box=document.getElementsByClassName("areYouThem")[0];
		var h = box.getElementsByClassName("smallTitle")[0];
		var formatted=name.split(',');
		formatted=formatted[formatted.length-1].trim();
		h.innerHTML="Are you "+formatted+"?";
	}else{
		var box=document.getElementsByClassName("areYouThem")[0];
		box.style.display="none";
		hideShowSections();
	}
}

//When a button containing buttonText is clicked
//it changes color and every other button inside
//the box of said boxClass is reverted back to
//their original color
function buttonColorChange(boxClass, buttonText){
	var box=document.getElementsByClassName(boxClass)[0];
	var buttons=box.getElementsByTagName("BUTTON");
	var regColor="#000000";
	var regBColor="#FFFFFF";
	var newColor="#FFFFFF";
	var newBColor="#000000";

	for(var i=0;i<buttons.length;i++){
		if(buttons[i].innerHTML==buttonText){
			buttons[i].style.color=newColor;
			buttons[i].style.backgroundColor=newBColor;
		}
		else{
			buttons[i].style.color=regColor;
			buttons[i].style.backgroundColor=regBColor;
		}
		
	}
	answers.set(boxClass,buttonText);
	hideShowSections();
	checkSubmit();
}


//This function controls what fields are visible
//At a given time because some fields only become
//Visible once every field is filled out before it
//
//The way this is structured in the conditionTree
//[conditionClass,buttonIndexNeccesary,classRelient]
//conditionClass is the box that needs to be filled out beforehand
//boxIndexNeccesary is the index of the button in the box that must
//be pressed -> 1 would be False for a True false box
//classRelient is the box that will appear or disappear depending
//on the result
function hideShowSections(){
	var conditionTree= [
		["areYouThem",1,"getName"],
		["areYouThem",1,"firstTimer"],
		["firstTimer",0,"getEmail"],
		["firstTimer",0,"isAStudent"],
		["isAStudent",0,"getMajor"],
		["isAStudent",0,"getYear"]
	]
	for(var i=0;i<conditionTree.length;i++){
		var cond=conditionTree[i][0];
		var necc=conditionTree[i][1];
		var resp=conditionTree[i][2];
		var box=document.getElementsByClassName(cond)[0];
		var button=box.getElementsByTagName("BUTTON")[necc];
		if((necc==1 && box.style.display=="none") ||
			(box.style.display!="none" &&
				button.style.color=="rgb(255, 255, 255)")){
			document.getElementsByClassName(resp)[0].style.display="";
		}else{
			document.getElementsByClassName(resp)[0].style.display="none";
		}
	}
	stripeColoring();
}

//This just goes through and alternates the background
//coloring of the boxes
//These colors are safe to change
function stripeColoring(){
	var boxes=document.getElementsByClassName("box");
	var grey=true;
	for(var i=1;i<boxes.length;i++){
		if(boxes[i].style.display!="none"){
			if(grey){
				boxes[i].style.backgroundColor="#CCCCDD";//Independent of button colors
			}else{
				boxes[i].style.backgroundColor="#FFFFFF";//Independent of button colors
			}
			grey=!grey;
		}
	}
}

//If all of the data is filled out, it make the submit button appear
function checkSubmit(){
	//Adds text input data
	var inputClasses=["getName","getEmail","getMajor"];
	for(var i=0;i<inputClasses.length;i++){
		var box=document.getElementsByClassName(inputClasses[i])[0];
		var input=box.getElementsByTagName("INPUT")[0];
		var data=input.value;
		if(data!=""){
			answers.set(inputClasses[i],data.replace("&&","__"));
			if(inputClasses[i]=="getName")
			document.cookie="name="+data.replace("&&","__").replace("=","*")+
				"; expires=Fri, 31 Dec 9999 23:59:59 GMT";
		}
	}
	//Adds cookie value
	answers.set("cookie",getCookieName());
	//Removes hidden element's data
	var boxes=["areYouThem","getName","firstTimer","getEmail","isAStudent",
	"getMajor","getYear","getEvent"];
	for(var i=0;i<boxes.length;i++){
		var box=document.getElementsByClassName(boxes[i])[0];
		if(box.style.display=="none") answers.delete(boxes[i]);
	}
	//Checks to see if everything is filled out
	var valid=true;
	for(var i=0;i<boxes.length;i++){
		var box=document.getElementsByClassName(boxes[i])[0];
		if(box.style.display!="none" && !answers.has(boxes[i])){
			document.getElementsByClassName("subBox")[0].style.display="none";
			valid=false;
		}
	}
	if(valid){
		var sub=document.getElementsByClassName("subBox")[0];
		sub.style.display="";
		stripeColoring();
	}
}

//This encodes the map of information into a number
//And relocates the user to that address -> Python
//will handle it from there
function newLocation(){
	var newLoc="http://34.68.189.23/formsubmit/";
	var newEnd=""
	var vals=answers.entries();
	for(var val of vals){
		newEnd+=val[0]+"&&"+val[1]+"&&";
	}
	for(var charac of newEnd){
		newLoc+=(100+charac.charCodeAt());
	}
	window.location=newLoc;
}

//This loads the events from Events.js
//into the getEvent section of the
//form
function addEventButtons(){
	var newDivs=[];
	var newDiv=0;
	for(var i=0;i<3;i++){
		var eve = EventList[i];
		if(i%2==0){
			newDiv=document.createElement("div");
			newDiv.className="eventRow";
		}
		var newButton=document.createElement("button");
		newButton.type="button";
		newButton.className="eventButton";
		newButton.appendChild(document.createTextNode(eve));
		var f = new Function("buttonColorChange('getEvent','"+eve+"');");
		newButton.addEventListener('click',f);
		newDiv.appendChild(newButton);
		if(i%2==1){
			document.getElementsByClassName("getEvent")[0].appendChild(newDiv);
		}
	}
	var newButton=document.createElement("button");
	newButton.type="button";
	newButton.className="eventButton";
	newButton.appendChild(document.createTextNode("Other"));
	var f = new Function("updateEvents();");
	newButton.addEventListener('click',f);
	newDiv.appendChild(newButton);
	document.getElementsByClassName("getEvent")[0].appendChild(newDiv);
}


//This does the same thing as addEventButtons, but
//it is only used when "Other" is clicked -> it loads
//all the events
function updateEvents(){
	var elem=document.getElementsByClassName("getEvent")[0];
	var title=elem.getElementsByClassName("smallTitle")[0];
	elem.innerHTML="";
	elem.appendChild(title);
	var newDivs=[];
	var newDiv=0;
	for(var i=0;i<EventList.length;i++){
		var eve = EventList[i];
		if(i%2==0){
			newDiv=document.createElement("div");
			newDiv.className="eventRow";
		}
		var newButton=document.createElement("button");
		newButton.type="button";
		newButton.className="eventButton";
		newButton.appendChild(document.createTextNode(eve));
		var f = new Function("buttonColorChange('getEvent','"+eve+"');");
		newButton.addEventListener('click',f);
		newDiv.appendChild(newButton);
		if(i%2==1){
			document.getElementsByClassName("getEvent")[0].appendChild(newDiv);
		}
	}
	if(EventList.length%2==1){
		document.getElementsByClassName("getEvent")[0].appendChild(newDiv);
	}
}

//If the cookie exists -> This returns the name
//If it doesn't -> This returns ""
function getCookieName(){
	var cookies = document.cookie.split(";");
	for(var i=0;i<cookies.length;i++){
		var broken=cookies[i].split('=');
		name=broken[0];
		value=broken[1];
		if(name=="name") return value;
	}
	return "";
}

addEventButtons();

