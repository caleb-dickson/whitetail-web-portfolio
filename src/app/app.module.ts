import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { environment } from '../environments/environment';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromAppStore from './app-store/app.reducer'
import { AuthEffects } from './auth/auth-store/auth.effects';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { PERSISTENCE } from '@angular/fire/compat/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { HeaderComponent } from './head-foot/header.component';
import { FooterComponent } from './head-foot/footer/footer.component';
import { LandingComponent } from './landing/landing.component';
import { SiteInfoComponent } from './landing/site-info/site-info.component';
import { ContactComponent } from './contact/contact.component';
import { FeedbackComponent } from './contact/feedback/feedback.component';
import { ContactSuccessComponent } from './contact/contact-success/contact-success.component';
import { ErrorComponent } from './error/error.component';


import { AppRoutingModule } from './app-routing.module';
import { ProjectsModule } from './projects/projects.module';
import { MaterialModule } from './material.module';
import { AboutModule } from './about/about.module';
import { BlogModule } from './blog/blog.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    HeaderComponent,
    FooterComponent,
    SiteInfoComponent,
    ErrorComponent,
    ContactComponent,
    FeedbackComponent,
    ContactSuccessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AuthModule,
    ProjectsModule,
    MaterialModule,
    AboutModule,
    BlogModule,
    StoreModule.forRoot(fromAppStore.appReducer),
    EffectsModule.forRoot([AuthEffects]),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    { provide: PERSISTENCE, useValue: 'session' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
