export type OutPutType = {
    step_number: number
    step_title: string
    action: 'open_url' | 'ask_ai_to_find_element_selector' | 'click_on_element' | 'type_in_element' | 'ask_ai_to_extract_data' | 'get_content_as_text' | 'get_html_source' | 'done'
    ai_prompt: string
    target_url: string
    input_value: string
    css_selector: string
    error_message: string,
    browser_response: string
}

const exampleOutput = `
Example output:
{
"step_number": 1,
"step_title": "title", // A descriptive title in basic english
"action": "", // This should be the action you want the browser to do
"ai_prompt": "", // If available, otherwise should be null
"target_url": "", // If available, otherwise should be null
"input_value": "", // The value needs to be typed in the input, If not relevant should be null
"css_selector":"", // If available, otherwise should be null
"error_message": "" // If there is an error, return the error message here otherwise should be null
}`

const actions = `
Available actions:
1- open_url: ask the browser to open a url and return html source
2- ask_ai_to_find_element_selector: ask the ai model to find an element by css selector
3- click_on_element: ask the browser to click on an element
4- type_in_element: ask the browser to type on an element/input
5- ask_ai_to_extract_data: ask the ai model to extract content as json or text based on the intructions
6- get_content_as_text: ask the ai model to extract content as text
7- get_html_source: ask the browser to return html source
8- done: when all steps are done
`;

const important = `Guidelines:
1- At each step, request only one action to be performed.
2- Before clicking or typing, initiate a task to ask the AI to locate the element. Use the ask_ai_to_find_element_selector action and include a clear AI prompt for this purpose
3- If you're unsure of the CSS selector, request help by using ask_ai_to_find_element_selector as action. Include a clear AI prompt for assistance. The prompt need to be clear and concise and mention it should return the css selector.
4- Always respond with JSON formatted according to the provided example, without adding any descriptions.
5- If the URL is unknown, issue an error response in the error_message field otherwise return this field as null.
6- Once you believe the task is complete, set next_step_hint to null and action to 'done'.
7- Avoid combining two actions in one task, such as typing and clicking on different elements simultaneously.
8- DO NOT request two actions in one task, such as typing and clicking or locating elements.
9- To extract data, use the ask_ai_to_extract_data action and provide a clear and highly detailed AI prompt.
10- DO NOT add any path to the url, just format it as a normal url and use it
11- For extracting data, DO NOT ask AI to find element, just ask AI to extract data`

export const firstStepPrompt = `Imagine you are an AI helper that is directly connected to a browser, which only understands JSON commands in a command line interface. Your job involves getting information from websites, doing specific tasks, and gathering data. First, fully understand the instructions provided. Think carefully about all the steps you need to take. Start by planning each step thoroughly. Your first task is to send a detailed JSON command to the browser, just like in the example shown. After you complete the first task, the browser will ask for the next steps. Make sure every command you send is clear and detailed.

${actions}

${important}

${exampleOutput}`;
export const nextStepPrompt = `Imagine you are an AI helper directly connected to a browser that only understands JSON commands in a command line interface. Your job involves getting information from websites, performing specific tasks, and gathering data. First, make sure you fully understand the instructions provided. Think carefully about all the steps you need to take. Begin by planning each step thoroughly. Based on the current step outlined below, prepare and send a detailed JSON command to the browser, following the example shown. Once this step is completed, the browser will prompt you for the next action. Ensure every command you send for the subsequent steps is clear and detailed.

${actions}

${important}

${exampleOutput}`;
export const scraperPrompt = `Go to bonbast.com and extract euro and usd and swedish exchange rates as json`;

