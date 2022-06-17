
---
Development Environment
-
`yarn install`<br>
`yarn dev`

---


Production Environment
-
`yarn install`<br>
`yarn build`<br>
`yarn start`

---

Database initialize
-

Create Database<br>
`ts-node migrations/create-database/0.create-database.ts`

Create table<br>
`ts-node migrations/create-table/0.create-all-table.ts`

Create table(‼️ FORCE ‼️)<br>
`ts-node migrations/create-table/0.create-all-table.ts --force`
