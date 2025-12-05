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

    if (res.status === 200)
        location.href = "tasks.html";
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

    if (res.status === 201)
        location.href = "login.html";
}


async function logout() {
    await fetch("/api/logout", {method: "POST"});
    location.href = "login.html";
}


async function loadTasks() {
    const res = await fetch("/api/tasks");

    if (res.status !== 200) {
        location.href = "login.html";
        return;
    }

    const data = await res.json();
    const list = document.getElementById("msgList");
    list.innerHTML = "";

    const currentUser = data.currentUser;

    data.items.forEach(t => {
        const li = document.createElement("li");
        li.className = t.done ? "done" : "";

        // Mostra "utente: messaggio"
        const textSpan = document.createElement("span");
        textSpan.textContent = `${t.owner}: ${t.text}`;

        // Area icone
        const actions = document.createElement("div");

        // Mostra cestino solo se il messaggio è dell'utente loggato
        if (t.owner === currentUser) {
            const del = document.createElement("button");
            del.className = "icon-btn";
            del.innerHTML = '<i class="fa-solid fa-trash" title="Elimina"></i>';
            del.onclick = () => deleteTask(t.id);
            actions.appendChild(del);
        }

        li.appendChild(textSpan);
        li.appendChild(actions);
        list.appendChild(li);
    });
}

async function addTask() {
    const text = document.getElementById("msgText").value;

    await fetch("/api/tasks", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text})
    });

    loadTasks();
}


async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, {method: "DELETE"});
    loadTasks();
}

if (location.pathname.endsWith("tasks.html"))
    loadTasks();