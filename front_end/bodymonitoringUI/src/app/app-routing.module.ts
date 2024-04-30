import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSiteComponent } from './admin-site/admin-site.component';
import { PacientPageComponent } from './pacient-page/pacient-page.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { LogInPageComponent } from './log-in-page/log-in-page.component';
import { AssistantPageComponent } from './assistant-page/assistant-page.component';
import { CreateSpecialUserUIComponent } from './create-special-user-ui/create-special-user-ui.component';
import { ContactComponent } from './contact/contact.component';
import { CreateOrUpdatePresciptionComponent } from './create-or-update-presciption/create-or-update-presciption.component';
import { CreateOrUpdateNoteComponent } from './create-or-update-note/create-or-update-note.component';
import { ChangePasswordComponent } from './change-password-component/change-password-component';

const routes: Routes = [
  { path: 'admin/:id', component: AdminSiteComponent },
  { path: 'patient/:id', component: PacientPageComponent },
  { path: 'signIn', component: SignInPageComponent },
  { path: 'logIn', component: LogInPageComponent },
  { path: 'assistant/:id', component: AssistantPageComponent },
  { path: 'createOtherUser', component: CreateSpecialUserUIComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'updateprescription/:id/:userId', component: CreateOrUpdatePresciptionComponent },
  { path: 'createprescription/:id', component: CreateOrUpdatePresciptionComponent },
  { path: 'updatenote/:id/:userId', component: CreateOrUpdateNoteComponent },
  { path: 'createnote/:id', component: CreateOrUpdateNoteComponent },
  { path: 'changePassword/:id', component: ChangePasswordComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
