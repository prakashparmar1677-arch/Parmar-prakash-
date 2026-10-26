# Pro Tournament — demo website

## Run locally (free)
1. Extract `pro-tournament.zip`.
2. Open the `pro_tournament` folder.
3. Double-click `index.html` to open it in a modern browser. For best results, use Chrome.
4. Click **Admin Login**. Demo password: `ChangeMe123!`.
5. In `app.js`, change `ADMIN_PASSWORD` to a different password before sharing the demo.

## What works
- Tournament list and Free/Paid filters
- Registration form with player name and numeric UID
- Admin can create/delete tournaments, cycle status, view/remove registrations
- Export/import JSON backup
- Data persists in the same browser using localStorage

## Important limitations
This is a front-end prototype, not a secure production service. Data is stored only in the current browser/device; other visitors will not share the same data. The admin password is visible in client-side code and is not secure. Do not publish it as a real public admin system, collect sensitive personal data, or accept real payments with this prototype. Paid entry is only a demo listing and payment is not implemented.

For a real public version, add server-side authentication and database rules (for example Firebase Auth + Firestore security rules), server-side validation, privacy notice, abuse reporting, and review the laws and game publisher/payment provider rules that apply before offering paid entry or cash prizes. Keep a free-only test version until those pieces are implemented.
