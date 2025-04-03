import { HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";

const llm = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "mistral-small:22b-instruct-2409-q4_0",
    temperature: 0.8
});

const form = document.querySelector('form') as HTMLFormElement;
form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const userPrompt = formData.get('prompt') as string;
    const iframe = document.getElementById('ai-result') as HTMLIFrameElement;
    const promptTemplate = ChatPromptTemplate.fromMessages([
        [
            "system",
            `Tu crées des sites web avec Tailwind. 
            Ta tâche est de générer le code html avec Tailwind en fonction de la demande de l'utilisateur.
            Tu renvoies uniquement le code html, sans aucun commentaire ni texte avant ou après.
            tu renvoies du html valide.
            **tu n'ajoutes JAMAIS de syntaxe markdown.**
            `
        ],
       new MessagesPlaceholder("messages")
    ]);
    const chain = promptTemplate.pipe(llm);
    const result = await chain.invoke({ messages: [new HumanMessage(userPrompt)] });
    console.log(result);
    const content = result.content.toString();
    if(content.includes("```html")) {
      const html = content.replace("```html", "").replace("```", "");
      iframe.srcdoc = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body>
          ${html}
        </body>
      </html>
      `;
    }
}); 