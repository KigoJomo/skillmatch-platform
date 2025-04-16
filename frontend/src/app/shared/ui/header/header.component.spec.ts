import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { BehaviorSubject } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser: null,
    });

    mockThemeService = jasmine.createSpyObj(
      'ThemeService',
      ['toggleTheme', 'getCurrentTheme'],
      {
        currentTheme$: new BehaviorSubject('dark'),
      }
    );
    mockThemeService.getCurrentTheme.and.returnValue('dark');

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ThemeService, useValue: mockThemeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle theme when theme button is clicked', () => {
    const themeButton = fixture.nativeElement.querySelector(
      'button[aria-label="Toggle theme"]'
    );
    themeButton.click();
    expect(mockThemeService.toggleTheme).toHaveBeenCalled();
  });
});
