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
	const GoogleAuthProvider=firebase.auth.GoogleAuthProvider;
	const auth=firebase.auth();
	const database=firebase.database();
	const userName=document.getElementById("user-name");
	const fileList=document.getElementById("file-list");
	const menuButton=document.getElementById("menu-button");
	const textEditor=document.getElementById("text-editor");
	const menuDialog=document.getElementById("menu-dialog");
	const createButton=document.getElementById("create-button");
	const saveButton=document.getElementById("save-button");
	const deleteButton=document.getElementById("delete-button");
	const shareButton=document.getElementById("share-button");
	const closeButton=document.getElementById("close-button");
	const alertDialog=document.getElementById("alert-dialog");
	const alertText=document.getElementById("alert-text");
	const alertButton=document.getElementById("alert-button");
	const shareDialog=document.getElementById("share-dialog");
	const negativeButton=document.getElementById("negative-button");
	const positiveButton=document.getElementById("positive-button");
	const ref=database.ref();
	let user=null;
	if("serviceWorker" in navigator){
		navigator.serviceWorker.register("/online-text-editor/sw.js",{
			scope: "/online-text-editor/"
		});
	}
	window.addEventListener("beforeunload",function(event){
		if(user!=null){
			const options=fileList.options;
			const value=options[options.selectedIndex].value;
			if(value!=""){
				event.returnValue="保存していない内容は消えますがよろしいですか？";
			}
		}
	},false);
	document.addEventListener("DOMContentLoaded",function(event){
		textEditor.value="";
	},false);
	userName.addEventListener("click",function(event){
		if(user==null){
			auth.signInWithRedirect(new GoogleAuthProvider());
		}
		else{
			auth.signOut().then(function(resolve){
				user=null;
				userName.textContent="SignIn";
				const options=fileList.options;
				for(let index=options.length-1;
						index>=0;
						index--){
					let option=options[index];
					if(option.value!=""){
						fileList.removeChild(option);
					}
				}
				textEditor.value="";
				menuDialog.close();
				alertText.textContent="サインアウトしました。";
				alertDialog.showModal();
			}).catch(function(reject){
				menuDialog.close();
				alertText.textContent="サインアウトに失敗しました。";
				alertDialog.showModal();
			});
		}
	},false);
	fileList.addEventListener("change",function(event){
		if(user!=null){
			const options=fileList.options;
			const value=options[options.selectedIndex].value;
			if(value!=""){
				alertText.textContent="Now loading...";
				alertDialog.showModal();
				ref.child(user.uid+"/"+value+"/value").once("value",function(data){
					const val=data.val();
					if(val!=null){
						textEditor.value=val;
						alertDialog.close();
					}
				});
			}
			else{
				textEditor.value="";
			}
		}
	},false);
	menuButton.addEventListener("click",function(event){
		menuDialog.showModal();
	},false);
	textEditor.addEventListener("keydown",function(event){
		if(event.keyCode==9){
			event.preventDefault();
			const start=textEditor.selectionStart;
			const value=textEditor.value;
			const left=value.substring(0,start);
			const right=value.substring(start,value.length);
			textEditor.value=left+"\t"+right;
			textEditor.selectionEnd=start+1;
		}
	},false);
	menuDialog.addEventListener("cancel",function(event){
		event.preventDefault();
	},false);
	alertButton.addEventListener("click",function(event){
		alertDialog.close();
	},false);
	alertDialog.addEventListener("close",function(event){
		alertText.textContent="";
	},false);
	createButton.addEventListener("click",function(event){
		if(user!=null){
			let prompt="";
			while(prompt==""){
				prompt=window.prompt("ファイル名を入力してください。","");
			}
			if(prompt!=null){
				ref.child(user.uid+"/"+prompt+"/value").set("").then(function(resolve){
					const option=document.createElement("option");
					option.textContent=prompt;
					option.value=prompt;
					fileList.appendChild(option);
					fileList.value=prompt;
					textEditor.value="";
					menuDialog.close();
					alertText.textContent="作成しました。";
					alertDialog.showModal();
				}).catch(function(reject){
					menuDialog.close();
					alertText.textContent="作成に失敗しました。";
					alertDialog.showModal();
				});
			}
		}
	},false);
	saveButton.addEventListener("click",function(event){
		if(user!=null){
			const options=fileList.options;
			const value=options[options.selectedIndex].value;
			ref.child(user.uid+"/"+value+"/value").set(textEditor.value).then(function(resolve){
				menuDialog.close();
				alertText.textContent="保存しました。";
				alertDialog.showModal();
			}).catch(function(reject){
				menuDialog.close();
				alertText.textContent="保存に失敗しました。";
				alertDialog.showModal();
			});
		}
	},false);
	deleteButton.addEventListener("click",function(event){
		if(user!=null){
			const options=fileList.options;
			const value=options[options.selectedIndex].value;
			ref.child(user.uid+"/"+value).remove().then(function(resolve){
				fileList.removeChild(options[options.selectedIndex]);
				textEditor.value="";
				menuDialog.close();
				alertText.textContent="削除しました。";
				alertDialog.showModal();
			}).catch(function(reject){
				menuDialog.close();
				alertText.textContent="削除に失敗しました。";
				alertDialog.showModal();
			});
		}
	},false);
	shareButton.addEventListener("click",function(event){
		if(user!=null){
			shareDialog.showModal();
		}
	},false);
	closeButton.addEventListener("click",function(event){
		menuDialog.close();
	},false);
	shareDialog.addEventListener("cancel",function(event){
		event.preventDefault();
	},false);
	negativeButton.addEventListener("click",function(event){
		if(user!=null){
			const options=fileList.options;
			const value=options[options.selectedIndex].value;
			const key=ref.child("share/").push().key;
			ref.child("share/"+key).set({
				"file":value,
				"text":textEditor.value,
				"user":userName.textContent
			}).then(function(resolve){
				ref.child(user.uid+"/"+value+"/key").set(key);
				shareDialog.close();
				alertText.textContent="共有しました。\nURL : https://re-frain-org.github.io/online-text-editor/share/index.html?id="+key;
				alertDialog.showModal();
			}).catch(function(reject){
				shareDialog.close();
				alertText.textContent="共有に失敗しました。";
				alertDialog.showModal();
			});
		}
	},false);
	positiveButton.addEventListener("click",function(event){
		if(user!=null){
			const options=fileList.options;
			const value=options[options.selectedIndex].value;
			ref.child(user.uid+"/"+value+"/key").once("value",function(data){
				const val=data.val();
				let key=null;
				if(val!=null){
					key=val;
				}
				else{
					key=ref.child("share/").push().key;
				}
				ref.child("share/"+key).set({
					"file":value,
					"text":textEditor.value,
					"user":userName.textContent
				}).then(function(resolve){
					ref.child(user.uid+"/"+value+"/key").set(key);
					shareDialog.close();
					alertText.textContent="共有しました。\nURL : https://re-frain-org.github.io/online-text-editor/share/index.html?id="+key;
					alertDialog.showModal();
				}).catch(function(reject){
					shareDialog.close();
					alertText.textContent="共有に失敗しました。";
					alertDialog.showModal();
				});
			});
		}
	},false);
	auth.getRedirectResult().then(function(resolve){
		if(resolve.user){
			user=resolve.user;
			userName.textContent=user.displayName;
			ref.child(user.uid).once("value",function(data){
				const val=data.val();
				if(val!=null){
					(function generator(object,parent){
						if(parent==undefined){
							parent="";
						}
						const iterator=Object.keys(object)[Symbol.iterator]();
						let next=false;
						while(!(next=iterator.next()).done){
							let value=object[next.value];
							if(next.value=="value"){
								let option=document.createElement("option");
								let string=parent.slice(0,-1);
								option.textContent=string;
								option.value=string;
								fileList.appendChild(option);
							}
							else if(typeof value=="object"){
								generator(value,parent+next.value+"/");
							}
						}
					})(val);
				}
			});
			menuDialog.close();
			alertText.textContent="アカウント : "+user.displayName+"でサインインしました。";
			alertDialog.showModal();
		}
	}).catch(function(reject){
		menuDialog.close();
		alertText.textContent="サインインに失敗しました。";
		alertDialog.showModal();
	});
})();
