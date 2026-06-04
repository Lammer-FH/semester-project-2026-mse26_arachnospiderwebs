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
            <IonGrid class="ion-no-padding">
              <IonRow>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonIcon :icon="locationOutline" slot="start" />
                    <IonLabel>
                      <h3>Adresse</h3>
                      <p>Höchstädtplatz 6, 1200 Wien</p>
                    </IonLabel>
                  </IonItem>
                </IonCol>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonIcon :icon="callOutline" slot="start" />
                    <IonLabel>
                      <h3>Telefon</h3>
                      <p>+43 1 333 44 55</p>
                    </IonLabel>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonIcon :icon="mailOutline" slot="start" />
                    <IonLabel>
                      <h3>E-Mail</h3>
                      <p>info@hotel-technikum.at</p>
                    </IonLabel>
                  </IonItem>
                </IonCol>
                <IonCol size="12" size-md="6">
                  <IonItem>
                    <IonIcon :icon="timeOutline" slot="start" />
                    <IonLabel>
                      <h3>Check-in / Check-out</h3>
                      <p>Check-in ab 14:00 Uhr<br>Check-out bis 12:00 Uhr</p>
                    </IonLabel>
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>
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
import { IonPage, IonContent, IonCard, IonCardContent, IonButton, IonGrid, IonRow, IonCol, IonItem, IonIcon, IonLabel } from '@ionic/vue';
import { locationOutline, callOutline, mailOutline, timeOutline } from 'ionicons/icons';
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

</style>
