import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    importProvidersFrom(
      ReactiveFormsModule,
      ToastrModule.forRoot({
        timeOut: 5000, // Czas wyświetlania wiadomości
        positionClass: 'toast-top-right', // Pozycja wiadomości
        preventDuplicates: true, // Unikaj duplikatów wiadomości
        closeButton: true, // Pokaż przycisk zamykania
      })
    ), provideAnimationsAsync()
  ]
};