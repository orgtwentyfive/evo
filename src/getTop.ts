import { createEmbedding } from "./createEmbedding";
import json from "../data.json";
import { similarity } from "llamaindex";

export const data = json as any[];

export async function getTop(question: string, count: number = 20) {
	const questionEmbedding = await createEmbedding(question);
	let topServices: any[] = [];
	let topScores: number[] = [];

	for (const service of data) {
		if (!service.emmbedings) continue;
		let maxCore = 0;
		for (const emmbedings of service.emmbedings) {
			const sim = similarity(questionEmbedding, emmbedings);
			if (maxCore < sim) {
				maxCore = sim;
			}
		}
		if (topScores.length < count) {
			topScores.push(maxCore);
			topServices.push(service);
		}
		if (topScores.length === count) {
			const minScore = Math.min(...topScores);
			const minIndex = topScores.indexOf(minScore);
			if (maxCore > minScore) {
				topScores[minIndex] = maxCore;
				topServices[minIndex] = service;
			}
		}
	}
	const withScore: any[] = [];
	for (let i = 0; i < topScores.length; i++) {
		const service = topServices[i];
		const score = topScores[i];
		withScore.push({ service, score });
	}
	withScore.sort((a, b) => b.score - a.score);
	let stringTop = "";
	for (let i = 0; i < withScore.length; i++) {
		stringTop += `title: ${withScore[i].service.title}; code: ${withScore[i].service.code};\n`;
	}
	return stringTop;
}
