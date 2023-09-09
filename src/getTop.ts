import { createEmbedding } from "./createEmbedding";
import json from "../data.json";
import { similarity } from "llamaindex";

let data = json as any[];

export async function getTop(question: string, count: number = 20) {
	const questionEmbedding = await createEmbedding(question);
	let topServices: any[] = [];
	let topScores: number[] = [];
	for (const service of data) {
		if (!service.emmbedings) continue;
		for (const emmbedings of service.emmbedings) {
			const sim = similarity(questionEmbedding, emmbedings);
			if (topScores.length < count) {
				topScores.push(sim);
				topServices.push(service);
			}
			if (topScores.length === count) {
				const minScore = Math.min(...topScores);
				const minIndex = topScores.indexOf(minScore);
				if (sim > minScore) {
					topScores[minIndex] = sim;
					topServices[minIndex] = service;
				}
			}
		}
	}

	let stringTop = "";
	for (let i = 0; i < topServices.length; i++) {
		stringTop += `title: ${topServices[i].title} - ${topScores[i]}; code: ${topServices[i].code}\n`;
	}
	return stringTop;
}
