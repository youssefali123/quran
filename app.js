let read = document.getElementById("read");


function getAPI(ayahNum){
    read.innerHTML = "";
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
        const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        for(let i = 0; i < ayahsLength; i++){
            /*.replaceAll("۞", " ")*/
            let text = data.data.surahs[ayahNum-1].ayahs[i].text.replaceAll("۞", " ");
            let num = data.data.surahs[ayahNum-1].ayahs[i].numberInSurah;
            // console.log(`${num} - ${text}`);
            let content = document.createElement("div");
            let words = text.split(" ");
            let word = document.createElement("span");
            words.forEach((word)=>{
                let span = document.createElement("span");
                span.innerHTML = `${word} `;
                // content.appendChild(span);
            })
            // console.log(words)
            content.className = "ayah";
            content.id = num;
            num = num.toString().replace(/\d/g, d => arabicNumbers[d])
            
            content.innerHTML = `${text} <lable class="ayahNum">﴿${num}﴾</lable>`;
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
                // 2_1  2 >> sura num  , 1 >> ayah num
                // nasser elqtami : https://the-quran-project.github.io/Quran-Audio/Data/3/2_1.mp3
                let src = data.data.surahs[ayahNum-1].ayahs;
                getAudio(id, src, ele, ayahNum);
            })
            
        }
    })
}
// getAPI(60)
function getAudio(id, src, ele, n){
    ele.forEach((e)=>{
        let children = e.getElementsByTagName("audio")[0];
        if(children){
            console.log(children)
            e.classList.remove("played")
            children.remove()
        }
    })
    let curId = id - 1;
    // let audio = src[curId].audio;
    
    let audio = `https://the-quran-project.github.io/Quran-Audio/Data/3/${n}_${id}.mp3`;
    let ayah = document.getElementById(`${id}`);
    let audioTag = document.createElement("audio");
    audioTag.src = audio;
    ayah.appendChild(audioTag);
    audioTag.pause();
    // ayah.classList.add("played");
    // console.log(ayah)
    ayah.classList.toggle("played");
    if(ayah.classList.contains("played")){
        // ayah.classList.add("played");
        audioTag.play();
        setInterval(()=>{
        let dur = audioTag.duration;          
        let seconds = audioTag.currentTime;
        if(dur == seconds){
            if(id == src.length){
                id = 0;
                console.log("last ayah");
                ele.forEach((e)=>{
                    let children = e.getElementsByTagName("audio")[0];
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
                // audio = src[id-1].audio;
                audio = `https://the-quran-project.github.io/Quran-Audio/Data/3/${n}_${id}.mp3`;

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
        let audio = e.target.getElementsByTagName("audio")[0];
        console.log(audio)
        e.target.classList.remove("played");
        console.log(e.target.classList)
        audio.pause();
        audio.remove();
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
