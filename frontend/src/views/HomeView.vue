<template>
  <IonPage>
    <AppNavbar />
    <IonContent>
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-overlay">
          <h1 class="hero-title">Boutique Hotel Technikum</h1>
          <p class="hero-subtitle">Ihr exklusives Stadthotel im Herzen Wiens</p>
          <IonButton router-link="/rooms" color="secondary" size="large" class="hero-btn">
            Zimmer entdecken
          </IonButton>
        </div>
      </section>

      <!-- Features -->
      <section class="section">
        <div class="container">
          <h2 class="section-title">Warum Boutique Hotel Technikum?</h2>
          <div class="features-grid">
            <div class="feature-card" v-for="f in features" :key="f.title">
              <ion-icon :name="f.icon" class="feature-icon" />
              <h3>{{ f.title }}</h3>
              <p>{{ f.text }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Room Teaser -->
      <section class="section section-alt">
        <div class="container ion-text-center">
          <h2 class="section-title">Unsere Zimmer</h2>
          <p>Von der gemütlichen Einzelkabine bis zur luxuriösen Penthouse-Suite – für jeden Anspruch das Richtige.</p>
          <IonButton router-link="/rooms" color="primary" class="ion-margin-top">
            Alle Zimmer ansehen
          </IonButton>
        </div>
      </section>

      <!-- Footer -->
      <footer class="site-footer">
        <div class="container">
          <p>© 2026 Boutique Hotel Technikum &nbsp;|&nbsp;
            <router-link to="/imprint" class="footer-link">Impressum</router-link>
            &nbsp;|&nbsp;
            <router-link to="/about" class="footer-link">Über uns</router-link>
          </p>
        </div>
      </footer>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton } from '@ionic/vue';
import AppNavbar from '@/components/organisms/AppNavbar.vue';

const features = [
  { icon: 'location', title: 'Zentrale Lage', text: 'Direkt im 1. Bezirk, fußläufig zu allen Sehenswürdigkeiten.' },
  { icon: 'star', title: 'Boutique-Qualität', text: 'Individuell eingerichtete Zimmer mit persönlichem Service.' },
  { icon: 'restaurant', title: 'Frühstück', text: 'Täglich frisches Frühstücksbuffet mit regionalen Produkten.' },
  { icon: 'wifi', title: 'Free WiFi', text: 'Kostenloses Highspeed-WLAN in allen Zimmern und Bereichen.' },
];
</script>

<style scoped>
.hero {
  height: 70vh;
  min-height: 400px;
  background: linear-gradient(135deg, #1a3a5c 0%, #2a5080 60%, #c8a96e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
}
.hero-overlay {
  padding: 24px;
  color: #fff;
}
.hero-title {
  font-size: clamp(1.8rem, 5vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 12px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  opacity: 0.9;
  margin-bottom: 32px;
}
.hero-btn {
  --border-radius: 4px;
}
.section {
  padding: 60px 16px;
}
.section-alt {
  background: var(--ion-color-light);
}
.container {
  max-width: 1100px;
  margin: 0 auto;
}
.section-title {
  font-size: clamp(1.4rem, 3vw, 2rem);
  color: var(--ion-color-primary);
  margin-bottom: 32px;
  text-align: center;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}
.feature-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.feature-icon {
  font-size: 2.5rem;
  color: var(--ion-color-secondary);
  margin-bottom: 12px;
}
.feature-card h3 {
  color: var(--ion-color-primary);
  margin-bottom: 8px;
}
.feature-card p {
  font-size: 0.9rem;
  color: var(--ion-color-medium);
}
.site-footer {
  background: var(--ion-color-primary);
  color: #fff;
  padding: 24px 16px;
  text-align: center;
  font-size: 0.875rem;
}
.footer-link {
  color: var(--ion-color-secondary);
  text-decoration: none;
}
</style>
