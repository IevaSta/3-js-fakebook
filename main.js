
const baseUrl = 'https://randomuser.me/api/'; //pagrindine nuoroda
const people100 = '?results=100'; //paduodamas papildomas parametras
const feedActivity = 'https://www.boredapi.com/api/activity/';

const userName = document.getElementById('name');
const moreInfo = document.getElementById('basicInfo');
const photo = document.getElementById('userPhoto')


//random userio acc 
function userProfile(profile) {
    photo.src = profile.picture.large;

    userName.innerHTML +=
        `<h5>${profile.name.first} ${profile.name.last} </h5>`

    moreInfo.innerHTML +=
        `<div>Age: ${profile.dob.age}</div>
        <div>Country: ${profile.location.country}</div>
        <div>City: ${profile.location.city}</div>`
}

//useriu duomenys istraukiami is API
let people = [];

function getPeople() {
    fetch(baseUrl + people100)
        .then((response) => response.json()
            .then((data) => {
                people = data.results;

                //main profilis:
                mainProfile = people[33];

                //iskvieciamas VIENO userio pilnas acc
                userProfile(mainProfile)

                //iskvieciami random ŠEŠI tik su activities
                showFeed(people)
            }))

}
getPeople();


//random ŠEŠIŲ useriu activities istraukiami is API
function showFeed(people) {
    const feedContent = document.getElementById('feedContent');

    people.map((profile, index) => {
        if (index <= 5) {
            fetch(feedActivity)
                .then((response) => response.json()
                    .then((activityData) => {
                        feedContent.innerHTML +=
                            `<div class="col-12 col-md-4 col-lg-2 px-1">
                                <div class="card">
                                    <img src="${profile.picture.large}" alt="User picture" class="card-img-top">
                                    <div class="card-body">
                                        <h6 class="card-title ">${profile.name.first} ${profile.name.last}</h6>
                                        <p class="card-text"> 
                                        🌎 ${activityData.activity}
                                        <br>
                                        📄 ${activityData.type}
                                        <br>
                                        👥 ${activityData.participants}
                                        </p>
                                    </div>
                                </div>
                            </div>`
                    }))
        } else {
            return
        }
    })
}

//aktivuojamas activity room
const activityRoom = document.getElementById('activityRoom')
let participantsActive;

//kodinam mygtuka ir issikvieciam prisijungusiuos
function createActivityButton() {
    fetch(feedActivity)
        .then((response) => response.json()
            .then((activityData) => {
                activityRoom.innerHTML +=
                    `<h4>ACTIVITY ROOM STARTED</h4>
                    <p class="card-text text-light"> 
                        ACTIVITY: ${activityData.activity}
                        <br>
                        TYPE: ${activityData.type}
                    </p>
                    <div id="participantsActive">PARTICIPANTS: ${activityData.participants}</div>                        
                    `
                addParticipantsToRoom()
            }))
}

//kodinam, kas prisijungia
function addParticipantsToRoom() {
    participantsActive = document.getElementById('participantsActive');

    //prideda main profili i acitivity room pirma
    participantsActive.innerHTML +=
        `<div>
            <img src="${mainProfile.picture.thumbnail}">
            ${mainProfile.name.first} ${mainProfile.name.last}
        </div>`

    //prideda kitus random 5kis i activi room            
    let i = 0;
    let interval = setInterval(() => {
        const person = people[Math.floor(Math.random() * 100 + 1)];


        participantsActive.innerHTML +=
            `<div>
            <img src="${person.picture.thumbnail}">
            ${person.name.first} ${person.name.last}
            </div>`

        i++
        if (i == 5) clearInterval(interval)
    }, 1000)
}

//search 

const searchBar = document.getElementById('searchBar');
const charactersList = document.getElementById('charactersList');


searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();
    const suggestions = people.filter((character) => {
        if (searchString != '') {
            if (character.name.first.toLowerCase().includes(searchString) || character.name.last.toLowerCase().includes(searchString)) {
                return character
            }
            else {
                charactersList.innerHTML = ''
            }
        } else {
            charactersList.innerHTML = ''
        }
    })

    suggestions.map(character => {
        charactersList.innerHTML +=
            `<li class="list-group-item">
        <img src="${character.picture.thumbnail}">
        ${character.name.first} ${character.name.last}
        </li>`
    })

})
