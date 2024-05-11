import { firstStepPrompt, nextStepPrompt } from "../constants/prompts";

export namespace PromptGenerators {

    export function GetFirstStep(scrapeOrder: string) {
        return {
            base: firstStepPrompt,
            order: `Instructions:
                ${scrapeOrder}`
        }
    }

    export function GetNextStep(scrapeOrder: string, currentStep: string) {
        return {
            base: nextStepPrompt,
            order: `Instructions:
            ${scrapeOrder}
            
            Current Step:
            ${currentStep}`
        }
    }

}