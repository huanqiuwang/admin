export default (score, degree = 2) => `${(Math.floor(Number(score) * Math.pow(10, 2 + degree)) / Math.pow(10, degree)).toFixed(2)}%`

