# Erworbenes Wissen

## Projekt-Architektur
- Multisite-Plattform für OpenCarBox (Werkstatt/Autohandel) und Carvantooo (Shop).
- Tech-Stack: Next.js 15, TypeScript, Tailwind CSS, Prisma, Supabase.
- Sprach-Konvention (G10): Englisch für Code/Git, Deutsch für UI/Doku.

## Branding & Design (G9)
- **Carvantooo (Shop):** Primary Gelb (#FFB300).
- **OpenCarBox (Werkstatt/Autohandel):** Primary Orange (#FFA800).
- **Gemeinsamkeiten:** Schwarz (#000000) und Weiß (#FFFFFF) nach Continental CI.
- **Implementierung:** Über CSS-Variablen in `globals.css` und Tailwind-Theme.

## Tracking & Analytics (G4)
- **Tracking First:** Jede kritische Interaktion wird via Zod-validierten Events erfasst.
- **Events:** Definiert in `src/lib/events.ts`.
- **Funnel-Stages:** AWARENESS, EDUCATION, CONSIDERATION, CONVERSION, RETENTION.

## CI/CD & Build-Prozess
- **Postinstall-Robustheit:** Das `postinstall.js` Skript generiert den Prisma-Client auch ohne `DATABASE_URL` (Fallback auf dummy URL), um Build-Abbrüche auf Vercel zu verhindern.
- **Quality Gate:** Strenge Prüfung auf TypeScript-Fehler und `console.log` Statements.

## Bekannte Einschränkungen
- **IPv6 Konnektivität:** Sandbox-Umgebungen ohne IPv6 können Supabase-Direktverbindungen (`db.*.supabase.co`) oft nicht erreichen.
- **Supabase Pooler:** Benötigt korrektes User-Mapping (`postgres.[project-ref]`) und Port 6543 für Transaction Mode.
