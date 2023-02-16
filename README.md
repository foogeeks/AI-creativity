
# Mongo Database

## Manage MongoDB

![mongoDB1.png](./content/mongoDB1.png)

We don’t need most of the usages. For adding or removing database accounts, we go to “
$\color{CornflowerBlue} \text{Database Access}$
”. In further development, for security reason, we might want to use “
$\color{CornflowerBlue} \text{Network Access}$
” to block other IPs from accessing the database.

## Usernames and Passwords
please see https://docs.google.com/document/d/1CJ-Pv3Pd7v6jIxjWyVSE1BukllCYnb0lrCCl2TqXVjg/edit?usp=share_link

## Connection
One easy way to connect and manage MongoDB is using MongoDB Compass. 

![mongoDB2.png](./content/mongoDB2.png)

In “new connection”, type the connection URL here. (fill the username and password in above table)

URL:
$\color{ForestGreen} \text{mongodb+srv:// [username]:[password]@chatcreativity.0edw3nj.mongodb.net/test}$ 

## Add Data
![mongoDB3.png](./content/mongoDB3.png)

In the image above, we select 
$\color{CornflowerBlue} \text{"ADD DATA"-"Import File"-"Choose a file"}$
. Then we just select a .csv file. The file needs to follow a certain format. The first row will be the column name. Take the instruction database as an example, “_id” and “text” will be two columns, but “_id” will be generated by MongoDB, so in the csv file we just need text. Like below:

![mongoDB4.png](./content/mongoDB4.png)

Note that we don’t need to add further instruction text like “now it is your turn” to the database. These sentences are duplicated and will be added by the server. Also the file needs to be .csv format rather than .xlsx(it is easy to transfer format). Also, after adding or removing data from this collection, the env variable 
$\color{CornflowerBlue} {ITEM\textunderscore LEN}$
needs to be changed.

## Export Data to File
Click the button and follow the steps. 
![mongoDB5.png](./content/mongoDB5.png)

The output file format has the same format we use to import data.
![mongoDB6.png](./content/mongoDB6.png)


## Schema


# Firebase
Most of the function of the firebase is not used. We only use firebase for account authentication. Go to “Build”-”Authentication” and we will see the user emails and user UID. The UID here corresponds to the user UID in MongoDB.
![firebase1.png](./content/firebase1.png)


# Render API
## update environment variables
the file “update_env.py” contains four functions:

$\color{CornflowerBlue} {print\textunderscore services}$: will print service name and its serviceId

$\color{CornflowerBlue} {get\textunderscore env}$: will get all the environment variables for current service, return a map (key is env name, value is env value)

$\color{CornflowerBlue} {update\textunderscore env}$: the function will call get_env to get the old env variables, the edit env variable part can be done inside the code as below:

![render1.png](./content/render1.png)

It is basically editing the value of a key for a dictionary.

$\color{CornflowerBlue} {manual\textunderscore deploy}$: this will deploy the service with the latest commit, the function should be called after updating environment variables.

For more API functions, please refer to https://api-docs.render.com/reference/introduction
Adding more functions is simple, just go to the right function, there is python code on the right. See below screenshot, the Update environment variables function. Basically we just need to fill in serviceId and Body params
![render2.png](./content/render2.png)

## Environment Variables
### Frontend
* $\color{CornflowerBlue} {REACT\textunderscore APP\textunderscore FIREBASE\textunderscore API\textunderscore KEY}$: for firebase, dont change
* $\color{CornflowerBlue} {REACT\textunderscore APP\textunderscore FIREBASE\textunderscore AUTH\textunderscore DOMAIN}$: for firebase, dont change
* $\color{CornflowerBlue} {REACT\textunderscore APP\textunderscore FIREBASE\textunderscore PROJECT\textunderscore ID}$: for firebase, dont change
* $\color{CornflowerBlue} {REACT\textunderscore APP\textunderscore FIREBASE\textunderscore STORAGE\textunderscore BUCKET}$: for firebase, dont change
* $\color{CornflowerBlue} {REACT\textunderscore APP\textunderscore FIREBASE\textunderscore MESSAGING\textunderscore SENDER\textunderscore ID}$: for firebase, dont change
* $\color{CornflowerBlue} {REACT\textunderscore APP\textunderscore FIREBASE\textunderscore APP\textunderscore ID}$: for firebase, dont change
* $\color{CornflowerBlue} {REACT\textunderscore APP\textunderscore URL}$: url for backend api
* $\color{CornflowerBlue} {REACT\textunderscore APP\textunderscore SESSION\textunderscore TIME}$: time for how long a chat room lasts in seconds
* $\color{CornflowerBlue} {REACT\textunderscore APP\textunderscore INSTRUCTION}$: instructions for user to get started 
* $\color{CornflowerBlue} {REACT\textunderscore APP\textunderscore AVATAR\textunderscore OPTION}$: "human" (human avatar) | "bot" (rebot avatar) | "default" (user's avatar)

### Backend
* $\color{CornflowerBlue} {PORT}$: port the service is listening to (default 8080)
* $\color{CornflowerBlue} {MONGO\textunderscore URI}$: url for connection to mongoDB
* $\color{CornflowerBlue} {MATCH\textunderscore AI}$: whether to match user with AI
* $\color{CornflowerBlue} {OPENAI\textunderscore API\textunderscore KEY}$: key for openAI API key
* $\color{CornflowerBlue} {AI\textunderscore UID}$: UID that is actually AI
* $\color{CornflowerBlue} {AI\textunderscore VERSION}$: version of AI: 
"GPT-3" (using davinci-002, no conversation) | 
"ChatGPT" (using davinci-003, make conversation) | 
"Constant" (no model, constant list of responses)
* $\color{CornflowerBlue} {WAIT\textunderscore TIME}$: seconds of waitting for AI to send message (default 5)
* $\color{CornflowerBlue} {WAIT\textunderscore TIME\textunderscore DIFF}$: changes of waitting time, the actual waiting time will be in range [WAIT_TIME-WAIT_TIME_DIFF, WAIT_TIME+WAIT_TIME_DIFF]
* $\color{CornflowerBlue} {AI\textunderscore INS}$: instruction of prompt for ChatGPT
* $\color{CornflowerBlue} {NON\textunderscore REPLY\textunderscore PROMPT}$: instruction of prompt for ChatGPT when user have no response yet, the prompt is used to let AI come up with new idea
* $\color{CornflowerBlue} {ITEM\textunderscore LEN}$: the total number of items (this should be changed when push new items to database)
