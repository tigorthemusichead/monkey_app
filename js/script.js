const timerCount = 3;
//Current data
const notFound = 'ПОДКЛЮЧИТЕ';
const notReady = 'ПОДОЖДИТЕ';
const ready = 'ГОТОВО';
let staticData = {
    current: {
        timerActive: 0,
        time: 0,
        name: null,
        state: -1,
        button: 0
    },
    timers: [{time:null, name:null},{time:null, name:null},{time:null, name:null}]
};
if(localStorage.getItem('staticData') != null)
    console.log('not null')
else
    localStorage.setItem('staticData',  JSON.stringify(staticData));

//Status checking
function getStatus(){

    const faceState = document.querySelector('#state');
    //timer loop setting up
    setInterval(()=> {

        if(staticData.current.state === 1){
            faceState.innerText = ready;
            faceState.style.color = '#6F7E6E';
        }
        else if(staticData.current.state === 0){
            faceState.innerText = notReady;
            faceState.style.color = '#AF9B59';
        }
        else{
            faceState.innerText = notFound;
            faceState.style.color = '#DD8C70';
        }
        // Try to send a request
        let err = 1;
        try {
            let request = new XMLHttpRequest();
            request.open('GET', 'http://192.168.4.1/state', true);
            request.onload = () => {
                if (request.readyState === 4 && request.status === 200) {
                    err = 0;
                    let response = request.responseText;
                    if (response === '1') {
                        staticData.current.state = 1;
                    }
                    else staticData.current.state = 0;
                }
            }
            request.send();
            // if something went wrong during sending
            } finally {
                if (err) staticData.current.state = -1;
            }
    }, 1000);

}

//Menu open and close
function toggleMenu(){
    const menu_box = document.querySelector('.menu_box');
    const box = document.querySelector('.box');
    if(!staticData.current.button) {
        if (box.style.width === "100vw") {
            box.style.width = "0vw";
            menu_box.style.width = "100vw";
        } else {
            menu_box.style.width = "0vw";
            box.style.width = "100vw";
        }
    }
}

const menu = document.querySelector(".menu");
menu.addEventListener('click', toggleMenu);


//Page onload
window.onload = ()=>{
    const tempStatic = JSON.parse(localStorage.getItem('staticData'));
    for(let i = 0; i < timerCount; i++){
        const name = document.querySelector(`#name${i+1}`);
        const minInput = document.querySelector(`#min${i+1}`);
        const secInput = document.querySelector(`#sec${i+1}`);

        name.value = tempStatic.timers[i].name;
        minInput.value = Math.floor(parseInt(tempStatic.timers[i].time) / 60);
        secInput.value = parseInt(tempStatic.timers[i].time) % 60;
    }
    getStatus();
}


//Choosing timer

//Choosing timer Callback
function chooseTimer(num){
    return () => {
        staticData.current.timerActive = 1;
        const name = document.querySelector(`#name${num}`).value;
        let min = document.querySelector(`#min${num}`).value;
        let sec = document.querySelector(`#sec${num}`).value;
        if(sec.length === 1)
            sec = '0' + sec;
        if(min.length === 1)
            min = '0' + min;
        //Changing the timer name
        const faceName = document.querySelector('.chosen_timer');
        faceName.innerText = name;
        //Changing the time
        const faceTime = document.querySelector('.time_left');
        faceTime.innerText = min + ':' + sec;
        staticData.current.name = name;
        staticData.current.time = parseInt(min) * 60 + parseInt(sec);
        if (isNaN(staticData.current.time))
            staticData.current.time = 0;
    }
}
//Correcting data
function checkTimeData(num){
    return () => {
        const name = document.querySelector(`#name${num}`).value;
        const minInput = document.querySelector(`#min${num}`);
        const secInput = document.querySelector(`#sec${num}`);
        if(parseInt(minInput.value) > 3)
            minInput.value = 3;
        if(parseInt(secInput.value) > 59)
            secInput.value = 59;
        //Local Storage
        let tempStatic = JSON.parse(localStorage.getItem('staticData'));
        tempStatic.timers[num-1].time = parseInt(minInput.value)*60 + parseInt(secInput.value);
        tempStatic.timers[num-1].name = name;
        localStorage.setItem('staticData', JSON.stringify(tempStatic));
    };
}
//Setting event listeners
for(let i = 1; i < timerCount+1; i++){
    document.querySelector(`#choose${i}`).addEventListener('click', chooseTimer(i));
    document.querySelector(`#min${i}`).addEventListener('blur', checkTimeData(i));
    document.querySelector(`#sec${i}`).addEventListener('blur', checkTimeData(i));
}
//No timer
document.querySelector('#choose0').addEventListener('click', ()=>{
    const faceName = document.querySelector('.chosen_timer');
    faceName.innerText = 'нет таймера';
    const faceTime = document.querySelector('.time_left');
    faceTime.innerText = '--:--';
    staticData.current.timerActive = 0;
});

//Timer Function
function setTimer(){
        let len = staticData.current.time;
        const faceTime = document.querySelector('.time_left');
        if(staticData.current.button === 0) {
            if (len && staticData.current.state && staticData.current.timerActive) {
                turn_on();
                staticData.current.button = 1;
                button.classList.add('button_on');
                let interval = setInterval(function timer() {
                    len--;
                    let min = Math.floor(len / 60).toString();
                    if (min.length === 1)
                        min = '0' + min;
                    let sec = (len % 60).toString();
                    if (sec.length === 1)
                        sec = '0' + sec;
                    faceTime.innerText = min + ':' + sec;
                    if ((len < 1)||(staticData.current.button === 0)) {
                        clearInterval(interval);
                        min = Math.floor(staticData.current.time / 60).toString();
                        sec = (staticData.current.time % 60).toString();
                        if (sec.length === 1)
                            sec = '0' + sec;
                        if (min.length === 1)
                            min = '0' + min;
                        faceTime.innerText = min + ':' + sec;
                        staticData.current.button = 0;
                        button.classList.remove('button_on');
                        turn_off();
                    }
                }, 1000);
            }
            else if(!staticData.current.timerActive){
                turn_on();
                staticData.current.button = 1;
                button.classList.add('button_on');
            }
        }
        else{
            staticData.current.button = 0;
            if(!staticData.current.timerActive)
                turn_off();
                button.classList.remove('button_on');
        }
}

const button = document.querySelector('.button');
button.addEventListener('click', setTimer);

