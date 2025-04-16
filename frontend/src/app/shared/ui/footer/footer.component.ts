import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  template: `
    <footer
      class="w-full bg-[var(--color-background)] border-t border-[var(--color-foreground-light)]/10 py-8"
    >
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="flex flex-col gap-4">
            <app-logo size="sm"></app-logo>
            <p class="text-sm text-[var(--color-foreground-light)]">
              Find and match the perfect skills for your needs
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <h5 class="font-bold">
              Company
            </h5>
            <a
              routerLink="/about"
              class="text-sm text-[var(--color-foreground-light)] hover:text-[var(--color-accent)]"
            >
              About Us
            </a>
            <a
              routerLink="/careers"
              class="text-sm text-[var(--color-foreground-light)] hover:text-[var(--color-accent)]"
            >
              Careers
            </a>
          </div>

          <div class="flex flex-col gap-2">
            <h5 class="font-bold">
              Resources
            </h5>
            <a
              routerLink="/blog"
              class="text-sm text-[var(--color-foreground-light)] hover:text-[var(--color-accent)]"
            >
              Blog
            </a>
            <a
              routerLink="/help"
              class="text-sm text-[var(--color-foreground-light)] hover:text-[var(--color-accent)]"
            >
              Help Center
            </a>
          </div>

          <div class="flex flex-col gap-2">
            <h5 class="font-bold">Legal</h5>
            <a
              routerLink="/privacy"
              class="text-sm text-[var(--color-foreground-light)] hover:text-[var(--color-accent)]"
            >
              Privacy Policy
            </a>
            <a
              routerLink="/terms"
              class="text-sm text-[var(--color-foreground-light)] hover:text-[var(--color-accent)]"
            >
              Terms of Service
            </a>
          </div>
        </div>

        <div
          class="mt-8 pt-8 border-t border-[var(--color-foreground-light)]/10"
        >
          <p class="text-sm text-center text-[var(--color-foreground-light)]">
            © {{ currentYear }} SkillMatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
