import OpenAI from 'openai';

export class OpenAIService {

    private openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY, // OPENROUTER
        baseURL: "https://openrouter.ai/api/v1",
    });
    private messages: any = [];

    constructor(systemPrompt: String) {
        this.messages.push({ role: 'system', content: systemPrompt })
    }

    async AskJSON(prompt: string) {
        this.messages.push({ role: 'user', content: prompt });
        const chatCompletion = await this.openai.chat.completions.create({
            messages: [...this.messages],
            model: 'openai/gpt-4-turbo',
        });

        const response = chatCompletion?.choices[0]?.message?.content;
        try {
            return JSON.parse(response ?? "{}");
        } catch (e) {
            console.log(e, response);
            throw new Error("Error in parsing the response");
        }
    }

    async AskToFindSelector(prompt: string) {
        const chatCompletion = await this.openai.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'anthropic/claude-3-haiku',
        });

        console.log(chatCompletion);
        const response = chatCompletion?.choices[0]?.message?.content;
        try {
            return response;
        } catch (e) {
            console.log(e, response);
            throw new Error("Error in parsing the response");
        }
    }
}