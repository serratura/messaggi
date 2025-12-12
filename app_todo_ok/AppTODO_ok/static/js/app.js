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
    const text = document.getElementById("msgText").value.trim();
    if (!text) return alert("Il messaggio non può essere vuoto.");
    await fetch("/api/tasks", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text})
    });
    document.getElementById("msgText").value = "";
    loadTasks();
}

async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, {method: "DELETE"});
    loadTasks();
}

function filtraMessaggi(lista, testo = "", utente = "") {
    return lista.filter(m => {
        const matchTesto = m.text.toLowerCase().includes(testo.toLowerCase());
        const matchUtente = m.owner.toLowerCase().includes(utente.toLowerCase());
        return matchTesto && matchUtente;
    });
}

function paginazione(lista, pagina, perPagina) {
    const start = (pagina - 1) * perPagina;
    return lista.slice(start, start + perPagina);
}

function mostraMessaggi(lista) {
    const ul = document.getElementById("msgList");
    ul.innerHTML = "";
    lista.forEach(m => {
        const li = document.createElement("li");
        li.className = m.done ? "done" : "";
        if (m.owner === currentUser) {
            li.classList.add("my_own");
            li.style.backgroundColor = "#d6d1dc";
        }
        const span = document.createElement("span");
        span.textContent = `${m.owner} (${m.date}): ${m.text}`;
        const actions = document.createElement("div");
        if (m.owner === currentUser) {
            const del = document.createElement("button");
            del.className = "icon-btn";
            del.innerHTML = '<i class="fa-solid fa-trash" title="Elimina"></i>';
            del.onclick = () => deleteTask(m.id);
            actions.appendChild(del);
        }
        li.appendChild(span);
        li.appendChild(actions);
        ul.appendChild(li);
    });
}

function aggiornaVista() {
    const testo = document.getElementById("search-text").value;
    const utente = document.getElementById("search-user").value;
    const filtrati = filtraMessaggi(tuttiMessaggi, testo, utente);
    const pagina = paginazione(filtrati, paginaCorrente, perPagina);
    mostraMessaggi(pagina);
    renderPaginationButtons(filtrati);
}

function renderPaginationButtons(listaFiltrata) {
    const container = document.getElementById("pagination");
    container.innerHTML = "";
    const totalePagine = Math.ceil(listaFiltrata.length / perPagina);
    if (totalePagine === 0) return;
    if (paginaCorrente > 1) {
        const prev = document.createElement("button");
        prev.textContent = "← Indietro";
        prev.onclick = () => { paginaCorrente--; aggiornaVista(); };
        container.appendChild(prev);
    }
    if (paginaCorrente < totalePagine) {
        const next = document.createElement("button");
        next.textContent = "Avanti →";
        next.onclick = () => { paginaCorrente++; aggiornaVista(); };
        container.appendChild(next);
    }
    document.getElementById("pagina-info").textContent =
        `Pagina ${paginaCorrente} di ${totalePagine}`;
}

if (location.pathname.endsWith("tasks.html")) {
    loadTasks();
}
