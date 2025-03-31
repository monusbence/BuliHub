# BuliHub Vizsgaremek - README.md

Ez a README fájl minden olyan információt tartalmaz, amely a projekt értékeléséhez, teszteléséhez és ellenőrzéséhez szükséges.

---

## 📚 Dokumentáció elérése

A projekt teljes körű dokumentációja a repóban található:

- `docs/dokumentacio.pdf`  
  (Tartalmazza a fejlesztői és felhasználói dokumentációt, valamint részletes telepítési és indítási útmutatót is.)

---

## 💻 Forráskód helye

A teljes forráskód az alábbi mappákban található:

- Frontend (React, TypeScript):  
  **`frontend/`**

- Backend (.NET 7, C#, Entity Framework Core):  
  **`backend/Bulihub_Backend/`**

- Admin felület (WPF alkalmazás):  
  **`admin/Bulihub_AdminWPF/`**

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
  - Telepítés után az Apache és MySQL szervereket indítsd el.

### 2. Frontend függőségek telepítése

Terminálban (`frontend` mappában):

```bash
npm i
npm i motion
npm i react-router-dom
npm i react-leaflet@4.2.1
```

### 3. Backend előkészítése (adatbázis telepítése)

Indítsd el a XAMPP-ot, majd kattints az Admin gombra a MySQL mellett. PhpMyAdminban importáld az adatbázis-fájlt:

- Adatbázisfájl elérhetősége: `adatbazis/adatbazisletrehozas.sql`
- PhpMyAdmin felületén kattints az „Import” fülre, válaszd ki a fájlt, majd kattints az „Importálás” gombra.

### 4. Backend függőségek telepítése (Visual Studio terminálban)

Navigálj a backend projekt mappájába (`Bulihub_Backend`):

```bash
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

Terminálban (`frontend` mappában):

```bash
npm run dev
```

Ezután a weboldal elérhető lesz itt:  
**`http://localhost:5173`**

### Admin WPF alkalmazás indítása:

- Nyisd meg a WPF projektet (`Bulihub_AdminWPF.sln`) Visual Studio-ban.
- Indítsd el (`F5` vagy zöld „Run” gomb).

---

## 📋 Tesztadatok betöltése

A tesztadatokat tartalmazó adatbázisfájl (`adatbazis/adatbazisletrehozas.sql`) megtalálható a repo `adatbazis` mappájában. Importálási útmutató a dokumentációban és fentebb található.

---

## 🧪 Unit tesztek helye

A backend Unit tesztek a következő mappában találhatók:

- **`backend/Bulihub_Backend.Tests/`**

Indításuk Visual Studioban a Test Explorer segítségével végezhető.

---

## 🔗 Külső megosztások, további linkek

Minden szükséges fájl megtalálható a repóban, további külső megosztásra nincs szükség.

---

Bármilyen további kérdés esetén a dokumentáció tartalmazza a kapcsolatfelvételi információkat.

Köszönöm az értékelést! 🚀
