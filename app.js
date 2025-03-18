let read = document.getElementById("read");


function getAPI(){
    let div = document.createElement("div");
    fetch("https://api.alquran.cloud/v1/quran/ar.alafasy").then( (res)=>{
        return res.json()
    }).then((data)=>{
        // console.log(data.data.surahs[1].ayahs[2].numberInSurah);
        let length = data.data.surahs.length;
        let ayahsLength = data.data.surahs[11].ayahs.length;
        // for (let i = 0; i < length; i++) {
        //     console.log(data.data.surahs[i].name);
        //     console.log(data.data.surahs[i].number);
        // }
        for(let i = 0; i < ayahsLength; i++){
            /*.replaceAll("۞", " ")*/
            let text = data.data.surahs[11].ayahs[i].text.replaceAll("۞", " ");
            let num = data.data.surahs[11].ayahs[i].numberInSurah;
            // console.log(`${num} - ${text}`);
            let content = document.createElement("div");
            content.className = "ayah";
            content.id = num;
            content.innerHTML = `${text} (${num})`;
            div.innerHTML += `(${num}) - ${text} `;
            read.appendChild(content);
            // document.body.appendChild(content);
            // document.body.appendChild(document.createElement("br"))
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
                // let audio = data.data.surahs[11].ayahs[id-1].audio;
                // let audioTag = document.createElement("audio");
                // audioTag.src = audio;
                // audioTag.play();
                // console.log("audioTag.paused", audioTag.paused);
                // let currentId = id - 1;
                // ayah.style.backgroundColor = "red";
                let src = data.data.surahs[11].ayahs;
                getAudio(id, src, ele);
                // setInterval(()=>{
                //     if(audioTag.paused){
                //         ayah.style.backgroundColor = "#f9f8f6";
                //         currentId++;
                //         document.getElementById(`${currentId + 1}`).style.backgroundColor = "red";
                //         audio = data.data.surahs[11].ayahs[currentId].audio;
                //         audioTag.src = audio;
                //         audioTag.play();
                //     }
                // })
                
            })
            
        }
    })
}
getAPI()
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
    if(!ayah.classList.contains("played")){
        ayah.classList.add("played");
        audioTag.play();
        setInterval(()=>{
        let dur = audioTag.duration;          
        let seconds = audioTag.currentTime;
        if(dur == seconds){
            ele.forEach((e)=>{
                e.classList.remove("played")
            });
            id++;
            let next = document.getElementById(`${id}`);
            next.classList.add("played");
            audio = src[id-1].audio;
            audioTag.src = audio;
            next.scrollIntoView({ behavior: "smooth" });
            next.appendChild(audioTag);
            audioTag.play();
            
        }
    })
}
}


function getData(ayahNum){
        let myData;
        fetch("https://api.alquran.cloud/v1/quran/ar.alafasy").then( (res)=>{
            return res.json()
        }).then((data)=>{
            myData = data.data.surahs[ayahNum - 1];
        })
        return myData;
    // return
}

document.addEventListener("click", (e)=>{
    
    if(e.target.classList.contains("played")){
        let audio = e.target.children[0];
        e.target.classList.remove("played");
        audio.pause();
    }
})

