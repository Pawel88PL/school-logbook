# 📝 School Logbook
## 🌟 Opis projektu

System dziennika elektronicznego to aplikacja webowa wspierająca zarządzanie procesami edukacyjnymi w szkołach. Projekt powstał jako część zaliczenia przedmiotu **Programowanie w zastosowaniach** i umożliwia efektywne zarządzanie planem lekcji, obecnościami oraz ocenami uczniów.

Aplikacja została zaprojektowana w oparciu o architekturę layoutów przypisanych do ról użytkowników, co zapewnia przejrzystość struktury i separację odpowiedzialności. Dla każdej roli zdefiniowano osobny layout oraz zestaw komponentów i tras:

- **Administrator** (`AdminLayoutComponent`):  
  Zarządzanie klasami, przedmiotami, użytkownikami oraz planem lekcji.
- **Nauczyciel** (`TeacherLayoutComponent`):  
  Wystawianie ocen, przegląd planu lekcji, zaznaczanie obecności.
- **Uczeń** (`StudentLayoutComponent`):  
  Przegląd własnego planu lekcji oraz historii obecności.

Każda sekcja posiada własną nawigację, trasowanie i zabezpieczenia (`adminGuard`, `teacherGuard`, `studentGuard`), co pozwala na precyzyjne kontrolowanie dostępu i łatwe rozszerzanie funkcjonalności bez naruszania innych modułów.

Dzięki temu podejściu aplikacja jest skalowalna, łatwa w utrzymaniu i przygotowana na ewentualne dodanie nowych ról użytkowników, np.:
- rodzic,
- sekretariat.

---

## 📋 Funkcjonalności w szczegółach

### ✅ Gotowe:
- **Rejestracja obecności**: Nauczyciele mogą oznaczać obecności uczniów na zajęciach.
- **Dodawanie i edycja klas, przedmiotów**: Administrator dodaje, usuwa i edytuje przedmioty i klasy.
- **Tworzenie i edycja planu lekcji**: Administrator ma możliwość zarządzania harmonogramem zajęć.
- **Zarządzanie użytkownikami**: Administrator może dodawać, edytować i usuwać konta użytkowników.
- **Przegląd planu lekcji**: Nauczyciele mogą przeglądać swoje zajęcia w przejrzystym widoku.
- **Wystawianie i przeglądanie ocen**: Funkcjonalność umożliwiająca nauczycielom ocenianie uczniów.
- **Zaawansowana obsługa sesji JWT**:  
  Aplikacja monitoruje ważność tokena JWT. Na 2 minuty przed wygaśnięciem sesji użytkownik otrzymuje dynamiczne powiadomienie (toast) z odliczaniem czasu i możliwością ręcznego przedłużenia sesji. W przypadku braku reakcji i wygaśnięcia tokena następuje automatyczne wylogowanie z odpowiednim komunikatem. System wspiera także bezinwazyjne odświeżanie tokena JWT przez zapytanie HTTP z autoryzacją.

---

## 🛠️ Technologie użyte w projekcie

### Backend:
- **Framework**: `ASP.NET Core 8`
- **ORM**: `Entity Framework Core`
- **Baza danych**: `SQL Server`
- **Autoryzacja**: `JWT`
- **Logowanie**: `Serilog`

### Frontend:
- **Framework**: `Angular 17+`
- **UI**: `Angular Material`
- **Reaktywność**: `RxJS`
- **Powiadomienia**: `ngx-toastr`

---

## 🗂️ Struktura katalogów

```
school-logbook/
├── backend/       # Backend oparty na ASP.NET Core
│   ├── Controllers/
│   ├── Data/
│   ├── DTOs/
│   ├── Interfaces/
│   ├── MappingProfiles/
│   ├── Migrations/
│   ├── Models/
│   ├── Properties/
│   ├── Services/
│   ├── appsettings.json
│   └── Program.cs
│
├── frontend/      # Frontend oparty na Angularze
│   ├── src/
│   │   ├── app/
│   │   |    ├── core/
│   │   |    ├── features/
│   │   |    ├── layout/
│   │   |    └── shared/
|   |   ├── assets/
│   │   |    └── fonts/
|   |   └── enviroments/
|   |
│   └── angular.json
│
└── README.md
```

---

## 🚀 Instrukcja uruchomienia projektu lokalnie

### 📦 Wymagania wstępne:
- **Node.js**: `v22.16.0`
- **.NET SDK**: `v8`
- **SQL Server**: Baza danych jest dostępna online
- **Angular CLI**: `npm install -g @angular/cli`

### ▶️ Uruchomienie backendu

1. Przejdź do katalogu `backend`:
    ```bash
    cd backend
    ```
2. Przywróć zależności:
    ```bash
    dotnet restore
    ```
3. Uruchom API:
    ```bash
    dotnet run
    ```
    Backend będzie dostępny pod adresem: `http://localhost:5234`

    ⚠️ Upewnij się, że plik `appsettings.json` zawiera poprawny connection string i klucz do tworzenia JWT.

### ▶️ Uruchomienie frontendu

1. Przejdź do katalogu `frontend`:
    ```bash
    cd frontend
    ```
2. Zainstaluj zależności:
    ```bash
    npm install
    ```
3. Uruchom aplikację:
    ```bash
    ng serve
    ```
    Frontend będzie dostępny pod adresem: `http://localhost:4200`

---

## 👥 Konta testowe

| Rola          | E-mail                    | Hasło     |
|---------------|---------------------------|-----------|
| Administrator | pstaniul@gmail.com        | opel1234  |
| Nauczyciel    | barbara@gmail.com         | opel1234  |
| Uczeń         | janek.kowalski@gmail.com  | opel1234  |

Po zalogowaniu token JWT jest zapisywany w `localStorage`. Wszystkie żądania do backendu wymagają nagłówka:

```
Authorization: Bearer <token>
```

---

## 📈 Status funkcjonalności

| Moduł              | Status                |
|--------------------|-----------------------|
| Logowanie          | ✅ Gotowe             |
| Role i autoryzacja | ✅ Gotowe             |
| Użytkownicy        | ✅ Gotowe             |
| Plan lekcji        | ✅ Gotowe             |
| Obecności          | ✅ Gotowe             |
| Oceny              | ✅ Gotowe             |

---
## 👨‍💻 Autorzy:

- **Anna Sroka**  
- **Barbara Sławińska**  
- **Justyna Szofińska**  
- **Paweł Staniul**  

---

### 🎓 Uniwersytet:
**Uniwersytet WSB Merito w Poznaniu**  
**Kierunek:** Informatyka