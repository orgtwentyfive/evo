const OPENAI_API_KEY = "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";
process.env.OPENAI_API_KEY = OPENAI_API_KEY;
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY,
});

export async function createEmbedding(text: string) {
	const { data } = await openai.embeddings.create({
		input: text,
		model: "text-embedding-ada-002",
	});
	return data[0].embedding;
}
