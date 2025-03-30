const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Submit Form Data
app.post('/api/submit', (req, res) => {
    const { reg_no, student_name, block_room, mess_name, mess_type, food_suggestion, meal_type, feasibility } = req.body;
    const query = 'INSERT INTO submissions (reg_no, student_name, block_room, mess_name, mess_type, food_suggestion, meal_type, feasibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [reg_no, student_name, block_room, mess_name, mess_type, food_suggestion, meal_type, feasibility], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Submission successful', id: result.insertId });
    });
});

// Generate Excel Report
app.get('/api/report/excel', (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Submissions');
    worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Reg No', key: 'reg_no', width: 15 },
        { header: 'Student Name', key: 'student_name', width: 20 },
        { header: 'Block & Room', key: 'block_room', width: 15 },
        { header: 'Mess Name', key: 'mess_name', width: 20 },
        { header: 'Mess Type', key: 'mess_type', width: 15 },
        { header: 'Food Suggestion', key: 'food_suggestion', width: 30 },
        { header: 'Meal Type', key: 'meal_type', width: 15 },
        { header: 'Feasibility', key: 'feasibility', width: 10 },
        { header: 'Submitted At', key: 'submitted_at', width: 20 }
    ];

    db.query('SELECT * FROM submissions', (err, results) => {
        if (err) return res.status(500).send(err);
        worksheet.addRows(results);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=submissions.xlsx');
        workbook.xlsx.write(res).then(() => res.end());
    });
});

// Generate PDF Report
app.get('/api/report/pdf', (req, res) => {
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=submissions.pdf');
    doc.pipe(res);

    doc.fontSize(16).text('Mess Menu Submissions', { align: 'center' });
    doc.moveDown();

    db.query('SELECT * FROM submissions', (err, results) => {
        if (err) throw err;
        results.forEach((row, index) => {
            doc.fontSize(12).text(`${index + 1}. ${row.student_name} (${row.reg_no})`);
            doc.text(`Block & Room: ${row.block_room}`);
            doc.text(`Mess: ${row.mess_name} (${row.mess_type})`);
            doc.text(`Suggestion: ${row.food_suggestion}`);
            doc.text(`Meal: ${row.meal_type}, Feasibility: ${row.feasibility}`);
            doc.text(`Submitted: ${row.submitted_at}`);
            doc.moveDown();
        });
        doc.end();
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));