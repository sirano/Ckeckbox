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
체크시 액션, 스타일 변경
수정, 삭제버튼???

*/

let template= (checkboxTemp) =>{
    return `<!doctype html>
<html>

<head>
    <meta charset='utf-8'>
    <title>Checkbox</title>
    <script></script>
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
        temp+=`
        <input type='checkbox' name='ck${id}'>
        <input type='text' name='item${id}' value='${item}'>
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
            console.log(lists);
            let Jlists=JSON.parse(lists);
            let mainCheckTemp=checkboxTemp(Jlists);
            console.log(mainCheckTemp);
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
            let idNum=2;
            Jpost.id=idNum;
            fs.readFile('data/CheckList.json', 'utf-8', (err, lists)=>{
                let Jlists=JSON.parse(lists);
                let topID=0;
                for (let i=0;i<Jlists.length;i++){ //좀더 나은 정렬방법??
                    // console.log(Jlists[i].id);
                    topID<Jlists[i].id ? topID= Jlists[i].id : topID=topID;
                };
                let idNum=topID+1;
                Jpost.id=idNum;
                Jlists.push(Jpost);
                console.log(Jlists);
                let Jlists_string=JSON.stringify(Jlists)
                fs.writeFile('data/CheckList.json',Jlists_string, (err)=>{
                    response.writeHead(302, {Location:'/'});
                    response.end();
                });
            });
            
        });
    }else{
        response.writeHead(404);
        response.end('Not found');
    }
    
});
app.listen(3000);

