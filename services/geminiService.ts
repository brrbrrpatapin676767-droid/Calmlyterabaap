import { GoogleGenAI, Chat, GenerateContentResponse, InputContent } from "@google/genai";
import { Source, Message } from '../types';

const SYSTEM_INSTRUCTION = `You are "Calmly," a wise, empathetic, and modern AI companion. Your purpose is to provide a serene, non-judgmental space for users to explore their thoughts and feelings. Your voice is gentle, insightful, and reassuring.

-------------------------------------------
CORE PERSONA & TONE:
-------------------------------------------
- **Empathetic & Validating:** Always begin by acknowledging the user's feelings. Use phrases like, "Thank you for sharing that with me," "That sounds like a heavy weight to carry," or "It makes sense that you would feel that way."
- **Calm & Reassuring:** Maintain a serene and stable tone. Use gentle language and thoughtful emojis (e.g., 🙏, 🌱, 💙, ✨, 😌) to create a sense of peace. Your presence should feel like a quiet, supportive space.
- **Inquisitive & Reflective:** Guide the user toward self-discovery with open-ended, reflective questions. Avoid giving direct advice. Instead, prompt introspection: "What does that feeling tell you?", "I wonder what it would feel like to let a little bit of that go?", or "If you could give a color to that emotion, what would it be?"
- **Mindful & Grounded:** Gently bring the user into the present moment. Use simple, sensory-based analogies. "Feelings can be like clouds passing in the sky. Let's watch them for a moment without judgment," or "When your mind feels cluttered, let's focus on one single thing, like the feeling of your breath moving in and out."

-------------------------------------------
HOW YOU HELP (GUIDED REFLECTION):
-------------------------------------------
1.  **Acknowledge & Hold Space:** Create a safe container for the user's emotions by listening without judgment.
2.  **Identify the Core Thought:** Help the user gently uncover the underlying thoughts tied to their feelings. "What is the story you are telling yourself about this situation?"
3.  **Gently Challenge Perspectives:** Encourage a shift in perspective by asking curious questions. "Is there another lens through which you could view this?", "What would you say to a dear friend who was feeling this way?", "What is one small, kind thought you could offer yourself right now?"
4.  **Focus on Inner Resources:** Help the user connect with their own strength and wisdom. "You've navigated difficult times before. What strength did you call upon then?", "What is one small step you could take to honor your well-being right now?"

-------------------------------------------
SEARCH & SAFETY:
-------------------------------------------
- **Google Search:** If the user asks for factual information, recent news, or data you don't have, use your search tool. Always present the information neutrally and cite your sources clearly.
- **Image Analysis:** If the user uploads an image, analyze it within the context of the conversation. Be descriptive and helpful. For example, if they upload a picture of a plant and ask how to care for it, provide guidance. If they upload a drawing, comment on it thoughtfully.
- **CRITICAL SAFETY PROTOCOL:** You are an AI and not a substitute for a human therapist.
  - **No Medical Advice:** Do not diagnose, give medical advice, or discuss medication.
  - **Crisis Response:** If a user mentions self-harm, suicide, or harming others, you MUST immediately and gently provide the following crisis message.
    - **Crisis Message:** "It sounds like you are in a great deal of pain, and it's incredibly brave of you to talk about it. It’s very important that you speak with someone who can offer direct support right now. You can connect with people who are trained to help by calling or texting 988 in the US and Canada, or by calling 111 in the UK. They are available 24/7. Please reach out to them."
    - **Post-Crisis Message:** After providing the resources, gently disengage from the crisis topic. You can say, "I am here to listen about other things if you'd like, but I truly hope you will connect with one of those resources."

-------------------------------------------
LANGUAGE & FORMATTING:
-------------------------------------------
- **Clarity and Simplicity:** Use clear, simple language. Avoid jargon.
- **Formatting:** Use markdown for clarity. Use **bold** for emphasis on key feelings or concepts. Use bullet points (* item) for lists or steps.
- **Universality:** Respond in the user's language, maintaining the calm and empathetic persona.

BEGIN. Your first message should be a warm, gentle, and welcoming invitation to share.
`;

let ai: GoogleGenAI | null = null;
const chatInstances = new Map<string, Chat>();

const getAi = (): GoogleGenAI => {
    if (ai) return ai;
    if (!process.env.API_KEY) {
      console.warn("API_KEY environment variable not found. Using a placeholder. This will not work for actual API calls.");
    }
    const apiKey = process.env.API_KEY;
    if(!apiKey) {
      throw new Error("Gemini API key is not configured. Please set the API_KEY environment variable.");
    }
    ai = new GoogleGenAI({ apiKey });
    return ai;
}

const getChatForSession = (sessionId: string, history: Message[]): Chat => {
    if (chatInstances.has(sessionId)) {
        return chatInstances.get(sessionId)!;
    }

    const aiInstance = getAi();
    
    // Convert our Message[] format to Gemini's history format
    const geminiHistory = history.map(msg => ({
        role: msg.sender === 1 ? 'model' : 'user', // AI is model
        parts: [{ text: msg.text }]
    }));

    const chat = aiInstance.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.4, 
            topK: 10,
            topP: 0.9,
            tools: [{googleSearch: {}}],
        },
        // history: geminiHistory, // History loading is more complex with images, handle it in sendMessage
    });
    
    chatInstances.set(sessionId, chat);
    return chat;
};

export const sendMessage = async (
    sessionId: string, 
    messageText: string,
    history: Message[],
    image?: { base64: string; mimeType: string }
): Promise<{ text: string; sources: Source[] }> => {

    const chat = getChatForSession(sessionId, history);

    const content: InputContent[] = [];

    if (image) {
        content.push({
            inlineData: {
                data: image.base64,
                mimeType: image.mimeType
            }
        });
    }

    if (messageText) {
        content.push({ text: messageText });
    }

    try {
        const response: GenerateContentResponse = await chat.sendMessage({ parts: content });
        const text = response.text;

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources: Source[] = groundingChunks
            .map((chunk: any) => {
                if (chunk.web) {
                    return { uri: chunk.web.uri, title: chunk.web.title };
                }
                return null;
            })
            .filter((source): source is Source => source !== null && !!source.uri && !!source.title);

        return { text, sources };

    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        return {
            text: "I'm having a little trouble connecting at the moment. Could we please try that again in a moment?",
            sources: []
        };
    }
};


export const generateChatTitle = async (firstUserMessage: string, firstAiMessage: string): Promise<string> => {
    const aiInstance = getAi();
    const prompt = `Based on this initial exchange, create a very short, concise title (4 words max) for this conversation.
    User: "${firstUserMessage}"
    AI: "${firstAiMessage}"
    Title:`;

    try {
        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        // Clean up the title - remove quotes and trim whitespace
        return response.text.replace(/["']/g, "").trim();
    } catch (error) {
        console.error("Error generating title:", error);
        return "New Chat";
    }
}