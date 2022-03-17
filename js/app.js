let btn = document.querySelector('.button');
let isOn = 0;


function turn_on(){
    /*
Посылает запрос на включение
Возвращает статус:
 1 - включен
 0 - не включен
-1 - ошибка при запросе
 */
    let request = new XMLHttpRequest();
    request.open('GET', 'http://192.168.4.1/turn_on', false);
    request.onload = () => {
        if(request.readyState === 4 && request.status === 200) {
            let response = request.responseText;
            return Number.parseInt(response);
        }
        else return -1;
    };
    request.send();
}

function turn_off(){
    /*
Посылает запрос на выключение
Возвращает статус:
1 - включен
0 - не включен
-1 - ошибка при запросе
*/
    let request = new XMLHttpRequest();
    request.open('GET', 'http://192.168.4.1/turn_off', false);
    request.onload = () => {
        if(request.readyState === 4 && request.status === 200){
            let response = request.responseText;
            return Number.parseInt(response);
        }
        else return -1;
    };
    request.send();
}

//document.addEventListener('DOMContentLoaded', ()=>{
//    let request = new XMLHttpRequest();
//    request.open('GET', '/relay_status', true);
//    request.onload = ()=>{
//        if(request.readyState === 4 && request.status === 200){
//            let response = request.responseText;
//            console.log(response);
//            isOn = !Number.parseInt(response);
//            if(isOn) btn.classList.add('button_on');
//        }
//    }
//    request.send()
//});

//btn.onclick = ()=>{
//    isOn = !isOn;
//    if(isOn){
//        btn.classList.add('button_on');
//        btn.classList.remove('button_off');
//    }
//    else{
//        btn.classList.add('button_off');
//        btn.classList.remove('button_on');
//    }
//    let request = new XMLHttpRequest();
//    request.open('GET', '/relay_switch', false);
//    request.send();
//}


