const subjectData = {
    "1-2": ["Bangla", "English", "Math"],
    "3-5": ["Bangla", "English", "Math", "Science", "History"],
    "6-10": ["Bangla", "English", "Math", "Science", "History", "ICT", "Religion"]
};

function showSubjects() {
    const classSelected = document.getElementById("class").value;
    const subjectContainer = document.getElementById("subjectContainer");
    subjectContainer.innerHTML = "";  // Clear existing subjects

    let subjects;
    if (classSelected >= 1 && classSelected <= 2) {
        subjects = subjectData["1-2"];
    } else if (classSelected >= 3 && classSelected <= 5) {
        subjects = subjectData["3-5"];
    } else if (classSelected >= 6 && classSelected <= 10) {
        subjects = subjectData["6-10"];
    }

    if (subjects) {
        subjects.forEach(subject => {
            const subjectHTML = `
                <div class="subject">
                    <h3>${subject}</h3>
                    <label for="${subject}-formative">MCQ (out of 30):</label>
                    <input type="number" id="${subject}-formative" max="30" min="0" required><br>
                    <label for="${subject}-written">Written (out of 100):</label>
                    <input type="number" id="${subject}-written" max="100" min="0" required><br>
                    <span class="error-message" id="${subject}-error"></span>
                </div>
            `;
            subjectContainer.innerHTML += subjectHTML;
        });
    }
}

function calculateResult() {
    const subjects = document.querySelectorAll(".subject h3");
    const resultTableBody = document.querySelector("#resultTable tbody");
    let hasError = false;
    let totalGradePoints = 0;
    let dGradeCount = 0;
    let subjectCount = subjects.length;
    let hasFailed = false;

    resultTableBody.innerHTML = "";  // Clear previous results in the table
    document.getElementById("resultSection").style.display = "none";  // Hide result section initially

    // Reset the result message only, without affecting the table
    const resultMessageDiv = document.getElementById("resultMessage");
    resultMessageDiv.innerHTML = "";  // Clear only the result message

    subjects.forEach(subject => {
        const formativeInput = document.getElementById(`${subject.textContent}-formative`);
        const writtenInput = document.getElementById(`${subject.textContent}-written`);
        const errorMessage = document.getElementById(`${subject.textContent}-error`);

        const formativeMarks = parseFloat(formativeInput.value);
        const writtenMarks = parseFloat(writtenInput.value);

        // Clear previous errors
        errorMessage.textContent = "";
        formativeInput.classList.remove("error");
        writtenInput.classList.remove("error");

        // Check for errors
        if (formativeMarks > 30 || writtenMarks > 100) {
            hasError = true;

            if (formativeMarks > 30) {
                formativeInput.classList.add("error");
                errorMessage.textContent = `Formative marks must be less than or equal to 30.`;
            }

            if (writtenMarks > 100) {
                writtenInput.classList.add("error");
                errorMessage.textContent = `Written marks must be less than or equal to 100.`;
            }
        }

        if (!hasError) {
            const totalMarks = formativeMarks + (writtenMarks * 0.7);
            const gradeData = calculateGrade(totalMarks);

            // Add grade point to the total
            totalGradePoints += gradeData.gradePoint;

            // Count D grade
            if (gradeData.letterGrade === "D") {
                dGradeCount++;
            }

            // Check if student failed in any subject
            if (gradeData.letterGrade === "F") {
                hasFailed = true;
            }

            const resultRow = `
                <tr>
                    <td>${subject.textContent}</td>
                    <td>${totalMarks.toFixed(0)}</td>
                    <td>${gradeData.gradePoint}</td>
                    <td>${gradeData.letterGrade}</td>
                </tr>
            `;
            resultTableBody.innerHTML += resultRow;
        }
    });

    if (!hasError) {
        document.getElementById("resultSection").style.display = "block";

        // Calculate the average grade point
        let averageGradePoint = hasFailed ? 0 : (totalGradePoints / subjectCount);
        const avgGradeData = calculateAverageGrade(averageGradePoint);

        let avgRow = `
            <tr>
                <td colspan="2"><strong>Average Grade Point</strong></td>
                <td>${averageGradePoint.toFixed(2)}</td>
                <td style="${avgGradeData.letterGrade === 'F' ? 'color: red;' : ''}">${avgGradeData.letterGrade}</td>
            </tr>
        `;
        resultTableBody.innerHTML += avgRow;

        // Display messages based on the student's grades
        let resultMessage = "";

        if (hasFailed) {
            resultMessage = `
                <p style="color: red; font-weight: bold;">You're Failed!</p>
            `;
        } else if (dGradeCount >= 3) {
            resultMessage = `
                <p style="color: red; font-weight: bold;">You will not be promoted to the next class due to getting a D grade in more than 3 subjects. Contact your teacher.</p>
            `;
        } else {
            resultMessage = `
                <p style="color: green; font-weight: bold;">Congratulations!</p>
            `;
        }

        // Append the result message to the separate div
        resultMessageDiv.innerHTML = resultMessage;
    }
}


function calculateGrade(marks) {
    let gradePoint, letterGrade;

    if (marks >= 80) {
        gradePoint = 5.00;
        letterGrade = "A+";
    } else if (marks >= 70) {
        gradePoint = 4.00;
        letterGrade = "A";
    } else if (marks >= 60) {
        gradePoint = 3.50;
        letterGrade = "A-";
    } else if (marks >= 50) {
        gradePoint = 3.00;
        letterGrade = "B";
    } else if (marks >= 40) {
        gradePoint = 2.00;
        letterGrade = "C";
    } else if (marks >= 33) {
        gradePoint = 1.00;
        letterGrade = "D";
    } else {
        gradePoint = 0.00;
        letterGrade = "F";
    }

    return { gradePoint, letterGrade };
}

// Updated function to calculate average grade based on average grade point
function calculateAverageGrade(averageGradePoint) {
    let letterGrade;

    if (averageGradePoint === 5.00) {
        letterGrade = "A+";
    } else if (averageGradePoint >= 4.00) {
        letterGrade = "A";
    } else if (averageGradePoint >= 3.50) {
        letterGrade = "A-";
    } else if (averageGradePoint >= 3.00) {
        letterGrade = "B";
    } else if (averageGradePoint >= 2.50) {
        letterGrade = "B-";
    } else if (averageGradePoint >= 2.00) {
        letterGrade = "C";
    } else if (averageGradePoint >= 1.50) {
        letterGrade = "C-";
    } else if (averageGradePoint >= 1.00) {
        letterGrade = "D";
    } else {
        letterGrade = "F";
    }

    return { letterGrade };
}
