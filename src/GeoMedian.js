function geometricMedian(dataPoints, tol = 1e-6) {
    const numPoints = dataPoints.length;
    const numDimensions = dataPoints[0].pos.length;

    // Initial estimate for the geometric median (you can choose any point as the initial estimate)
    let estimate = Array(numDimensions).fill(0);
    
    // Convert data points to a 2D array
    const data = dataPoints.map(point => point.pos);

    while (true) {
        // Compute the weight for each data point based on the inverse of the Euclidean distance to the estimate
        let weights = data.map(point => 1 / euclideanDistance(point, estimate));
        
        // Normalize the weights so they sum to 1
        const weightSum = weights.reduce((acc, weight) => acc + weight, 0);
        weights = weights.map(weight => weight / weightSum);

        // Calculate the weighted average based on the weights
        let newEstimate = Array(numDimensions).fill(0);
        for (let i = 0; i < numPoints; i++) {
            for (let j = 0; j < numDimensions; j++) {
                newEstimate[j] += data[i][j] * weights[i];
            }
        }

        // Check for convergence
        if (euclideanDistance(newEstimate, estimate) < tol) {
            return newEstimate;
        }
        
        estimate = newEstimate;
    }
}

// Euclidean distance between two points
function euclideanDistance(point1, point2) {
    let sum = 0;
    for (let i = 0; i < point1.length; i++) {
        sum += (point1[i] - point2[i]) ** 2;
    }
    return Math.sqrt(sum);
}

export default geometricMedian;