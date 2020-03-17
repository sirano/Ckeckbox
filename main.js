var http = require('http');
var fs = require('fs');
var url= require('url'); //http, fs, url 모듈 사용 선언
var qs = require('querystring');

/*
|[--- 항목 입력 ---]|
|[] 항목1  -------- |
|[] 항목2  -------- |
|[] 항목3  -------- | 입력할때마다 추가

입력 -> 데이터에 추가 -> 화면에 표시
(수정)
체크->삭제 ->해당 데이터 삭제

v저장은 어디에?

vCL 내부에 [] 존재
vCL 불러온다
v[]에 추가한다
v새로운 []을 CL에 넣는다

v화면표시
v체크 리스트 템플릿
v자료수만큼 만들기, 체크박스
v체크시 액션, 스타일 변경
수정, 삭제버튼???

v체크시 액션, 스타일 변경
vonclick -> js checkOn
v- onclick 시 스타일 변경
v- 백엔드에 저장
v    js CheckOn -> /check_process?id=__ 링크로 이동 -> json에서 id 검색, ->해당항목의 ch 바꾸기
v    ->리디렉션
v- 백엔드 설정대로 불러오기

수정, 삭제버튼???
v-수정. 버튼클릭 -> (id=.. item=..)링크로 이동 -> json에서 id 검색 -> item 바꾸기

*/

let template= (checkboxTemp) =>{
    return `<!doctype html>
<html>

<head>
    <meta charset='utf-8'>
    <title>Checkbox</title>
    <script>
        function CheckOn(self){
            console.log(self.checked)

            let cbNum=self.name.substr(2);
            let itemID='item'+cbNum;
            console.log(itemID);
            if(self.checked){
                self.form[itemID].style.textDecoration='line-through'
                self.form[itemID].style.color='gray'
                location.href=\`/check_process?id=\${cbNum}\`;
            }else{
                self.form[itemID].style.textDecoration=' none '
                self.form[itemID].style.color='black'
                location.href=\`/check_process?id=\${cbNum}\`;
            }
        }
function changeItem(self){
    let cbNum=self.name.substr(6);
    let afterIt=document.querySelector(\`#item\${cbNum}\`).value
    console.log(afterIt);
    location.href=\`/change_process?id=\${cbNum}\&item=\${afterIt}\`;
    
};
function deleteItem(self){
    let cbNum=self.name.substr(6);
    location.href=\`/delete_process?id=\${cbNum}\`;
};
function getAway(self){
    location.href='/getAway_process';
};
</script>
</head>

<body>
    <h1 style='color:darkslategrey'>
        <a href="/">Checkbox</a>
    </h1>
    <p style='color:white'>
        다음목표 : 나의 Checkbox
    </p>
    <div style="line-height:1.7em">
        <form action='/newItem' method='post'>
            <input type='text' name='item' placeholder='Write new item'>
            <input type='submit' value='enter'>
        </form>
        <br>
        <form action='/newItem' method='post'>
            ${checkboxTemp}
            <input type='button' value='체크한 항목 지우기' onclick="getAway(this)">
        </form>
    </div>
</body>

</html>`;
};

let checkboxTemp=(list)=>{
    let temp='';
    for (let i=0; i<list.length; i++){
        let id=list[i].id;
        let item=list[i].item;
        let checked= list[i].ch ? 'checked' :'';
        let ckStyle= list[i].ch ?'style="text-decoration: line-through; color: gray;"':'';
        temp+=`
        <input type='checkbox' name='ck${id}' onclick="CheckOn(this)" ${checked}>
        <input type='text' name='item${id}' id='item${id}' value='${item}' ${ckStyle} >
        <input type='button' value='수정' name='change${id}' onclick="changeItem(this)">
        <input type='button' value='삭제' name='delete${id}' onclick="deleteItem(this)">
        <br>`    
    };
    return temp;
};

