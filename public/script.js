// Отправляет данные формы на сервер и выводит ответ в нужный абзац
function sendForm(url, body, messageId) {
    const message = document.getElementById(messageId);
    message.textContent = "Отправка...";
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
    .then(response => response.json()
        .catch(() => ({ message: "Ошибка сервера (код " + response.status + ")" })))
    .then(data => { message.textContent = data.message; })
    .catch(error => { message.textContent = "Нет связи с сервером: " + error.message; });
}

document.getElementById("addForm").addEventListener("submit", (event) => {
    event.preventDefault();
    sendForm("/addStudent", {
        last_name: document.getElementById("last_name").value,
        first_name: document.getElementById("first_name").value,
        email: document.getElementById("email").value,
        group_st: document.getElementById("group_st").value
    }, "message1");
});

document.getElementById("updateForm").addEventListener("submit", (event) => {
    event.preventDefault();
    sendForm("/updateStudent", {
        id: document.getElementById("id").value,
        last_name: document.getElementById("last_name1").value,
        first_name: document.getElementById("first_name1").value,
        email: document.getElementById("email1").value,
        group_st: document.getElementById("group_st1").value
    }, "message2");
});

document.getElementById("deleteForm").addEventListener("submit", (event) => {
    event.preventDefault();
    sendForm("/deleteStudent", {
        id: document.getElementById("id2").value
    }, "message3");
});
