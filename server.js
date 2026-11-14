require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");

const server = express();

server.use(express.static(__dirname + "/public"));
server.use(express.json());

const conn = mysql.createPool({
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.NAME_DB,
    connectionLimit: 5
});

server.post("/addStudent", async (req, res) => {
    const { last_name, first_name, email, group_st } = req.body;
    try {
        await conn.query(
            "INSERT INTO students(last_name, first_name, email, group_st) VALUES (?,?,?,?)",
            [last_name, first_name, email, group_st]
        );
        res.status(200).json({ message: "Студент успешно добавлен" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Ошибка при выполнении запроса на добавление студента" });
    }
});

server.post("/updateStudent", async (req, res) => {
    const { last_name, first_name, email, group_st, id } = req.body;
    try {
        const [result] = await conn.query(
            "UPDATE students SET last_name = ?, first_name = ?, email = ?, group_st = ? WHERE id_st = ?",
            [last_name, first_name, email, group_st, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Студент с таким ID не найден" });
        }
        res.status(200).json({ message: "Данные студента успешно изменены" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Ошибка при выполнении запроса на редактирование данных студента" });
    }
});

server.post("/deleteStudent", async (req, res) => {
    const { id } = req.body;
    try {
        const [result] = await conn.query("DELETE FROM students WHERE id_st = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Студент с таким ID не найден" });
        }
        res.status(200).json({ message: "Студент успешно удален" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Ошибка при выполнении запроса на удаление студента" });
    }
});

// Создаёт таблицу students, если её ещё нет в базе
async function initDb() {
    try {
        await conn.query(`CREATE TABLE IF NOT EXISTS students (
            id_st INT AUTO_INCREMENT PRIMARY KEY,
            last_name VARCHAR(100) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL,
            group_st VARCHAR(50) NOT NULL
        )`);
        console.log("База данных подключена, таблица students готова");
    } catch (err) {
        console.log("Не удалось подключиться к базе данных:", err.message);
    }
}

const port = process.env.PORT || 3000;
server.listen(port, "0.0.0.0", () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    initDb();
});
