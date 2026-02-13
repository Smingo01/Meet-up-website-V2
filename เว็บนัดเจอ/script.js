/* ==================================================
   GLOBAL STATE
================================================== */

let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
let ratings = JSON.parse(localStorage.getItem("ratings")) || {};

/* ==================================================
   AUTH SYSTEM
================================================== */

function checkAuth(){
    const isLoggedIn = localStorage.getItem("loggedIn");
    const currentPage = window.location.pathname.split("/").pop();

    if(!isLoggedIn && currentPage !== "login.html"){
        window.location.href = "login.html";
    }

    if(isLoggedIn && currentPage === "login.html"){
        window.location.href = "appointment.html";
    }
}

function login(e){
    e.preventDefault();

    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if(user === "admin" && pass === "1234"){
        localStorage.setItem("loggedIn","true");
        window.location.href="appointment.html";
    }else{
        alert("Invalid Login");
    }
}

function logout(){
    localStorage.removeItem("loggedIn");
    window.location.href="login.html";
}

/* ==================================================
   DARK MODE
================================================== */

function toggleDarkMode(){
    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        localStorage.setItem("darkMode","true");
    }else{
        localStorage.setItem("darkMode","false");
    }

    updateDarkIcon();
}

function updateDarkIcon(){
    const btn = document.getElementById("darkToggle");
    if(!btn) return;

    if(document.body.classList.contains("dark")){
        btn.innerText = "☀";
    }else{
        btn.innerText = "🌙";
    }
}

/* ==================================================
   APPOINTMENT SYSTEM
================================================== */

function displayAppointments(){
    const list = document.getElementById("appointmentList");
    if(!list) return;

    list.innerHTML = "";

    appointments.forEach(appt=>{
        list.innerHTML += `
        <div class="card">
            <strong>Meeting with: ${appt.person}</strong><br>
            Booked by: ${appt.name}<br>
            ${appt.date} - ${appt.time}<br>
            ${appt.email}
        </div>
        `;
    });
}

function bookAppointment(e){
    e.preventDefault();

    const person = document.getElementById("selectedPerson").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if(!person){
        alert("Please select a person first!");
        return;
    }

    const isDuplicate = appointments.some(appt =>
        appt.date === date &&
        appt.time === time &&
        appt.person === person
    );

    if(isDuplicate){
        alert("This time slot is already booked!");
        return;
    }

    appointments.push({person,name,email,date,time});
    localStorage.setItem("appointments",JSON.stringify(appointments));

    alert("Appointment Booked!");
    e.target.reset();

    document.getElementById("selectedPerson").value="";
    document.querySelectorAll(".person-card")
        .forEach(card=>card.classList.remove("selected"));

    displayAppointments();
}

/* ==================================================
   RATING SYSTEM
================================================== */

function renderRatings(){
    const cards = document.querySelectorAll(".person-card");

    cards.forEach(card=>{
        const name = card.getAttribute("data-name");
        const ratingContainer = card.querySelector(".rating-stars");
        if(!ratingContainer) return;

        ratingContainer.innerHTML = "";

        const savedRating = ratings[name] || 0;

        for(let i=1;i<=5;i++){
            const star = document.createElement("span");
            star.innerText = i <= savedRating ? "⭐" : "☆";
            star.style.cursor = "pointer";

            star.addEventListener("click",function(){
                ratings[name] = i;
                localStorage.setItem("ratings",JSON.stringify(ratings));
                renderRatings();
            });

            ratingContainer.appendChild(star);
        }
    });
}

/* ==================================================
   NAV VISIBILITY
================================================== */

function handleNavbar(){
    const isLoggedIn = localStorage.getItem("loggedIn");
    const nav = document.querySelector("nav");
    if(!nav) return;

    if(!isLoggedIn){
        nav.style.display = "none";
    }
}

/* ==================================================
   INIT
================================================== */

document.addEventListener("DOMContentLoaded",function(){

    checkAuth();
    handleNavbar();

    if(localStorage.getItem("darkMode")==="true"){
        document.body.classList.add("dark");
    }

    updateDarkIcon();
    displayAppointments();
    renderRatings();

    const cards = document.querySelectorAll(".person-card");

    cards.forEach(card=>{
        card.addEventListener("click",function(){
            cards.forEach(c=>c.classList.remove("selected"));
            this.classList.add("selected");

            const selectedInput =
                document.getElementById("selectedPerson");

            if(selectedInput){
                selectedInput.value =
                    this.getAttribute("data-name");
            }
        });
    });

});