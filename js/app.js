import { analyzeSchedules } from "./analyzer.js";

console.log("CrewMatch v2 iniciado");

const result = analyzeSchedules({}, {});
console.log(result);

const dashboard = document.getElementById("dashboard");
