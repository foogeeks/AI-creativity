import { Configuration, OpenAIApi} from "openai";
import { ChatGPTAPI } from 'chatgpt'
import axios from 'axios';
import { response } from "express";

// var npm = require('npm');
// npm.load(function(err) {
//   // handle errors

//   // install module ffi
//   npm.commands.install(['openai'], function(er, data) {
//     // log errors or data
//   });

//   npm.on('log', function(message) {
//     // log installation progress
//     console.log(message);
//   });
// });


// import OpenAI from "openai";


const chatgpt = new ChatGPTAPI({ apiKey: process.env.OPENAI_API_KEY });
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const MAX_TOKEN = process.env.MAX_TOKEN || 3000;
const AI_INS = process.env.AI_INS;
const END_PROMPT = process.env.END_PROMPT;
const COMMON_WORD = process.env.COMMON_WORD;
const COMMON_SET = COMMON_WORD.split(',');
const TRY_TIME = process.env.TRY_TIME;
// const FILTER_CONTENT = process.env.FILTER_CONTENT;
COMMON_SET.push(process.env.ITEM);

// check string is fully punc
const isPunc = (s) => {
    return /^(\.|\,|\!|\?|\:|\;|\"|\'|\-|\(|\))*$/g.test(s);
}

const httpheaders = {
    'Content-Type': 'application/json',
    'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,
}


// the function will filter one sentence and remove duplicate punc at the end
// if the sentence end has no punc, it will append one.
const onePuncFilter = (sentence) => {
    if (sentence.length < 2) {
        //most of time it might be an empty string
        return sentence;
    } else {
        if (isPunc(sentence.slice(-2))) {
            // the end of sentence has two punc
            return sentence.slice(0, -1);
        } else if (! isPunc(sentence.slice(-1))) {
            // the end of sentence has no punc
            // we append one period at the end
            return `${sentence}.`;
        } else {
            return sentence;
        }
    }
}

const filterContent2 = (messages, sentence) => {
    if (typeof sentence !== 'string') {
        console.error('filterContent2: sentence is not string', sentence);
        return '';
    }
    let s = sentence;
    s = s.replace(/\s{2,}/g," ");
    return s;
}


// filter the AI response
const filterContent = (messages, sentence) => {

    if (typeof sentence !== 'string') {
        console.error('filterContent: sentence is not string', sentence);
        return '';
    }
    let s = sentence;
    const item = messages[0].text;
    const filterArray = [
        `A ${item} can be used`,
        `A ${item} can also be used`,
        `${item}s can also be used`,
        `${item} can also be used`,
        `${item} can be used as`,
        `You can use ${item}s`,
        `You can use a ${item}`,
        `You can also use`,
        `One creative use for a ${item} is`,
        `Use a ${item}`,
        `Use ${item}`,
        `One creative use for a ${item} could be`,
        `The ${item} can be used`,
    ]
    filterArray.forEach((prefix) => {
        s = s.replace(prefix, ' ');
        s = s.replace(prefix+' to', ' ');
        s = s.replace(prefix+' to act', ' ');
    })
    s = s.replace(/\s{2,}/g," ");
    return s;
}

// 
const sentenceToSet = (sentence) => {
    // remove punc
    let s = sentence.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    s = s.replace(/\s{2,}/g," ");
    const toret = new Set(s.split(' '));
    COMMON_SET.forEach((ele) => {
        if (toret.has(ele)) {
            toret.delete(ele);
        }
    })
    return toret;
}

const intersect = (set1, set2) => {
    let c = 0;
    set1.forEach(x => {
        if (set2.has(x)) {
            c += 1;
        }
    });
    return c / Math.max(set1.size, set2.size);
}

const checkRepeat = (setArray, sentence) => {
    const set2 = sentenceToSet(sentence);
    let collide = -1;
    setArray.forEach((set1, index) => {
        const ratio = intersect(set1, set2);
        if (ratio > 0.5) {
            collide = index;
        }
    })
    return collide;
}

// remove one or two punc at the end
const noPuncFilter = (sentence) => {
    if (sentence.length < 2) {
        //most of time it might be an empty string
        return sentence;
    } else {
        if (isPunc(sentence.slice(-2))) {
            // the end of sentence has two punc
            return sentence.slice(0, -2);
        } else if (isPunc(sentence.slice(-1))) {
            // the end of sentence has no punc
            // we append one period at the end
            return sentence.slice(0, -1);
        } else {
            return sentence;
        }
    }
}


// const generatePrompt = (messages) => {
//     const item = messages[0].text
//     if (messages.length === 1) {
//         return `This is a single creative use for a ${item}:`;
//     } else if (messages.length === 2 && messages[1].sender === 1) {
//         // human send first message
//         return `This is a single creative use for a ${item} that is very different from ${messages[1].text}:`;
//     } else {
//         const messages2 = messages.filter((message) => (message.sender !==0));
//         const list_idea = messages2.map((message) => (noPuncFilter(message.text))).join(',');

//         return `I already have this list for creative uses for a ${item}: ${list_idea}. This is a single creative use for a ${item} that is very different from any others in my current list:`
//     }
// }



// const httpGPTCompletion = async(model, message, temperature) => 
// {
//     // console.log("AI INIT - START");
//     // //const openai = new OpenAI();
//     // console.log("AI INIT - DONE");
//     // console.log(`Messages is ${message}, ${model}`);
//     const content = {
//         'model':model,
//         'messages':[{'role':'user', 'content':message}],
//         'temperature': temperature
//     }
//     try {
//         const response = await axios.post("https://api.openai.com/v1/chat/completions", content, {headers: httpheaders});
//         if (response.status === 200) {
//             console.log("RESPONSE from gptcompletion:",response.data);
//             return response.data.choices[0].message.content;
//         } else {
//             console.log("http gpt failed");
//             console.log(response.statusText);
//             // console.log(response);
//         }
//     } catch (error) {
//         console.log("axios error", error.message);
//     }
    
// }


const httpGPTCompletion = async(model, message, temperature, ins_for_ai_hard, msgs) => { //model, prompt, temp, ins_for_ai, msgs
    let messages = [{"role": "system", "content": ins_for_ai_hard}]; 
    let content;
    if (msgs.length === 1)
    {
        //console.log("msgs.length = 1");
        //console.log("msgs",msgs);
        //console.log("message",message);
        const content_data = 
        {
            'model':model,
            'messages':messages, //user: message_user[-1] //system: ins_for_ai // assistant: message_ai  
            'temperature': temperature
        }
        content = content_data;
    }
    else
    {
        //console.log("msgs.length > 1");
        //console.log("msgs",msgs);
        //console.log("message",message);

        let ai_messages = [];
        let user_messages = [];

        for (let i = 0 ; i < msgs.length ; i++)
        {
            if (msgs[i].sender === 2)//ai
            {
                ai_messages.push(msgs[i].text);
            }
            else if (msgs[i].sender === 1)//user
            {
                user_messages.push(msgs[i].text);
            }
        }

        messages.push({"role": "assistant", "content": ai_messages[0]})
        for (let i = 0 ; i < user_messages.length - 1 ; i++)
        {
            // console.log("user_messages[i]",user_messages[i]);
            // console.log("ai_messages[i+1]",ai_messages[i+1]);
            messages.push({"role": "user", "content": user_messages[i]})
            messages.push({"role": "assistant", "content": ai_messages[i+1]})
        }
        messages.push({"role": "user", "content": user_messages[user_messages.length - 1]})
        const content_data = {
            'model':model,
            'messages':messages, //user: message_user[-1] //system: ins_for_ai // assistant: message_ai  
            'temperature': temperature
        }  
        content = content_data;
    }

    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", content, {headers: httpheaders});
        if (response.status === 200) {
            console.log("RESPONSE from gptcompletion:",response.data);
            return response.data.choices[0].message.content;
        } else {
            console.log("http gpt failed");
            console.log(response.statusText);
            // console.log(response);
        }
    } catch (error) {
        console.log("axios error", error.message);
    }
}


