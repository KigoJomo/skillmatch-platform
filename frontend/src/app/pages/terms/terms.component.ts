import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold mb-8">Terms of Service</h1>
      <div class="prose max-w-none space-y-6">
        <section>
          <h2 class="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using SkillMatch, you agree to be bound by these
            Terms of Service and all applicable laws and regulations.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4">2. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4">3. User Conduct</h2>
          <p>You agree not to:</p>
          <ul class="list-disc ml-6 mt-2">
            <li>Provide false or misleading information</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Impersonate any person or entity</li>
            <li>Interfere with the proper functioning of the service</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4">4. Intellectual Property</h2>
          <p>
            All content and materials available on SkillMatch are protected by
            applicable intellectual property laws.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
          <p>
            SkillMatch shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages resulting from your use
            of the service.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Your
            continued use of SkillMatch after such modifications constitutes
            acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4">7. Contact</h2>
          <p>
            For questions about these Terms of Service, please contact us at
            legal&#64;skillmatch.com
          </p>
        </section>
      </div>
    </div>
  `,
})
export class TermsComponent {}
