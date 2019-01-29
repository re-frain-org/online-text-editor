(function(){
	"use strict";
	firebase.initializeApp({
		apiKey: "AIzaSyBtI74sKBbndAbhklWZYu-7GVD0kwNl6L8",
		authDomain: "org-re-frain-onlinetexteditor.firebaseapp.com",
		databaseURL: "https://org-re-frain-onlinetexteditor.firebaseio.com",
		messagingSenderId: "1023529236959",
		projectId: "org-re-frain-onlinetexteditor",
		storageBucket: "org-re-frain-onlinetexteditor.appspot.com"
	});
	const database=firebase.database();
	const userName=document.getElementById("user-name");
	const fileName=document.getElementById("file-name");
	const textEditor=document.getElementById("text-editor");
	const ref=database.ref();
	location.search.substring(1).split("&").forEach(function(currentValue,index,array){
		const pair=currentValue.split("=");
		if(pair[0]=="id"){
			ref.child("share/"+pair[1]).once("value",function(data){
				const val=data.val();
				if(val!=null){
					userName.textContent=val["user"];
					fileName.textContent=val["file"];
					textEditor.value=val["text"];
				}
			});
		}
	});
})();
