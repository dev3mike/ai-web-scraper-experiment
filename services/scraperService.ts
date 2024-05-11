import { scraperPrompt, type OutPutType } from "../constants/prompts";
import { OpenAIService } from "./openAIService";
import { PromptGenerators } from "./promptGenerators";
import { ContextChatEngine, Document, VectorStoreIndex } from "llamaindex";
import { StepService } from "./stepService";


export namespace ScraperService {
    export async function Start() {
        await RunService();
        console.log("DONE!");
    }
    var step = 1;
    var currentStep: Partial<OutPutType> = {};
    var browserHTML: string = "";
    var isDone = false;
    var openAIService: OpenAIService | null = null;
    async function RunService() {

        if (currentStep.action === "done") {
            console.log("The task is done");
            return;
        }

        console.log("Initializing Step: " + step);
        const scraperOrder = scraperPrompt;
        const prompt = step === 0 ? PromptGenerators.GetFirstStep(scraperOrder) : PromptGenerators.GetNextStep(scraperOrder, JSON.stringify(currentStep));

        if (openAIService === null) {
            openAIService = new OpenAIService(prompt.base);
        }

        // console.log(prompt);
        // return;

        const task = await openAIService.AskJSON(prompt.order);
        console.log(task);

        const handleResponse = await StepService.HandleStep(task as OutPutType, browserHTML);

        if (handleResponse.type === 'html') {
            browserHTML = handleResponse.value;
            task.browserResponse = "Page is loaded and the html code is ready";
        }

        if (handleResponse.type === 'click_html') {
            browserHTML = handleResponse.value;
            task.browserResponse = "The click is done and the html code is ready";
        }

        if (handleResponse.type === 'type_html') {
            browserHTML = handleResponse.value;
            task.browserResponse = "The type is done and the html code is ready";
        }

        if (handleResponse.type === 'css_selector') {
            task.browserResponse = "The css selector is: " + handleResponse.value;
        }

        if (handleResponse.type === 'extract_data') {
            console.log("The data is extracted");
            console.log(handleResponse.value);
            return;
        }

        console.log(handleResponse);
        currentStep = task;
        console.log(task.browserResponse);

        // 5 seconds delay
        await new Promise(resolve => setTimeout(resolve, 5000));

        step++;
        await RunService();
    }
}