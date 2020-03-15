/*
cd /workspace/web2_backend/Checkbox-since200308-
node main.js
*/

var http = require('http');
var fs = require('fs');
var url= require('url'); //http, fs, url 모듈 사용 선언

var app = http.createServer(function(request, response) {
    var _url = request.url;
    var pathName = url.parse(_url, true).pathname;
    console.log(pathName)
    if (true){
        let templete=`<!doctype html>
<html>

<head>
    <meta charset='utf-8'>
    <title>Checkbox</title>
    <script>
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
    </script>
</head>

<body>
    <h1 style='color:violet'>
        Checkbox
    </h1>
    <!-- <a href='testfile.html'>goto test</a> -->
    <form>
        <input type='checkbox' class='cbs' id='cb1' onclick="CheckOn(this)">
        <input type='text' id='input1'>
        <br>
        <input type='checkbox' class='cbs' id='cb2' onclick="CheckOn(this)">
        <input type='text' id='input2'>
        <br>
        <input type='checkbox' class='cbs' id='cb3' onclick="CheckOn(this)">
        <input type='text' id='input3'>
        <br>
        <input type='checkbox' class='cbs' id='cb4' onclick="CheckOn(this)">
        <input type='text' id='input4'>
        <br>
        <input type='checkbox' class='cbs' id='cb5' onclick="CheckOn(this)">
        <input type='text' id='input5'>
        <br>
        <input type='checkbox' class='cbs' id='cb6' onclick="CheckOn(this)">
        <input type='text' id='input6'>
        <br>
        <input type='checkbox' class='cbs' id='cb7' onclick="CheckOn(this)">
        <input type='text' id='input7'>
        <br>
        <input type='checkbox' class='cbs' id='cb8' onclick="CheckOn(this)">
        <input type='text' id='input8'>
        <br>
        <input type='checkbox' class='cbs' id='cb9' onclick="CheckOn(this)">
        <input type='text' id='input9'>
        <br>

        <input type='button' value='print' onclick="printDatas(this)">
    </form>
</body>

</html>
        `;
        response.writeHead(200);
        response.end(templete);
    }else{
        response.writeHead(404);
        response.end('Not found');
    }
    
});
app.listen(3000);