var app = http.createServer(function(request, response) {
    var _url = request.url;
    var pathName = url.parse(_url, true).pathname;
    console.log(pathName)
    if (pathName==='/'){
        fs.readFile('data/CheckList.json', 'utf-8', (err, lists)=>{
            let Jlists=JSON.parse(lists);
            let mainCheckTemp=checkboxTemp(Jlists);
            let mainTemp=template(mainCheckTemp);
            response.writeHead(200);
            response.end(mainTemp); 
        });
    } else if(pathName==='/newItem') {
        let body='';
        request.on('data', function(data){ 
            body+=data;
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        })
        //더이상 들어올 정보가 없을때 'end' 호출
        request.on('end', function(){
            console.log(body);         // id=_ & item=__
            let post=qs.parse(body);    // [Object: null prototype]{ id :"__", item :"__"} ->문서화되지 않은 object
            //console.log(JSON.stringify(post)); //{"id":"__","item":"__"} -> txt로 읽을 수 있는 string
            let Jpost=JSON.parse(JSON.stringify(post));  //{ id :"__", item :"__"} 모듈
            // JSON.parse(JSON.stringify()) 가뭐야???? ㅠ
            if( Jpost.item ===''){
                console.log('Write an item')     //alert로 바꾸고 싶다
                response.writeHead(302, {Location:'/'});
                response.end();
            }else{    
                fs.readFile('data/CheckList.json', 'utf-8', (err, lists)=>{
                    let Jlists=JSON.parse(lists);
                    let topID=0;
                    for (let i=0;i<Jlists.length;i++){ //좀더 나은 정렬방법??
                        // console.log(Jlists[i].id);
                        topID<Jlists[i].id ? topID= Jlists[i].id : topID=topID;
                    };
                    let idNum=topID+1;
                    Jpost.id=idNum;    //딕셔너리에 id 추가
                    Jpost.ch=false;    //딕셔너리에 체크여부 추가(기본값 false)
                    Jlists.push(Jpost);
                    console.log(Jlists);
                    let Jlists_string=JSON.stringify(Jlists)
                    fs.writeFile('data/CheckList.json',Jlists_string, (err)=>{
                        response.writeHead(302, {Location:'/'});
                        response.end();
                    });
                });
            };
            
            
        });
    } else if(pathName==='/check_process') {
        let queryData=url.parse(_url,true).query;
        let checkedID=queryData.id *1; //number 형으로 변환
        console.log(checkedID);
        fs.readFile('data/CheckList.json', 'utf-8', (err, lists)=>{
            let Jlists=JSON.parse(lists);         //읽은파일 json파일로 변환
            let searchNum=-1;
            for (let i=0;i<Jlists.length;i++){ //좀더 나은 정렬방법??
                if(Jlists[i].id===checkedID){
                    searchNum=i;
                }
            };
            console.log(Jlists[searchNum].ch); 
            if(Jlists[searchNum].ch){ //checked
                Jlists[searchNum].ch=false;
            }else{ //unchecked or undefined
                Jlists[searchNum].ch=true;
            }
            if (searchNum===-1){
                response.writeHead(200);
                response.end('<!doctype html>  <script>alert("Error")</script>');
            } else{
                console.log(Jlists);
                let Jlists_string=JSON.stringify(Jlists);
                fs.writeFile('data/CheckList.json',Jlists_string, (err)=>{
                    response.writeHead(302, {Location:'/'});
                    response.end();
                });
            }
        });
         
    } else if(pathName==='/change_process') {
        let queryData=url.parse(_url,true).query;
        console.log(queryData)
        let checkedID=queryData.id *1; //number 형으로 변환
        let afterItem=queryData.item;
        console.log(checkedID);
        fs.readFile('data/CheckList.json', 'utf-8', (err, lists)=>{
            let Jlists=JSON.parse(lists);         //읽은파일 json파일로 변환
            let searchNum=-1;
            for (let i=0;i<Jlists.length;i++){ //좀더 나은 정렬방법??
                if(Jlists[i].id===checkedID){
                    searchNum=i;
                }
            };
            console.log(Jlists[searchNum]); 
            if(afterItem===Jlists[searchNum].item){
                response.writeHead(200);
                response.end('<!doctype html>  <script>alert("write the changed item")</script>');
                
            }else if (searchNum===-1){
                response.writeHead(200);
                response.end('<!doctype html>  <script>alert("Error")</script>');
            }else{
                Jlists[searchNum].item=afterItem;
                let Jlists_string=JSON.stringify(Jlists);
                fs.writeFile('data/CheckList.json',Jlists_string, (err)=>{
                    response.writeHead(302, {Location:'/'});
                    response.end();
                });
            }
        });
        
    } else if(pathName==='/delete_process') {
        let queryData=url.parse(_url,true).query;
        console.log(queryData)
        let checkedID=queryData.id *1; //number 형으로 변환
        fs.readFile('data/CheckList.json', 'utf-8', (err, lists)=>{
            let Jlists=JSON.parse(lists);         //읽은파일 json파일로 변환
            let searchNum=-1;
            for (let i=0;i<Jlists.length;i++){ //좀더 나은 정렬방법??
                if(Jlists[i].id===checkedID){
                    searchNum=i;
                }
            };
            console.log(searchNum);
            console.log(Jlists[searchNum]);
            if (searchNum===-1){
                response.writeHead(200);
                response.end('<!doctype html>  <script>alert("Error")</script>');
            }else{
                Jlists.splice(searchNum, 1)
                let Jlists_string=JSON.stringify(Jlists);
                fs.writeFile('data/CheckList.json',Jlists_string, (err)=>{
                    response.writeHead(302, {Location:'/'});
                    response.end();
                });
            }
        });
    } else if(pathName==='/getAway_process') {
        fs.readFile('data/CheckList.json', 'utf-8', (err, lists)=>{
            let Jlists=JSON.parse(lists);         //읽은파일 json파일로 변환
            //여기할차례!!!
            for (let i=0;i<Jlists.length;i++){ //좀더 나은 정렬방법??
                if(Jlists[i].checked){
                    
                }
            };
                
            
            // console.log(Jlists[searchNum]); 
            // if(afterItem===Jlists[searchNum].item){
            //     response.writeHead(200);
            //     response.end('<!doctype html>  <script>alert("write the changed item")</script>');
                
            // }else if (searchNum===-1){
            //     response.writeHead(200);
            //     response.end('<!doctype html>  <script>alert("Error")</script>');
            // }else{
            //     Jlists[searchNum].item=afterItem;
            //     let Jlists_string=JSON.stringify(Jlists);
            //     fs.writeFile('data/CheckList.json',Jlists_string, (err)=>{
            //         response.writeHead(302, {Location:'/'});
            //         response.end();
            //     });
            // }
        });
    }else{
        response.writeHead(404);
        response.end('Not found');
    }
    
});
app.listen(3000);

