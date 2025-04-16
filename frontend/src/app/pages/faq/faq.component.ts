import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';

interface FaqCategory {
  title: string;
  faqs: Array<{
    question: string;
    answer: string;
    isOpen?: boolean;
  }>;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  template: `
    <div class="min-h-screen bg-[var(--color-background)]">
      <div class="container mx-auto px-4 py-12 max-w-6xl">
        <!-- Hero Section -->
        <div class="text-center mb-16 animate-fade-in-down">
          <h1 class="mb-4">How can we help?</h1>
          <p class="text-lg text-foreground-light max-w-2xl mx-auto">
            Find answers to common questions or reach out to our support team
            for assistance
          </p>

          <div class="mt-8 flex flex-wrap justify-center gap-4">
            <a href="mailto:support&#64;skillmatch.com">
              <app-button variant="primary"> Contact Support </app-button>
            </a>
            <a routerLink="/help">
              <app-button variant="secondary"> Visit Help Center </app-button>
            </a>
          </div>
        </div>

        <!-- FAQ Categories -->
        <div class="grid gap-8 lg:grid-cols-3 mb-12 animate-fade-in-up">
          @for (category of faqCategories; track category.title) {
          <div class="space-y-4">
            <h4
              class="border-b-2 border-[var(--color-accent)]/20 pb-2 flex items-center gap-2"
            >
              <span>{{ category.title }}</span>
              <div class="h-2 w-2 rounded-full bg-[var(--color-accent)]"></div>
            </h4>
            <div class="space-y-3">
              @for (faq of category.faqs; track faq.question) {
              <div
                class="rounded-xl border border-foreground-light/20 bg-background-light/30 overflow-hidden hover:border-[var(--color-accent)] transition-colors duration-200"
              >
                <button
                  (click)="toggleFaq(faq)"
                  class="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-background-light/50"
                  [attr.aria-expanded]="faq.isOpen"
                  [attr.aria-controls]="'faq-' + sanitizeId(faq.question)"
                >
                  <span class="font-medium flex-1">{{ faq.question }}</span>
                  <span
                    class="transform transition-transform duration-300 text-[var(--color-accent)]"
                    [class.rotate-180]="faq.isOpen"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="transition-transform duration-300"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </button>
                @if (faq.isOpen) {
                <div
                  [id]="'faq-' + sanitizeId(faq.question)"
                  class="px-5 py-4 text-foreground-light border-t border-foreground-light/10 animate-fade-in-down bg-background-light/50"
                >
                  {{ faq.answer }}
                </div>
                }
              </div>
              }
            </div>
          </div>
          }
        </div>

        <!-- Still have questions? -->
        <div
          class="text-center p-8 rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 max-w-3xl mx-auto animate-fade-in-up animation-delay-200"
        >
          <div
            class="w-16 h-16 rounded-full bg-[var(--color-accent)]/20 mx-auto mb-6 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8 text-[var(--color-accent)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold mb-4">Still have questions?</h2>
          <p class="text-foreground-light mb-8 max-w-xl mx-auto">
            Can't find what you're looking for? Our support team is available
            24/7 to help you with any questions or concerns.
          </p>
          <div class="flex justify-center gap-4">
            <a href="mailto:support&#64;skillmatch.com">
              <app-button variant="primary"> Email Our Team </app-button>
            </a>
            <a routerLink="/contact">
              <app-button variant="secondary"> Visit Contact Page </app-button>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FaqComponent {
  faqCategories: FaqCategory[] = [
    {
      title: 'Getting Started',
      faqs: [
        {
          question: 'How does SkillMatch work?',
          answer:
            'SkillMatch uses AI-powered algorithms to analyze your skills, experience, and preferences to connect you with the most relevant job opportunities or candidates.',
          isOpen: false,
        },
        {
          question: 'How do I create an account?',
          answer:
            'Click the "Sign Up" button in the top right corner and follow the simple registration process. You can sign up using your email or connect with your Google or GitHub account.',
          isOpen: false,
        },
        {
          question: 'Is SkillMatch free for job seekers?',
          answer:
            "Yes, job seekers can use SkillMatch's basic features completely free of charge. Premium features are available for enhanced visibility and additional tools.",
          isOpen: false,
        },
      ],
    },
    {
      title: 'Job Seekers',
      faqs: [
        {
          question: 'How can I improve my match rate?',
          answer:
            'Keep your skills and preferences up to date, complete your profile thoroughly, and regularly engage with the platform. Our AI system learns from your interactions to provide better matches.',
          isOpen: false,
        },
        {
          question: 'Can I upload multiple CVs?',
          answer:
            'Yes, you can upload multiple versions of your CV tailored for different roles. Our system will analyze each version to optimize your job matches.',
          isOpen: false,
        },
        {
          question: 'How do I track my applications?',
          answer:
            'Access your dashboard to view all your applications, their current status, and any updates from employers in real-time.',
          isOpen: false,
        },
      ],
    },
    {
      title: 'Employers',
      faqs: [
        {
          question: 'How do I post a job?',
          answer:
            'Create an employer account, verify your company details, and use our intuitive job posting interface. You can specify required skills, experience levels, and other criteria.',
          isOpen: false,
        },
        {
          question: 'What are the benefits for employers?',
          answer:
            'Access pre-screened candidates matched by skills, reduce time-to-hire, get advanced analytics, and integrate with your existing HR systems.',
          isOpen: false,
        },
        {
          question: 'How much does it cost?',
          answer:
            'We offer flexible subscription plans based on your hiring needs. Contact our sales team for detailed pricing information.',
          isOpen: false,
        },
      ],
    },
  ];

  toggleFaq(faq: { isOpen?: boolean }) {
    faq.isOpen = !faq.isOpen;
  }

  sanitizeId(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
}
