import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminSiteComponent } from './admin-site/admin-site.component';
import { AssistantPageComponent } from './assistant-page/assistant-page.component';
import { PacientPageComponent } from './pacient-page/pacient-page.component';
import { WebsocketComponent } from './websocket/websocket.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { LogInPageComponent } from './log-in-page/log-in-page.component';
import { DataTablesModule } from 'angular-datatables';
import { HighchartsChartModule } from 'highcharts-angular';
import {HttpClientModule} from "@angular/common/http";
import { ContactComponent } from './contact/contact.component';
import { CreateSpecialUserUIComponent } from './create-special-user-ui/create-special-user-ui.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { AppInitService } from 'src/app-init';
import { RuntimeConfigLoaderModule } from 'runtime-config-loader';
import { CreateOrUpdatePresciptionComponent } from './create-or-update-presciption/create-or-update-presciption.component';
import { CreateOrUpdateNoteComponent } from './create-or-update-note/create-or-update-note.component';
import { ChangePasswordComponent } from './change-password-component/change-password-component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AppComponent,
    AdminSiteComponent,
    AssistantPageComponent,
    PacientPageComponent,
    WebsocketComponent,
    SignInPageComponent,
    LogInPageComponent,
    ContactComponent,
    CreateSpecialUserUIComponent,
    NavbarComponent,
    CreateOrUpdatePresciptionComponent,
    CreateOrUpdateNoteComponent,
    ChangePasswordComponent,
   
  
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DataTablesModule,
    HighchartsChartModule,
    NgxPaginationModule,
    RuntimeConfigLoaderModule.forRoot(
      { configUrl: '../assets/app-config.json' }
    ),
  
  ],

  providers: [ WebsocketComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
