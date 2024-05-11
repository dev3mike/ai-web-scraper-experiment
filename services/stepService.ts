import type { OutPutType } from "../constants/prompts";
import { getPupeteerBrowserPage } from "../utils/puppeteer";
import { Document, OpenAI, Settings, VectorStoreIndex } from 'llamaindex';
import type { Page } from "puppeteer";
import { OpenAIService } from "./openAIService";

type StepResponse = {
    type: 'html' | 'css_selector' | 'click_html' | 'type_html' | 'extract_data' | 'done';
    value: string;
}

export namespace StepService {
    let browserPage: Page | null = null;
    export async function HandleStep(task: OutPutType, payload: string): Promise<StepResponse> {
        switch (task.action) {
            case 'open_url':
                return await OpenUrl(task.target_url);
            case 'ask_ai_to_find_element_selector':
                return await AskAIToFindElementSelector(task.ai_prompt, payload);
            case 'ask_ai_to_extract_data':
                return await AskAIToExtractData(task.ai_prompt, payload);
            case 'click_on_element':
                return await ClickOnElement(task.css_selector);
            case 'type_in_element':
                return await TypeInElement(task.css_selector, task.input_value);
            default:
                throw new Error("Action not found, Action:" + task.action);
        }
    }

    async function OpenUrl(target_url: string): Promise<StepResponse> {
        if (browserPage === null) {
            const [page, browser] = await getPupeteerBrowserPage();
            browserPage = page;
        }
        await browserPage.goto(target_url, { waitUntil: 'load' });
        const html = await browserPage.content();

        return {
            type: 'html',
            value: html
        }
    }

    async function ClickOnElement(selector: string): Promise<StepResponse> {

        const element = await browserPage!.$(selector);
        await element!.evaluate(node => node.scrollIntoView());
        await element!.evaluate(node => node.click());
        await browserPage!.waitForNavigation({ waitUntil: 'load' });

        const html = await browserPage!.content();

        return {
            type: 'click_html',
            value: html
        }
    }

    async function TypeInElement(selector: string, text: string): Promise<StepResponse> {

        await browserPage!.type(selector, text, { delay: 10 });

        const html = await browserPage!.content();

        return {
            type: 'type_html',
            value: html
        }
    }

    async function AskAIToFindElementSelector(ai_prompt: string, payload: string): Promise<StepResponse> {

        const openAIService = new OpenAIService("");
        const response = await openAIService.AskToFindSelector(`Find the precise CSS selector based on this request in the html code provided and return it. Ensure the following:
        1- If no CSS selector is found, return null.
        2- Verify the accuracy of the CSS selector.
        3- Do not return selectors for outer elements; ensure the selector targets the specific element required.
        4- ONLY RETURN in the mentioned output format WIHTOUT any additional commentary.
        Request:${ai_prompt}
        
        Output Format: 
        css_selector: "REPLACE_WITH_CSS_SELECTOR"

        HTML Code:${payload}`);

        if (response === "null")
            throw new Error("No css selector found");

        console.log(response);

        try {
            const cssSelector = response!.split('"')[1].split('"')[0];

            return {
                type: 'css_selector',
                value: cssSelector
            }
        } catch (e) {
            console.log(e);
            throw new Error("Error in finding the css selector");
        }
    }

    async function AskAIToExtractData(ai_prompt: string, payload: string): Promise<StepResponse> {

        const bodyTagPayload = payload.split("<body")[1].split("</body>")[0];

        const openAIService = new OpenAIService("");
        const response = await openAIService.AskToFindSelector(`Extract the data specified in the request and return it in the format outlined. Follow these detailed guidelines to ensure accuracy and clarity:
        1- If the data specified in the request cannot be located, return 'null' as the output.
        2- Conduct a thorough verification to confirm the accuracy of the extracted data before returning it.
        3- Exclude any explanations or additional commentary; return only the requested data itself.
        4- DO NOT return in markdown, ONLY return in string format.
        Request:${ai_prompt}
        
        HTML Code:${bodyTagPayload}`);

        if (response === "null")
            throw new Error("Data could not be found");

        console.log(response);

        return {
            type: 'extract_data',
            value: response!
        }
    }

}


