document.addEventListener('DOMContentLoaded', () => {
    const pageId = document.body.id;

    // --- Logic for Student List Page ---
    if (pageId === 'page-list') {
        const btn = document.getElementById('loadDataBtn');
        const tableBody = document.querySelector('#studentTable tbody');

        btn.addEventListener('click', () => {
            tableBody.innerHTML = ""; // Clear existing
            studentDataJSON.forEach(data => {
                const row = `
                    <tr>
                        <td>${data.id}</td>
                        <td>${data.name}</td>
                        <td>${data.school}</td>
                        <td>M: ${data.scores.math}, S: ${data.scores.science}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
            btn.textContent = "Data Refreshed";
        });
    }

    // --- Logic for Analysis Page (OOP) ---
    if (pageId === 'page-analysis') {
        const container = document.getElementById('analysis-container');
        
        studentDataJSON.forEach(data => {
            // OOP Instantiation
            const studentObj = new Student(data);
            const avg = studentObj.calculateAverage();
            const status = studentObj.getStatus();
            const statusClass = status === "Passing" ? "status-pass" : "status-fail";

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${studentObj.name}</h3>
                <p><strong>Average:</strong> ${avg}%</p>
                <p class="${statusClass}"><strong>Status:</strong> ${status}</p>
            `;
            container.appendChild(card);
        });
    }

    // --- Logic for Visualization Page (Chart.js) ---
    if (pageId === 'page-visuals') {
        const ctx = document.getElementById('gradesChart').getContext('2d');
        const subjectSelect = document.getElementById('subjectSelect');
        let myChart;

        function renderChart(subject) {
            const names = studentDataJSON.map(s => s.name);
            const grades = studentDataJSON.map(s => s.scores[subject]);

            if (myChart) myChart.destroy(); // Destroy old chart before creating new

            myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: names,
                    datasets: [{
                        label: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Scores`,
                        data: grades,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: { y: { beginAtZero: true, max: 100 } }
                }
            });
        }

        // Initial render
        renderChart('math');

        // Event Listener for Dropdown
        subjectSelect.addEventListener('change', (e) => {
            renderChart(e.target.value);
        });
    }

    // --- Logic for Map Page (Leaflet.js) ---
    if (pageId === 'page-map') {
        // Initialize Map centered on US
        const map = L.map('schoolMap').setView([39.8283, -98.5795], 4);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Loop through data and add markers
        studentDataJSON.forEach(data => {
            const studentObj = new Student(data); // Using OOP for cleaner data access
            
            L.marker(studentObj.getCoordinates())
                .addTo(map)
                .bindPopup(`<b>${studentObj.name}</b><br>${studentObj.school}`);
        });
    }
});