import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { ChatSession } from '../entities/ChatSession';
import { ChatMessage, MessageRole } from '../entities/ChatMessage';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class ChatController {
  private static genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY || ''
  );
  private static model = ChatController.genAI.getGenerativeModel({
    model: 'gemini-pro',
  });

  static async getAllSessions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.body.userId;
      const sessionRepository = AppDataSource.getRepository(ChatSession);

      const sessions = await sessionRepository.find({
        where: { user: { id: userId } },
        order: { sessionStart: 'DESC' },
      });

      res.json(sessions);
    } catch (error) {
      next(error);
    }
  }

  static async createSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.body.userId;
      const context = req.body.context || {};

      const sessionRepository = AppDataSource.getRepository(ChatSession);

      const session = new ChatSession();
      session.user = { id: userId } as any;
      session.sessionStart = new Date();
      session.context = context;

      const savedSession = await sessionRepository.save(session);
      res.status(201).json(savedSession);
    } catch (error) {
      next(error);
    }
  }

  static async getSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.body.userId;

      const sessionRepository = AppDataSource.getRepository(ChatSession);
      const session = await sessionRepository.findOne({
        where: { id, user: { id: userId } },
        relations: ['messages'],
      });

      if (!session) {
        res.status(404).json({ error: 'Chat session not found' });
        return;
      }

      res.json(session);
    } catch (error) {
      next(error);
    }
  }

  static async getMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.body.userId;

      const messageRepository = AppDataSource.getRepository(ChatMessage);
      const messages = await messageRepository.find({
        where: { session: { id, user: { id: userId } } },
        order: { timestamp: 'ASC' },
      });

      res.json(messages);
    } catch (error) {
      next(error);
    }
  }

  static async sendMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.body.userId;

      const sessionRepository = AppDataSource.getRepository(ChatSession);
      const messageRepository = AppDataSource.getRepository(ChatMessage);

      // Verify session exists and belongs to user
      const session = await sessionRepository.findOne({
        where: { id, user: { id: userId } },
        relations: ['messages'],
      });

      if (!session) {
        res.status(404).json({ error: 'Chat session not found' });
        return;
      }

      // Save user message
      const userMessage = new ChatMessage();
      userMessage.session = session;
      userMessage.role = MessageRole.USER;
      userMessage.content = content;
      await messageRepository.save(userMessage);

      // Get relevant context from database for Gemini
      const relevantData = await ChatController.getRelevantContext(
        userId,
        content
      );

      // Prepare chat for Gemini
      const chat = ChatController.model.startChat({
        history: session.messages.map((msg) => ({
          role: msg.role,
          parts: msg.content,
        })),
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        },
      });

      // Get response from Gemini with context
      const prompt = ChatController.buildPrompt(content, relevantData);
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const aiResponse = response.text();

      // Save AI response
      const assistantMessage = new ChatMessage();
      assistantMessage.session = session;
      assistantMessage.role = MessageRole.ASSISTANT;
      assistantMessage.content = aiResponse;
      assistantMessage.relevantData = relevantData;
      await messageRepository.save(assistantMessage);

      // Return both messages
      res.json({
        userMessage,
        assistantMessage,
      });
    } catch (error) {
      next(error);
    }
  }

  private static async getRelevantContext(
    userId: string,
    message: string
  ): Promise<any> {
    // Query relevant data based on message content
    const jobRepository = AppDataSource.getRepository('Job');
    const profileRepository = AppDataSource.getRepository('Profile');
    const applicationRepository = AppDataSource.getRepository('Application');

    // Get user profile
    const profile = await profileRepository.findOne({
      where: { user: { id: userId } },
    });

    // Get basic job stats
    const jobCount = await jobRepository.count();
    const userApplications = await applicationRepository.count({
      where: { user: { id: userId } },
    });

    // More complex queries based on message content would go here
    // For example, finding relevant jobs based on skills mentioned

    return {
      profile,
      stats: {
        totalJobs: jobCount,
        userApplications,
      },
    };
  }

  private static buildPrompt(message: string, context: any): string {
    // Base system context
    let prompt = `You are an AI career assistant helping users with job search and career advice. 
    You have access to their profile and job-related data. Be helpful, professional, and concise.
    
    Current context:
    - Total jobs available: ${context.stats.totalJobs}
    - User's applications: ${context.stats.userApplications}
    `;

    if (context.profile) {
      prompt += `
      User Profile:
      - Skills: ${context.profile.skills?.join(', ')}
      - Experience Level: ${context.profile.experienceLevel}
      - Preferred Job Types: ${context.profile.jobTypes?.join(', ')}
      `;
    }

    prompt += `\nUser message: ${message}\n`;
    return prompt;
  }
}
