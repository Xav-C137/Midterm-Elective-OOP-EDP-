// This simulates an external JSON response.
// We use a variable here so you can run this without a local server.
const studentDataJSON = [
    {
        "id": 101,
        "name": "Alice Johnson",
        "school": "West High",
        "scores": { "math": 85, "science": 92, "english": 88 },
        "location": [40.7128, -74.0060] // New York coords
    },
    {
        "id": 102,
        "name": "Bob Smith",
        "school": "North Academy",
        "scores": { "math": 72, "science": 65, "english": 80 },
        "location": [34.0522, -118.2437] // LA coords
    },
    {
        "id": 103,
        "name": "Charlie Brown",
        "school": "East Prep",
        "scores": { "math": 95, "science": 98, "english": 92 },
        "location": [41.8781, -87.6298] // Chicago coords
    },
    {
        "id": 104,
        "name": "Diana Prince",
        "school": "South Tech",
        "scores": { "math": 88, "science": 76, "english": 85 },
        "location": [29.7604, -95.3698] // Houston coords
    },
    {
        "id": 105,
        "name": "Evan Wright",
        "school": "West High",
        "scores": { "math": 60, "science": 55, "english": 62 },
        "location": [40.7300, -74.0100] // NY nearby
    }
];