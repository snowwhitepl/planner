# Interaktywny Kalendarz / Planner

Projekt to przeglądarkowy, interaktywny kalendarz z możliwością dodawania notatek do wybranych dni, przypisywania im kategorii, tworzenia checklisty oraz eksportu i importu danych w formacie JSON.

## Funkcje

- *Wyświetlanie miesięcznego kalendarza*
- *Dodawanie notatek do wybranych dni*
- *Trzy kategorie notatek*:
  - Praca (niebieska)
  - Osobiste (zielona)
  - Ważne (czerwona)
- *Checklisty zadań* przypisane do notatki
- **Zapis danych w localStorage**
- *Eksport danych* do pliku planner.json
- *Import danych* z pliku .json

## Technologie

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- localStorage

## Jak używać

1. **Otwórz plik index.html w przeglądarce.**
2. Przejdź do interesującego Cię dnia i kliknij, aby dodać notatkę.
3. Wpisz treść, wybierz kategorię i (opcjonalnie) dodaj zadania do checklisty.
4. Kliknij *Zapisz*, aby zapisać dane do localStorage.
5. Użyj przycisków *Eksport* i *Import*, aby zapisać/załadować dane jako plik JSON.

## Struktura danych w localStorage

Każdy dzień przechowywany jest pod kluczem w formacie: YYYY-M-D

Wartość to obiekt JSON, np.:

```json
{
  "note": "Spotkanie z zespołem",
  "category": "work",
  "checklist": [
    { "text": "Przygotować prezentację", "done": false },
    { "text": "Wydrukować materiały", "done": true }
  ]
}
