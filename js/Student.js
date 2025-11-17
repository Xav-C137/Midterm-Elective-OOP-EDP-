// OOP: Student Class Definition
class Student {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.school = data.school;
        this.scores = data.scores;
        this.location = data.location;
    }

    // Method: Calculate average score
    calculateAverage() {
        const values = Object.values(this.scores);
        const sum = values.reduce((a, b) => a + b, 0);
        return (sum / values.length).toFixed(2); // Returns string with 2 decimals
    }

    // Method: Determine status
    getStatus() {
        const avg = this.calculateAverage();
        return avg >= 75 ? "Passing" : "Needs Improvement";
    }

    // Method: Get coordinates for map
    getCoordinates() {
        return this.location;
    }
}