// const httpGPTCompletion = async(model, message, temperature = 0.7) =>
// {
//     const openai = new OpenAI();
//     const completion = await openai.chat.completions.create({
//         messages: [{ role: "assistant", content: message }],
//         model: "gpt-3.5-turbo",
//         });
//     console.log(completion.choices[0]);
// }

// import OpenAI from "openai";

// const openai = new OpenAI();

// async function main() {
//   const completion = await openai.chat.completions.create({
//     messages: [{ role: "system", content: "You are a helpful assistant." }],
//     model: "gpt-3.5-turbo",
//   });

//   console.log(completion.choices[0]);
// }

// main();




const apiGPTCompletion = async(model, message, temperature) => {
    const completion = await openai.createCompletion({
        model: model,
        prompt: message,
        temperature: temperature,
        max_tokens: MAX_TOKEN,
    });
    return res = completion.data.choices[0];
}


//formatted chat history for prompts
//SO HAVE CHATGPT TRUE RESPONSES IN THE CHAT WITHOUT ANY MODIFICATION
// WAIT_TIME REMOVE AND MAKE IT DEPENDENT ON USER INPUT



const generateChatGPTPrompt = (messages) => {
    //console.log("generatechatgptprompt: ",messages);
    const item = messages[0].text
    const messages2 = messages.filter((message) => (message.sender===2)); //AI returns
    //console.log("prompt generation messages2: ",messages2);
    const list_idea = messages2.map((message) => (noPuncFilter(message.text.trim()))).join(',');
    if (list_idea.length > 0) {
        return `We already have this list of creative uses for a ${item}: ${list_idea}. Can you tell me a creative use that is very different from all the uses in this list?`
    } else {
        return '';
    }
}

