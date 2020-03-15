function CheckOn(self){
	console.log(self.checked)
	
	let cbNum=self.id[self.id.length -1]
	console.log(cbNum)
	let inputID='input'+cbNum
	if(self.checked){
		self.form[inputID].style.textDecoration='line-through'
		self.form[inputID].style.color='gray'
	}else{
		self.form[inputID].style.textDecoration=' none '
		self.form[inputID].style.color='black'
	}
}

function printDatas(self){
	let cbDatas=[]
	for(let idNum=1;idNum<=self.form.querySelectorAll('.cbs').length;
	idNum++){
		let cbID='#cb'+idNum
		let inputID='#input'+idNum
		
		if(document.querySelector(inputID).value){
			let imsiiData={}
			imsiiData.checked=document.querySelector(cbID).checked
			imsiiData.text=document.querySelector(inputID).value
			cbDatas.push(imsiiData)
		}else{}
	}
	
	console.log(cbDatas)
	alert('Check the console tab')
}