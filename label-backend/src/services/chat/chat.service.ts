import { randomUUID } from "crypto";
import { ChatSessionModel } from "@models/index";
import { geminiClient } from "@services/gemini/gemini.client";
import { profileService } from "@services/profiles/profile.service";
import { AppError } from "@shared/errors";

interface SendMessageInput {
  userId: string;
  sessionId?: string;
  message: string;
}

interface ChatResponse {
  sessionId: string;
  reply: string;
}

interface UserProfile {
  id: string;
  userId: string;
  name: string;
  ageGroup: "adult" | "child" | "senior";
  language: "en" | "hi" | "kn";
  conditions: string[];
  allergies: string[];
  diet: "veg" | "vegan" | "jain" | "none";
  childMode: boolean;
  abhaConnected: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class ChatService {
  private buildNutritionPrompt(userProfile: UserProfile, userMessage: string, recentDialogue: string[]): string {
    const conditions = userProfile.conditions ?? [];
    const allergies = userProfile.allergies ?? [];
    const languageLabel = this.describeLanguage(userProfile.language);

    const lines: string[] = [
      "You are Nutri Saath, a friendly Indian nutrition and lifestyle assistant.",
      "Provide evidence-backed guidance aligned with Indian dietary habits, cultural context, seasonal availability, and FSSAI recommendations.",
      "Always consider the user's health profile before suggesting foods.",
      "",
      "PROFILE SNAPSHOT:",
      `- Name: ${userProfile.name}`,
      `- Age group: ${this.describeAgeGroup(userProfile.ageGroup)}`,
      `- Primary language: ${languageLabel} (reply in this language when confident, otherwise reply in English).`,
      `- Diet preference: ${this.describeDiet(userProfile.diet)}`,
    ];

    if (conditions.length > 0) {
      lines.push(`- Health conditions: ${conditions.join(", ")}`);
      lines.push(...this.conditionGuidance(conditions));
    } else {
      lines.push("- Health conditions: none reported");
    }

    if (allergies.length > 0) {
      lines.push(`- Allergies: ${allergies.join(", ")}`);
      lines.push("  Highlight safe alternatives and warn clearly about trigger foods.");
    } else {
      lines.push("- Allergies: none reported");
    }

    if (userProfile.childMode) {
      lines.push("- Tone: child-friendly (simple words, encouraging). Commonly used Indian foods are preferred.");
    }

    if (userProfile.abhaConnected) {
      lines.push("- ABHA linked: yes (mention digital health tracking when relevant)." );
    }

    lines.push(
      "",
      "RESPONSE EXPECTATIONS:",
      "- Start with a warm greeting referencing the user's profile.",
      "- Share 1-2 short paragraphs that explain the advice with Indian context (local foods, cooking styles, regional considerations).",
      "- Follow with a bullet list of 2-3 actionable tips, meal ideas, or substitutions.",
      "- If suggesting packaged foods, remind the user to inspect Indian FSSAI nutrition labels.",
      "- Explicitly call out foods to avoid or limit when conditions/allergies apply.",
      "- If lifestyle tips are relevant (hydration, activity, sleep), include them briefly.",
      "- Keep the tone positive, respectful, and supportive.",
    );

    if (recentDialogue.length > 0) {
      lines.push("", "RECENT CONVERSATION:");
      lines.push(...recentDialogue.map((entry) => `- ${entry}`));
    }

    lines.push(
      "",
      "CURRENT QUESTION:",
      userMessage.trim(),
      "",
      "Craft the response now following the expectations above.",
    );

    return lines.join("\n");
  }

  private describeLanguage(language: UserProfile["language"]): string {
    switch (language) {
      case "hi":
        return "Hindi";
      case "kn":
        return "Kannada";
      default:
        return "English";
    }
  }

  private describeAgeGroup(ageGroup: UserProfile["ageGroup"]): string {
    switch (ageGroup) {
      case "child":
        return "Child (focus on growth, immunity, and engaging meals)";
      case "senior":
        return "Senior (support bone health, digestion, and energy)";
      default:
        return "Adult (balance energy, metabolism, and overall wellness)";
    }
  }

  private describeDiet(diet: UserProfile["diet"]): string {
    switch (diet) {
      case "veg":
        return "Vegetarian (includes dairy, excludes eggs/meat/fish)";
      case "vegan":
        return "Vegan (no animal-derived products)";
      case "jain":
        return "Jain (vegetarian, excludes root vegetables, onions, garlic)";
      default:
        return "No specific restriction";
    }
  }

  private conditionGuidance(conditions: string[]): string[] {
    const notes: string[] = [];
    if (conditions.includes("diabetes")) {
      notes.push("  For diabetes: prioritise low glycaemic foods, whole grains, high fibre, and controlled portions.");
    }
    if (conditions.includes("hypertension")) {
      notes.push("  For hypertension: recommend low-sodium options, potassium-rich foods, and heart-healthy fats.");
    }
    if (notes.length === 0) {
      notes.push("  Address any condition-specific needs with medically sound advice.");
    }
    return notes;
  }

  async sendMessage({ userId, sessionId, message }: SendMessageInput): Promise<ChatResponse> {
    const sanitizedMessage = message.trim();
    if (!sanitizedMessage) {
      throw new AppError("Message cannot be empty", 400);
    }

    const userProfile = await profileService.ensureDefaultProfile(userId, "User");

    const existingSession = sessionId
      ? await ChatSessionModel.findOne({ userId, sessionId })
      : null;

    const history = existingSession?.messages || [];
    const recentDialogue = history
      .slice(-3)
      .map((entry) => `${entry.role === "assistant" ? "Assistant" : "User"}: ${entry.text}`);

    const prompt = this.buildNutritionPrompt(userProfile, sanitizedMessage, recentDialogue);

    const reply = await geminiClient.generateText(prompt, {
      temperature: 0.6,
    });

    const finalSessionId = existingSession?.sessionId ?? sessionId ?? randomUUID();
    const now = new Date();

    await ChatSessionModel.findOneAndUpdate(
      { userId, sessionId: finalSessionId },
      {
        userId,
        sessionId: finalSessionId,
        modelId: "gemini-pro",
        messages: [
          ...history,
          { role: "user", text: sanitizedMessage, ts: now },
          { role: "assistant", text: reply, ts: now },
        ],
      },
      { upsert: true, setDefaultsOnInsert: true },
    );

    return { sessionId: finalSessionId, reply };
  }
}

export const chatService = new ChatService();
