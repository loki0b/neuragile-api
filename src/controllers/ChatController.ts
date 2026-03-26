import { GoogleGenAI } from "@google/genai";
import { systemInstruction } from "src/lib/systemInstruction.js";

class ChatController {
    genAI = new GoogleGenAI({});

    async sendMessage(req: any, res: any, next: any) {
        const { userMessage } = req.body;

        try {
            const response = await this.genAI.models.generateContent({
                model: "gemini-3-flash-preview",
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: "application/json"
                },
                contents: userMessage
            });

            return res.status(200).json(JSON.parse(String(response.text)));
        } catch (err) {
            console.log(err);

            return res.status(500).json({"status": "Server Error"});
        }
    }
}

export default ChatController;