/**
 * generate one response for one sentence
 * @returns string
 */
export const generateCompletion = async (messages,not_ai_first) => {    
    //console.log('GPT-3.5 completion');
    const prompt = generateChatGPTPrompt(messages)+' '+END_PROMPT;
    const setArray = [];
    //console.log("generateCompletion function initial prompt:",prompt);
    messages.forEach((m) => 
    {
        if (m.sender !== 0) {
            setArray.push(sentenceToSet(m.text));
        }
    })

    const insForAI = `${AI_INS} ${messages[0].text}. ${prompt}`; // TRY CHANGING THIS
    if (messages.filter((m) => m.sender===2).length > 0) 
    {
        const restext = await httpGPTCompletion("gpt-4", prompt, 0.7, insForAI, messages);
        const res = {text: restext};
        return res;
    } 
    else 
    {
        const restext = await httpGPTCompletion("gpt-4", insForAI, 0.7,insForAI, messages);
        const res = {text: restext};
        return res;
    }

}


export const chatgptReply = async(message, messages, lastres) => {
    //console.log("ChatGPT completion");
    const prompt = generateChatGPTPrompt(messages)+' '+END_PROMPT;
    const setArray = [];
    //console.log(prompt);
    messages.forEach((m) => {
        if (m.sender !== 0) {
            setArray.push(sentenceToSet(m.text));
        }
    })
    console.log(`${setArray.length} sets in array`);


    if (lastres !== undefined) {
        let tryTimes = 0;
        // let findMessage = false;
        do {
            const res = await chatgpt.sendMessage(prompt, {
                conversationId: lastres.conversationId,
                parentMessageId: lastres.id
            })
            //console.log("CHATGPT REPLY function: IF", res.text);
            res.text=filterContent2(messages, res.text);
            const i = checkRepeat(setArray, res.text);
            if ( i === -1) {
                console.log(`non repeat at ${tryTimes}`);
                return res;
            } else {
                console.log(`'${res.text}' is similar to '${messages[i+1].text}'`)
            }
            tryTimes += 1;
        } while (tryTimes < TRY_TIME);
    } else {
        // generate first idea
        let tryTimes = 0;
        const insForAI = `${AI_INS} ${messages[0].text}.`;
        do {
            const res = await chatgpt.sendMessage(insForAI+prompt);
            //console.log("CHATGPT REPLY function: ELSE", res.text);
            res.text = filterContent2(messages, res.text);
            const i = checkRepeat(setArray, res.text);
            if ( i === -1) {
                console.log(`non repeat at ${tryTimes}`);
                return res;
            } else {
                console.log(`'${res.text}' is similar to '${messages[i+1].text}'`)
            }
            tryTimes += 1;
        } while (tryTimes < TRY_TIME); 
    }
    return {text:''};
}
