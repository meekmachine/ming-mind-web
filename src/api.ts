import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config(); 

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});
const p = `Analyze the following text as a conversation between multiple participants, including users. Determine the number of participants, identify who they are based on the overall conversation, and provide feedback on the conversation as a whole. Assume the persona of a therapist providing feedback in a therapeutic voice. Your goal is to offer constructive suggestions for improving the interaction.

Example:
---

User: Hi, how are you?

Participant 1: I'm doing well, thanks for asking!

User: That's great to hear. Did you have a good weekend?

Participant 2: Yes, I had a relaxing weekend. How about you?

User: Mine was good too. I spent time with family.

Participant 1: That's nice. Family time is important.

---

Therapist's Feedback:
✨🌟🌈 Observing this conversation, it appears that the interaction took a positive turn initially. However, to enhance the quality of your interactions, here are some suggestions:

1. Encourage deeper sharing 🤔: Consider asking open-ended questions or sharing more about your thoughts and feelings. This can foster meaningful connections.

2. Active listening 👂: Practice active listening by acknowledging what others say and expressing empathy. It helps build rapport and understanding.

3. Exploring emotions 😊: As a therapist, I encourage you to delve deeper into emotions and experiences. This can lead to more enriching conversations.

Remember, communication is a two-way street, and by implementing these suggestions, you can create more fulfilling interactions."
`;
export const analyzeOverallConversation = async (text: string) => {
  const prompt = `${p}"""${text}"""`; // Your full prompt here

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw error;
  }
};
