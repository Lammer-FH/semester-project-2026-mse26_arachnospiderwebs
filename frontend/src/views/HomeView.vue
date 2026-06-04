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
          <IonGrid class="ion-no-padding">
            <IonRow>
              <IonCol size="12" size-sm="6" size-md="3" v-for="f in features" :key="f.title">
                <IonCard class="feature-card">
                  <IonCardContent class="ion-text-center">
                    <IonIcon :icon="f.icon" class="feature-icon" />
                    <h3>{{ f.title }}</h3>
                    <p>{{ f.text }}</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
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

    </IonContent>
    <IonFooter class="ion-no-border">
      <IonToolbar color="primary">
        <div class="container ion-text-center">
          <p class="footer-text">© 2026 Boutique Hotel Technikum &nbsp;|&nbsp;
            <router-link to="/imprint" class="footer-link">Impressum</router-link>
            &nbsp;|&nbsp;
            <router-link to="/about" class="footer-link">Über uns</router-link>
          </p>
        </div>
      </IonToolbar>
    </IonFooter>
  </IonPage>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonIcon, IonFooter, IonToolbar } from '@ionic/vue';
import { locationOutline, starOutline, restaurantOutline, wifiOutline } from 'ionicons/icons';
import AppNavbar from '@/components/organisms/AppNavbar.vue';

interface Feature {
  icon: string;
  title: string;
  text: string;
}

const features: Feature[] = [
  { icon: locationOutline, title: 'Zentrale Lage', text: 'Direkt im 1. Bezirk, fußläufig zu allen Sehenswürdigkeiten.' },
  { icon: starOutline, title: 'Boutique-Qualität', text: 'Individuell eingerichtete Zimmer mit persönlichem Service.' },
  { icon: restaurantOutline, title: 'Frühstück', text: 'Täglich frisches Frühstücksbuffet mit regionalen Produkten.' },
  { icon: wifiOutline, title: 'Free WiFi', text: 'Kostenloses Highspeed-WLAN in allen Zimmern und Bereichen.' },
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
.feature-icon {
  font-size: 2.5rem;
  color: var(--ion-color-secondary);
  margin-bottom: 12px;
}
.footer-text {
  color: #fff;
  font-size: 0.875rem;
  margin: 0;
}
.footer-link {
  color: var(--ion-color-secondary);
  text-decoration: none;
}
</style>
