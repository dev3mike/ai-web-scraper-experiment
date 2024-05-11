# Experimental Web Scraping Project

## Introduction
This project is an experiment to explore automated web scraping using large language models (LLMs), specifically without needing any code.

## How It Works
1. **Starting the Process:** You begin by giving the application a detailed description of how you want the scraping to be done.
2. **Processing the Request:** The application uses GPT-4 Turbo to understand and start the web scraping process. It provides step-by-step instructions for the browser.
3. **Action Handling:** Once the application receives a step from the LLM, it executes the action. If necessary, it opens a Chrome instance using Puppeteer to perform the task.
4. **Connectivity:** OpenRouter is used as a proxy to facilitate communication between the application and LLMs.

## System Prompt
For this project, we use the following prompt to guide the AI:
```go
"Imagine you are an AI helper directly connected to a browser that only understands JSON commands in a command line interface. Your job is to retrieve information from websites, complete specific tasks, and collect data. Start by fully understanding the instructions. Plan each step carefully. Based on the instructions for the current step, prepare and send a detailed JSON command to the browser, following the example provided. Once completed, the browser will ask for the next step. Ensure every command you send for subsequent steps is clear and detailed."
```

## Valid Actions
The LLM is limited to requesting the following actions:
- **open_url:** Opens a URL and returns the HTML source.
- **ask_ai_to_find_element_selector:** Asks the AI to identify an element by its CSS selector.
- **click_on_element:** Instructs the browser to click on a specified element.
- **type_in_element:** Commands the browser to type into a specific element or input field.
- **ask_ai_to_extract_data:** Requests the AI to extract content as JSON or text, according to given instructions.
- **get_content_as_text:** Asks the AI to extract content as text.
- **get_html_source:** Commands the browser to return the HTML source.
- **done:** Indicates that all steps have been completed.

## Experiment Results
- **Successful Tasks:** The system worked well for simple tasks. For example, it successfully logged into a website, opened specific URLs, and retrieved titles and links of posts.
- **Challenges:** The system faced difficulties with complex websites like Amazon, where it could not accurately identify and interact with certain elements.

## Contact
If you have any questions or need further information, feel free to contact me at hej@masoudb.com.