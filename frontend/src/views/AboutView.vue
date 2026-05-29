<template>
  <IonPage>
    <AppNavbar />
    <IonContent class="ion-padding">
      <div class="container">
        <h1 class="page-title">Über uns</h1>

        <IonCard>
          <IonCardContent>
            <h2>Unsere Geschichte</h2>
            <p>
              Das Boutique Hotel Technikum wurde 2010 mit der Vision gegründet, Reisenden ein einzigartiges
              Hotelerlebnis mitten in Wien zu bieten. Was als kleines Stadthotel mit 12 Zimmern begann,
              hat sich zu einem der beliebtesten Boutique-Hotels der österreichischen Hauptstadt entwickelt.
            </p>
            <p>
              Jedes unserer Zimmer ist individuell gestaltet und verbindet klassische Wiener Eleganz mit
              modernem Komfort. Unser engagiertes Team sorgt dafür, dass sich jeder Gast wie zu Hause fühlt.
            </p>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <h2>Lage & Anreise</h2>
            <p>
              Wir befinden uns zentral im 1. Bezirk Wiens, nur wenige Gehminuten vom Stephansdom und der
              Ringstraße entfernt. Öffentliche Verkehrsmittel (U1, U3) sind fußläufig erreichbar.
            </p>
            <div class="info-grid">
              <div class="info-item">
                <ion-icon name="location" class="info-icon" />
                <div>
                  <strong>Adresse</strong>
                  <p>Höchstädtplatz 6, 1200 Wien</p>
                </div>
              </div>
              <div class="info-item">
                <ion-icon name="call" class="info-icon" />
                <div>
                  <strong>Telefon</strong>
                  <p>+43 1 333 44 55</p>
                </div>
              </div>
              <div class="info-item">
                <ion-icon name="mail" class="info-icon" />
                <div>
                  <strong>E-Mail</strong>
                  <p>info@hotel-technikum.at</p>
                </div>
              </div>
              <div class="info-item">
                <ion-icon name="time" class="info-icon" />
                <div>
                  <strong>Check-in / Check-out</strong>
                  <p>Check-in ab 14:00 Uhr<br>Check-out bis 12:00 Uhr</p>
                </div>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <h2>Unser Team</h2>
            <p>
              Unser mehrsprachiges Team steht Ihnen rund um die Uhr zur Verfügung. Wir sprechen Deutsch,
              Englisch, Französisch und Spanisch. Ihr Wohlbefinden ist unsere höchste Priorität.
            </p>
          </IonCardContent>
        </IonCard>

        <div class="ion-text-center ion-margin-top">
          <IonButton router-link="/rooms" color="primary">Jetzt Zimmer buchen</IonButton>
          <IonButton router-link="/imprint" fill="outline" color="medium" class="ion-margin-start">
            Impressum
          </IonButton>
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonCard, IonCardContent, IonButton } from '@ionic/vue';
import AppNavbar from '@/components/organisms/AppNavbar.vue';
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
}
.page-title {
  font-size: 2rem;
  color: var(--ion-color-primary);
  margin-bottom: 24px;
}
h2 {
  color: var(--ion-color-primary);
  margin-bottom: 12px;
}
p {
  color: var(--ion-color-medium);
  line-height: 1.7;
  margin-bottom: 12px;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.info-icon {
  font-size: 1.5rem;
  color: var(--ion-color-secondary);
  margin-top: 2px;
  flex-shrink: 0;
}
</style>
