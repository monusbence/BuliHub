# BuliHub Vizsgaremek - README.md

Ez a README fájl minden olyan információt tartalmaz, amely a projekt értékeléséhez, teszteléséhez és ellenőrzéséhez szükséges.

---

## 📚 Dokumentáció elérése

A projekt teljes körű dokumentációja a repóban található:

- `\BuliHub\BuliHub\Bulihub_dokumentáció.docx`  
  (Tartalmazza a fejlesztői és felhasználói dokumentációt, valamint részletes telepítési és indítási útmutatót is.)

---

## 💻 Forráskód helye

A teljes forráskód az alábbi mappákban található:

- Frontend (React, TypeScript):  
  **`\BuliHub\BuliHub\src`**

- Backend (.NET 8, C#, Entity Framework Core):  
  **`/BuliHub\BuliHub\BuliHub_Backend`**

- Admin felület (WPF alkalmazás):  
  **`\BuliHub\BuliHub\WPF\AdminApp`**

---

## 🚀 Kipróbálás előkészítése

A termék kipróbálásához szükséges előkészületek:

### 1. Szükséges szoftverek és telepítésük

- **Visual Studio Community** (Backend, WPF admin):
  - [https://visualstudio.microsoft.com/downloads/](https://visualstudio.microsoft.com/downloads/)
  - Telepítéskor válaszd ki az „ASP.NET and web development” komponenst.

- **Visual Studio Code** (Frontend fejlesztéshez):
  - [https://code.visualstudio.com/](https://code.visualstudio.com/)
  - Telepítés alapértelmezett beállításokkal.

- **Node.js**:
  - [https://nodejs.org/](https://nodejs.org/)
  - Telepítés az alapértelmezett beállításokkal (npm-el együtt települ).

- **XAMPP** (Apache és MySQL):
  - [https://www.apachefriends.org/hu/index.html](https://www.apachefriends.org/hu/index.html)
  - Telepítés után az Apache és MySQL szervereket indítsd el, a start gombokra kattintva, aztán a MySQL sorában lévő admin gombot nyomd meg.

### 2. Frontend függőségek telepítése

Terminálban (`src` mappában):

```bash
npm i
npm i motion
npm i react-router-dom
npm i react-leaflet@4.2.1
```

### 3. Backend előkészítése (adatbázis telepítése)

Indítsd el a XAMPP-ot, majd kattints az Admin gombra a MySQL mellett. PhpMyAdminban importáld az adatbázis-fájlt:

- Adatbázisfájl elérhetősége: `Bulihub_Backend/adatbazisletrehozas.sql`
- PhpMyAdmin felületén kattints az „Import” fülre, válaszd ki a fájlt, majd kattints az „Importálás” gombra.

### 4. Backend függőségek telepítése (Visual Studio terminálban)

Navigálj a backend projekt mappájába (`Bulihub_Backend`):

```
cd Bulihub_Backend
dotnet tool install --global dotnet-ef
dotnet ef database update
```

---

## ▶️ Termék indítása

A projekt részeinek elindítása az alábbi módon történik:

### Backend indítása:

- Nyisd meg a backend projektet (`Bulihub_Backend.sln`) Visual Studio-ban.
- Indítsd el a projektet (`F5` vagy zöld „Run” gomb).
- A backend szolgáltatás automatikusan fut majd:  
  **`https://localhost:5001`**

### Frontend indítása:

Terminálban (`src` mappában):

```
npm run dev
```

Ezután a weboldal elérhető lesz itt:  
**`http://localhost:5173`**

### Admin WPF alkalmazás indítása:

- Nyisd meg a WPF projektet (`AdminApp.sln`) Visual Studio-ban.
- Indítsd el (`F5` vagy zöld „Run” gomb).

---

## 📋 Tesztadatok betöltése

A tesztadatokat tartalmazó adatbázisfájl (`Bulihub_Backend/100Tesztadat.sql`) megtalálható a repo `adatbazis` mappájában. Importálási útmutató a dokumentációban és fentebb található.

---

## 🧪 Unit tesztek helye

A backend Unit tesztek a következő mappában találhatók:

- \BuliHub\BuliHub\BuliHub_Backend\Bulihub_Backend.Tests`**

Indításuk Visual Studioban a Test Explorer segítségével végezhető.

---

## 🔗 Külső megosztások, további linkek

Minden szükséges fájl megtalálható a repóban, további külső megosztásra nincs szükség.
