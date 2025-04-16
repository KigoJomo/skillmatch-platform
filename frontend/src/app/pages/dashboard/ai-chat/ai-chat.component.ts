import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/ui/input/input.component';

interface ChatContact {
  id: string;
  name: string;
  title: string;
  timestamp: string;
  summary: string;
  imageUrl: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="h-screen bg-background">
      <div class="flex h-full">
        <!-- Chat Area -->
        <div class="md:mx-40 flex-1 flex flex-col">
          <!-- Chat Header -->
          <div
            class="flex items-center justify-between p-4 border-b border-[#30363D]"
          >
            <h5 class="font-medium">AI Recruitment Assistant</h5>
          </div>

          <!-- Messages Area -->
          <div class="flex-1 max-h-[65vh] p-4 space-y-4 overflow-y-auto">
            <div
              class="flex flex-col items-center justify-center h-full text-center text-[#8B949E]"
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                class="mb-4"
              >
                <path
                  d="M12 3v3m0 12v3M3 12h3m12 0h3M5.636 5.636l2.122 2.122m8.484 8.484l2.122 2.122M5.636 18.364l2.122-2.122m8.484-8.484l2.122-2.122"
                />
              </svg>
              <p class="text-lg font-medium mb-2">Welcome to AI Recruiter</p>
              <p class="max-w-sm text-sm">
                Start a conversation about candidates, job matching, or get
                recruitment insights
              </p>
            </div>
          </div>

          <!-- Input Area -->
          <div class="p-4 border-t border-background-light">
            <div class="relative">
              <input
                type="text"
                placeholder="Type your message..."
                class="w-full bg-[#161B22] border border-[#30363D] rounded-lg pl-4 pr-24 py-3 focus:outline-none focus:border-[#2F81F7]"
              />
              <div class="absolute right-2 top-2 flex gap-1">
                <button
                  class="p-1.5 text-[#8B949E] hover:text-[#E6EDF3] transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AIChatComponent {
 
}
