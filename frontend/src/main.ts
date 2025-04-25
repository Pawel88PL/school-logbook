// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';

// Rejestracja języka polskiego
registerLocaleData(localePl);

// Dodajemy LOCALE_ID do konfiguracji, aby wymusić język polski
bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), // Zachowaj innych dostawców z appConfig
    { provide: LOCALE_ID, useValue: 'pl' } // Ustawienie języka aplikacji na polski
  ]
}).catch((err) => console.error(err));
