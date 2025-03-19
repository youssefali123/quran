let read = document.getElementById("read");


function getAPI(ayahNum){
    let div = document.createElement("div");
    fetch("https://api.alquran.cloud/v1/quran/ar.alafasy").then( (res)=>{
        return res.json()
    }).then((data)=>{
        // console.log(data.data.surahs[1].ayahs[2].numberInSurah);
        let length = data.data.surahs.length;
        let ayahsLength = data.data.surahs[ayahNum - 1].ayahs.length;
        // for (let i = 0; i < length; i++) {
        //     console.log(data.data.surahs[i].name);
        //     console.log(data.data.surahs[i].number);
        // }
        for(let i = 0; i < ayahsLength; i++){
            /*.replaceAll("۞", " ")*/
            let text = data.data.surahs[ayahNum-1].ayahs[i].text.replaceAll("۞", " ");
            let num = data.data.surahs[ayahNum-1].ayahs[i].numberInSurah;
            // console.log(`${num} - ${text}`);
            let content = document.createElement("div");
            content.className = "ayah";
            content.id = num;
            content.innerHTML = `${text} (${num})`;
            div.innerHTML += `(${num}) - ${text} `;
            read.appendChild(content);
        }
    })
    document.addEventListener("click", (e)=>{
        if(e.target.className == "ayah"){
            let ele = document.querySelectorAll(".ayah");
            let id = e.target.id;
            let ayah = document.getElementById(id);
            fetch("https://api.alquran.cloud/v1/quran/ar.alafasy").then( (res)=>{
                return res.json()
            }).then((data)=>{
                let src = data.data.surahs[ayahNum-1].ayahs;
                getAudio(id, src, ele);
            })
            
        }
    })
}
// getAPI(60)
function getAudio(id, src, ele){
    ele.forEach((e)=>{
        let children = e.children[0];
        if(children){
            console.log(children)
            e.classList.remove("played")
            children.remove()
        }
    })
    let curId = id - 1;
    let audio = src[curId].audio;
    let ayah = document.getElementById(`${id}`);
    let audioTag = document.createElement("audio");
    audioTag.src = audio;
    ayah.appendChild(audioTag);
    audioTag.pause();
    // ayah.classList.add("played");
    // console.log(ayah)
    if(!ayah.classList.contains("played")){
        ayah.classList.add("played");
        audioTag.play();
        setInterval(()=>{
        let dur = audioTag.duration;          
        let seconds = audioTag.currentTime;
        if(dur == seconds){
            if(id == src.length){
                id = 0;
                console.log("last ayah");
                ele.forEach((e)=>{
                    let children = e.children[0];
                    if(children){
                        console.log(children)
                        e.classList.remove("played")
                        children.remove()
                    }
                })
            }
            id++;
            let next = document.getElementById(`${id}`);
            
            ele.forEach((e)=>{
                e.classList.remove("played");
            });
            if(next){
                next.classList.add("played");
                audio = src[id-1].audio;
                audioTag.src = audio;
                next.scrollIntoView({ behavior: "smooth" });
                next.appendChild(audioTag);
                audioTag.play();
            }
            
        }
    })
}
}


document.addEventListener("dblclick", (e)=>{ 
    document.body.classList.toggle("dark"); 
    window.localStorage.setItem("dark", document.body.classList.contains("dark"));  
})
window.addEventListener("load", ()=>{
    if(window.localStorage.getItem("dark") == "true"){
        document.body.classList.add("dark");
    }
})
let ayah = document.getElementById("ayah");
let btn = document.getElementById("btn");
getAPI(1);
btn.addEventListener("click", ()=>{
    read.innerHTML = "";
    getAPI(parseInt(ayah.value));
})
document.addEventListener("click", (e)=>{
    if(e.target.classList.contains("played")){
        let audio = e.target.children[0];
        console.log(audio)
        audio.remove();
        e.target.classList.remove("played");
        audio.pause();
    }
})
// function getData(num){
//     let res = []
//     fetch("https://api.alquran.cloud/v1/quran/ar.alafasy").then( (res)=>{
//         return res.json()
//     }).then((data)=>{
//         console.log(data.data.surahs[num-1])
//         res.push(data.data.surahs[num-1]);
//     })
//     return res;
// }
// let data;

// setTimeout(()=>{
//     data = getData(1);
// }, 200);

// function printSurahs(){
//     let a =  setInterval(()=>{
//     if(data){  
//         console.log(data[0].ayahs.length)
//         let length = data[0].ayahs.length;
//     for(let i = 0; i < length; i++){
//         let text = data[0].ayahs[i].text.replaceAll("۞", " ");
//         let num = data[0].ayahs[i].numberInSurah;
//         let content = document.createElement("div");
//         let audioTag = document.createElement("audio");
//         audioTag.controls = true;
//         audioTag.src = data[0].ayahs[i].audio;
//         content.appendChild(audioTag);
//         content.className = "ayah";
//         content.id = num;
//         content.innerHTML = `${text} (${num})`;
//         read.appendChild(content);
//     }
//     clearInterval(a); 
//     }
// }, 100)
// }
// printSurahs();