# AI_USAGE.md

---

## Session 1 – 05.05.2026

**Tool:** Claude Sonnet 4.6 (claude.ai)

### 1 · OpenAPI Spec generieren
**Task:** `openapi.json` aus bestehender Markdown-Spec erstellen  
**Result:** ✅ Vollständig akzeptiert

### 2 · API-Design kritisieren (Advocatus Diaboli)
**Task:** Schwachstellen der API identifizieren  
**Result:** Teilweise akzeptiert  
- ❌ Auth & Rate Limiting → außerhalb Projektscope  
- 🔄 `emailConfirm` → nach eigener Analyse als UI-only erkannt, aus Backend entfernt  
- 🔄 Frühstück → zunächst als fehlend markiert, nach Klärung korrekt wieder aufgenommen

### 3 · OpenAPI v2 umsetzen
**Task:** Kritikpunkte in `openapi.json` einarbeiten  
**Result:** ✅ Vollständig akzeptiert (UUID, N+1-Fix, Stornierung, Paginierung, imageUrl, UTC)

### 4 · Use Case Dokumentation
**Task:** `api-usecases.md` mit E2E-Flows und API-Calls erstellen  
**Result:** ✅ Vollständig akzeptiert

### 5 · Edge Cases analysieren & umsetzen
**Task:** Fehlende Edge Cases identifizieren, API-Fähigkeit prüfen, dokumentieren  
**Result:** Teilweise akzeptiert  
- 🔄 `checkIn === checkOut` → AI markierte als Lücke, Regel selbst entschieden (= 1 Nacht)  
- ❌ Timeout-Handling → kein API-Thema, nicht dokumentiert

### 6 · Commit Messages
**Task:** Conventional Commit Messages für beide Änderungsrunden  
**Result:** ✅ Vollständig akzeptiert

---

> **Legende:** ✅ akzeptiert · 🔄 modifiziert · ❌ abgelehnt
