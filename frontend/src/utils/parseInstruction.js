const REACT_APP_MATCH_CONDITION = process.env.REACT_APP_MATCH_CONDITION || "ALL";

const Ins2 = "Welcome to the second round! The rules are the same as before. When ready to start this round, please respond in the chat with ‘ready’. Once both matched players have indicated their readiness, the game’s target object will be revealed underneath this instruction and the timer will begin."
const Ins3 = "Welcome to the last round! The rules are the same as before. When ready to start this round, please respond in the chat with ‘ready’. "

export const parseInstruction = (index, chatType, change) => {
    console.log(index, chatType, change);
    switch (REACT_APP_MATCH_CONDITION) {
        case 'HUM':
            return (
              <div className='dark:text-white'>
                <span>
                  Edit this text. This text is for <span style={{'fontWeight':'bold'}}>human</span> instruction. 
                </span>
              </div>
            );
        case 'CON':
            return (
                <div className='dark:text-white'>
                    <span>
                      Edit this text. This text is for <span style={{'fontWeight':'bold'}}>cons</span> instruction.
                    </span>
                </div>
            );
        case 'GPT':
            return (
                <div className='dark:text-white'>
                  <span>
                    Edit this text. This text is for <span style={{'fontWeight':'bold'}}>ChatGPT</span> instruction.
                  </span>
                </div>
            );
        case 'ALL':
            return (
              <div className='dark:text-white' >
                {(index === 0) && (
                  <span>
                    We will now play three rounds of a two-player version of the game you just practiced.
                     In each round, you and a paired player will use this chat platform to collectively 
                     generate a list of creative uses for an everyday object. Once the game starts, 
                     your team will have 4 minutes to produce as many high-quality responses as you can. 
                     You will be <span style={{'fontWeight':'bold'}}>evaluated as a team</span> based 
                     on how many uses you generate, their originality, 
                     surprisingness, and practical usefulness. There is no turn-taking in this game. 
                     Either player can post a response at any point during the <span style={{'fontWeight':'bold'}}>4 minutes</span>.
                    However, it is important for your team’s score to keep track of your co-player’s responses. When ready, please respond in the chat with 'ready'. Once both matched players have indicated their readiness, the game’s target object will be revealed underneath this instruction and the timer will begin.
                  </span>
                  )}
                {(index === 1) && (Ins2)}
                {(index === 2) && (Ins3)}
                {(chatType === "HUM") && (
                  <span>
                    Your partner for this round will be a fellow <span style={{'fontWeight':'bold'}}>human</span>.
                  </span>
                )}
                {(chatType !== "HUM") && (!change) && (
                  <span>
                    Your partner for this round will be an <span style={{'fontWeight':'bold'}}>AI</span>.
                  </span>
                  )}
                {(chatType !== "HUM") && (change) && (
                  <span>
                    Your partner for this round will be a <span style={{'fontWeight':'bold'}}>different AI</span>.
                  </span>
                  )}
              </div>
            )
    }
}