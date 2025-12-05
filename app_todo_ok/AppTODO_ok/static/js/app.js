// Carica le task all'avvio
window.onload = loadTasks;

// Aggiunge un nuovo messaggio
async function addTask() {
    const text = document.getElementById("msgText").value.trim();
    if (!text) return;

    const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    if (res.ok) {
        document.getElementById("msgText").value = "";
        loadTasks();
    } else {
        alert("Errore nell'aggiunta del messaggio");
    }
}

// Carica tutte le task
async function loadTasks() {
    const list = document.getElementById("msgList");
    list.innerHTML = " ";

    const res = await fetch("/api/tasks");
    if (!res.ok) {
        list.innerHTML = "<li>Errore nel caricamento</li>";
        return;
    }

    const data = await res.json();

    data.tasks.forEach(msg => {
        const li = document.createElement("li");
        li.textContent = msg.text;

        // Permetti elim. solo se il messaggio è dell'utente
        if (msg.isOwner) {
            const del = document.createElement("button");
            del.textContent = "🗑️";
            del.className = "deleteBtn";
            del.onclick = () => deleteTask(msg._id);
            li.appendChild(del);
        }

        list.appendChild(li);
    });
}

// Elimina il messaggio
async function deleteTask(id) {
    const res = await fetch("/api/tasks/" + id, {
        method: "DELETE"
    });

    if (res.ok) {
        loadTasks();
    } else {
        alert("Errore nell'eliminazione");
    }
}

// Logout
async function logout() {
    await fetch("/api/logout");
    window.location.href = "/static/login.html";
}
