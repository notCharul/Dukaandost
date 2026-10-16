import { ChatGroq } from "@langchain/groq"
import { createAgent } from "langchain";
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
// import { tool } from "@langchain/core/tools";
import { MemorySaver } from "@langchain/langgraph";
import { searchProduct , lowstockalert , expiringSoon} from "./tools.js";
import "dotenv/config";
   


const rl = readline.createInterface({ input, output });



const shortmemory = new MemorySaver();



//creating a function in which we will call ai and all
const main = async () => {

    // bring brain/model in your code
    const brain = new ChatGroq({
        model: "openai/gpt-oss-120b",
        apiKey: process.env.GROQ_API_KEY,
    })

    // create agent1 and tell your agent1 which brain to use.
    const agent = createAgent({
        model: brain,
        tools: [searchProduct,lowstockalert,expiringSoon],
        checkpointer: shortmemory,
        systemPrompt: "You are DukaanDost, an assistant for a kirana store owner in India. You help with billing, stock, expiry and the udhaar (credit) ledger. Never guess prices or stock: always use your tools. Reply in the same language the user writes in mainly in english . Keep replies short.",
    });

    while (true) {
        const userInput = await rl.question("You: ");

        if (userInput === "bye") {
            break;
        }
        const response = await agent.invoke({
            messages: [
                {
                    role: "user",
                    content: userInput
                }
            ]
        }, {
            configurable: { thread_id: "1" }
        })

        console.log('ai response---->', response.messages[response.messages.length - 1].content);

    }

    rl.close();
}

main();