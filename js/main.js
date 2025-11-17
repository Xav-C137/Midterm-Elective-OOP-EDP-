document.addEventListener('DOMContentLoaded', () => {
    
    // FETCH JSON DATA
    fetch('js/data.json')
        .then(response => {
            if (!response.ok) throw new Error("Failed to load data");
            return response.json();
        })
        .then(studentData => {
            initializePage(studentData);
        })
        .catch(error => {
            console.error('Error:', error);
            // Helpful error for local file issues
            document.querySelector('.container').innerHTML = 
                `<div style="text-align:center; color: red; margin-top:50px;">
                    <h2>⚠️ Data Load Error</h2>
                    <p>Could not load 'data.json'.<br>
                    If you are opening index.html directly, please use a <strong>Local Server</strong> (e.g., Live Server in VS Code).</p>
                </div>`;
        });
});

// MAIN PAGE LOGIC
function initializePage(studentData) {
    const pageId = document.body.id;

    // Active Nav Link Logic
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        if(link.getAttribute('href').includes(pageId.replace('page-', ''))) {
            link.classList.add('active');
        }
    });

    // --- HOME PAGE ---
    if (pageId === 'page-home') {
        document.getElementById('totalStudents').innerText = studentData.length;
        
        let grandTotal = 0;
        let count = 0;
        studentData.forEach(s => {
            const student = new Student(s);
            grandTotal += parseFloat(student.calculateAverage());
            count++;
        });
        document.getElementById('schoolAvg').innerText = (grandTotal / count).toFixed(1) + '%';
    }

    // --- STUDENT LIST PAGE ---
    if (pageId === 'page-list') {
        const tableBody = document.querySelector('#studentTable tbody');
        const searchInput = document.getElementById('searchInput');

        function renderTable(data) {
            tableBody.innerHTML = "";
            if(data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center">No students found</td></tr>`;
                return;
            }
            data.forEach(d => {
                const row = `
                    <tr>
                        <td>#${d.id}</td>
                        <td><strong>${d.name}</strong></td>
                        <td>${d.school}</td>
                        <td>M: ${d.scores.math} | S: ${d.scores.science}</td>
                    </tr>`;
                tableBody.innerHTML += row;
            });
        }
        renderTable(studentData);

        searchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = studentData.filter(s => 
                s.name.toLowerCase().includes(term) || s.school.toLowerCase().includes(term)
            );
            renderTable(filtered);
        });
    }

    // --- ANALYSIS PAGE ---
    if (pageId === 'page-analysis') {
        const container = document.getElementById('analysis-container');
        studentData.forEach(data => {
            const s = new Student(data);
            const status = s.getStatus();
            const badgeClass = status === "Passing" ? "badge-pass" : "badge-fail";
            const themeClass = status === "Passing" ? "pass" : "fail";

            const card = document.createElement('div');
            card.className = `card ${themeClass}`;
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between;">
                    <h3>${s.name}</h3>
                    <span class="badge ${badgeClass}">${status}</span>
                </div>
                <p>${s.school}</p>
                <h1>${s.calculateAverage()}%</h1>
            `;
            container.appendChild(card);
        });
    }

    // --- VISUALS PAGE ---
    if (pageId === 'page-visuals') {
        const ctx = document.getElementById('gradesChart').getContext('2d');
        const subjectSelect = document.getElementById('subjectSelect');
        let myChart;

        function renderChart(subject) {
            const names = studentData.map(s => s.name);
            const grades = studentData.map(s => s.scores[subject]);
            const colors = grades.map(g => g >= 75 ? 'rgba(20, 184, 166, 0.7)' : 'rgba(239, 68, 68, 0.7)');

            if (myChart) myChart.destroy();

            myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: names,
                    datasets: [{
                        label: subject.toUpperCase(),
                        data: grades,
                        backgroundColor: colors,
                        borderRadius: 5
                    }]
                },
                options: {
                    scales: {
                        y: { beginAtZero: true, max: 100 }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }
        renderChart('math');
        subjectSelect.addEventListener('change', (e) => renderChart(e.target.value));
    }

    // --- MAP PAGE ---
    if (pageId === 'page-map') {
        const map = L.map('schoolMap').setView([8.4197, 124.7577], 12);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap, &copy; CARTO'
        }).addTo(map);

        studentData.forEach(data => {
            const s = new Student(data);
            const color = s.getStatus() === "Passing" ? '#14b8a6' : '#ef4444';
            
            const icon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="background-color:${color}; width:15px; height:15px; border-radius:50%; border:2px solid white;"></div>`
            });

            L.marker(s.getCoordinates(), { icon: icon }).addTo(map)
                .bindPopup(`<b>${s.name}</b><br>${s.school}`);
        });
    }
}