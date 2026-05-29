<template>
  <IonPage>
    <AppNavbar :show-menu="false" />
    <IonContent class="ion-padding">
      <div class="container">
        <h1 class="page-title">Impressum</h1>

        <IonCard>
          <IonCardContent>
            <h2>Angaben gemäß § 5 ECG</h2>
            <p><strong>Boutique Hotel Technikum GmbH</strong></p>
            <p>Höchstädtplatz 6<br />1200 Wien<br />Österreich</p>
            <p>
              <strong>Telefon:</strong> +43 1 333 44 55<br />
              <strong>E-Mail:</strong> info@hotel-technikum.at<br />
              <strong>Website:</strong> www.hotel-technikum.at
            </p>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <h2>Unternehmensangaben</h2>
            <p>
              <strong>Rechtsform:</strong> Gesellschaft mit beschränkter Haftung (GmbH)<br />
              <strong>Firmenbuchnummer:</strong> FN 123456 a<br />
              <strong>Firmenbuchgericht:</strong> Handelsgericht Wien<br />
              <strong>UID-Nummer:</strong> ATU12345678<br />
              <strong>Mitglied der WKO</strong>
            </p>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <h2>Haftungsausschluss</h2>
            <p>
              Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt.
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir
              jedoch keine Gewähr übernehmen.
            </p>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <h2>Urheberrecht</h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
              unterliegen dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung,
              Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes
              bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </IonCardContent>
        </IonCard>

        <div class="ion-text-center ion-margin-top">
          <IonButton router-link="/home" fill="outline" color="primary">Zurück zur Startseite</IonButton>
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
  margin-bottom: 8px;
}
</style>
