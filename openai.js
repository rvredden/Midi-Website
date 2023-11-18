import OpenAI from "openai";

const openai = new OpenAI({ apiKey: "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" });

async function dataSend() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo"
  });

  console.log(completion.choices[0].message.content);
}


export default dataSend;