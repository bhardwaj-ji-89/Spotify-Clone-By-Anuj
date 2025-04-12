// console.log("Let's write JS");


// async function getSongs() {
//     let a = await fetch("http://127.0.0.1:3000/songs/");
//     let response = await a.text();
//     console.log(response);
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let as = div.getElementsByTagName("a");

//     let songs = [];
//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if (element.href.endsWith(".mp3")) {
//             songs.push(element.href)
//         }

//     }
//     return songs
// }

// async function main() {
//     // Get list of all songs
//     let songs = await getSongs();
//     console.log(songs);

//     let songUL = document.querySelector(".songList").getElementsByTagName("ul")
//     for (const song of songs) {
//         songUL.innerHTML = songUL.innerHTML + song;
//     }

//     // Play songs
//     var audio = new Audio(songs[2]);
//     // audio.play();

//     audio.addEventListener("loadeddata", () => {
//         let duration = audio.duration;
//         console.log(duration)
//     })
// }

// main()


console.log("Let's write JS");
let currentSong = new Audio();
let songs;
let currFolder;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

     songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    
     // Show all the songs in the playlist 
     let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
     songUL.innerHTML = ""
     for (const song of songs) {
         songUL.innerHTML = songUL.innerHTML + `<li> 
             
             <img class="invert" src="img/music.svg" alt="">
             <div class="info">
                 <div> ${song.replaceAll("%20", " ")}</div>
                 <div>Artist</div>
             </div>
             <div class="playnow">
                 <span>Play Now</span>
                 <img class="invert" src="img/play.svg" alt="">
             </div>
          </li>`;
     }
 
     // Attach an event listener to each songs 
     Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
         e.addEventListener("click", element => {
             console.log(e.querySelector(".info").firstElementChild.innerHTML)
             playMuscie(e.querySelector(".info").firstElementChild.innerHTML.trim())
         })
     })
 
}

const playMuscie = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track);
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {

    // Get list of all songs
   await getSongs("songs/BMB");
    playMuscie(songs[0], true)


   
    // Event listener to play, pre and new song 

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause();
            play.src = "img/play.svg"
        }
    })

    // Event listener to time update and duration

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Event listener seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Event listener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    // Event listener for Previous
    previous.addEventListener("click", () => {
        console.log(currentSong)

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMuscie(songs[index - 1])
        }
    })


    // Event listener for next
    next.addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs, index)

        if ((index + 1) > length) {
            playMuscie(songs[index + 1])
        }
    })

    // add an evnt to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })

    // load playlist whenver card is load
    Array.from(document.getElementsByClassName('card')).forEach(e => {
        console.log(e)
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })

}


main();



