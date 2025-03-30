# Mess Menu System

A web application designed for students to suggest mess menu items. Built with React (Next.js), Node.js, and MySQL, this project allows users to submit feedback and generate reports in Excel or PDF format.

## Project Structure

- **`frontend/`**: Contains the Next.js frontend with a user-friendly form interface.
- **`backend/`**: Houses the Node.js backend with MySQL integration for data storage and report generation.

## Prerequisites

Before setting up the project, ensure you have the following installed:
- **Node.js** (v18 or higher): [Download here](https://nodejs.org/)
- **MySQL Community Server**: [Download here](https://dev.mysql.com/downloads/)
- **Git**: [Download here](https://git-scm.com/)

## Setup Instructions

Follow these steps to run the project locally:

### 1. Clone the Repository
Clone the project from GitHub and navigate into the project directory:
```bash
git clone https://github.com/Swayam-Swaroop-Sahu/Mini-Project.git
cd Mini-Project


#Backend Setup
Set up the backend server and database:

##Navigate to the backend directory:
cd backend

##Install dependencies:
npm install

#Set up MySQL:
##Open the MySQL Command Line Client (e.g., mysql -u root -p) and run:
CREATE DATABASE mess_menu_system;
USE mess_menu_system;
CREATE TABLE submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reg_no VARCHAR(20) NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    block_room VARCHAR(20) NOT NULL,
    mess_name VARCHAR(50) NOT NULL,
    mess_type VARCHAR(20) NOT NULL,
    food_suggestion TEXT NOT NULL,
    meal_type VARCHAR(20) NOT NULL,
    feasibility VARCHAR(10) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

#Configure environment variables:
##Create a .env file in the backend/ directory with the following content (replace your_password with your MySQL root password):
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mess_menu_system
PORT=5000

##Start the backend:
node index.js
###You should see: Server running on port 5000 and Connected to MySQL.

#Frontend Setup
Set up the frontend application:
##Navigate to the frontend directory (open a new terminal if the backend is running):
cd frontend

##Install dependencies:
npm install

##npm install
npm run dev

###Open your browser and go to http://localhost:3000.

#Usage
Submit Feedback:
Fill out the form with your details (Registration Number, Name, etc.) and submit.
The data will be stored in the MySQL database.
Download Reports:
After submission, use the "Download Excel Report" or "Download PDF Report" buttons to generate and download reports.

#Notes
MySQL Requirement: Ensure MySQL is running locally before starting the backend.
Dependencies: The node_modules/ directories are excluded from GitHub (via .gitignore). Install them manually using npm install in both frontend/ and backend/ directories.
Port Conflicts: If port 5000 is in use, update the PORT variable in backend/.env to an available port and adjust the frontend axios URL accordingly.

#Acknowledgments
##This project was developed as a mini-project for the 4th semester Web Development course. Special thanks to the open-source community for tools like Next.js, shadcn/ui, and MySQL.

### Key Improvements
1. **Proper Markdown Syntax**: Added headings (`#`, `##`), code blocks (```), and bullet points for clarity.
2. **Structured Layout**: Separated sections logically (Prerequisites, Setup Instructions, Usage, etc.).
3. **Detailed Instructions**: Clarified steps like opening a new terminal and replacing `your_password`.
4. **Professional Tone**: Added an Acknowledgments section and links to download tools.
5. **Readability**: Used consistent formatting and concise language.

### How to Use This
1. **Replace Your Existing README.md**:
   - Open `README.md` in `C:\Users\Lenovo\Desktop\4rth Semester\Web Development\mess-menu-system` in VS Code.
   - Delete its current content and paste the above text.
   - Save the file.

2. **Commit and Push**:
   ```bash
   git add README.md
   git commit -m "Updated README with improved instructions"
   git push origin master