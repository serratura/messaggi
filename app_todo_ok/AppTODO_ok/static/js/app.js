let tuttiMessaggi = [];
let paginaCorrente = 1;
const perPagina = 10;
let currentUser = null;

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const res = await fetch("/api/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password})
    });
    const data = await res.json();
    alert(data.message || data.error);
    if (res.status === 200) location.href = "tasks.html";
}

async function registerUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const res = await fetch("/api/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password})
    });
    const data = await res.json();
    alert(data.message || data.error);
    if (res.status === 201) location.href = "login.html";
}

async function logout() {
    await fetch("/api/logout", {method: "POST"});
    location.href = "login.html";
}

async function loadTasks() {
    const res = await fetch("/api/tasks");
    if (res.status !== 200) return;
    const data = await res.json();
    currentUser = data.currentUser;
    tuttiMessaggi = data.items;
    paginaCorrente = 1;
    aggiornaVista();
}

async function addTask() {
    const text = document.getElementById("msgText
