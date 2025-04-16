import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getLogoClasses()">
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.9999 1.33334V24.6667M21.2495 4.75043L4.75034 21.2496M24.6666 13H1.33325M21.2495 21.2496L4.75034 4.75043"
          class="stroke-accent"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <span class="font-bold text-[var(--color-accent)]">SkillMatch</span>
    </div>
  `,
})
export class LogoComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  getLogoClasses(): string {
    const sizeClasses = {
      sm: 'text-xl',
      md: 'text-2xl',
      lg: 'text-4xl',
    };
    return `flex items-center ${sizeClasses[this.size]}`;
  }
}
