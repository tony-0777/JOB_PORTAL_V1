import { Routes } from '@angular/router';
import { authGuard, seekerGuard, recruiterGuard, adminGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/home/home.component';
import { JobSearchComponent } from './features/jobs/job-search.component';
import { JobDetailComponent } from './features/jobs/job-detail.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { SeekerDashboardComponent } from './features/seeker/seeker-dashboard.component';
import { SeekerProfileComponent } from './features/seeker/seeker-profile.component';
import { RecruiterDashboardComponent } from './features/recruiter/recruiter-dashboard.component';
import { AtsPipelineComponent } from './features/recruiter/ats-pipeline.component';
import { PostJobComponent } from './features/recruiter/post-job.component';
import { ResumeDbComponent } from './features/recruiter/resume-db.component';
import { ChatComponent } from './features/chat/chat.component';
import { GovExchangeComponent } from './features/exchange/gov-exchange.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'jobs', component: JobSearchComponent },
  { path: 'jobs/:id', component: JobDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'exchange', component: GovExchangeComponent },

  // Seeker Routes
  { path: 'seeker/dashboard', component: SeekerDashboardComponent, canActivate: [authGuard, seekerGuard] },
  { path: 'seeker/profile', component: SeekerProfileComponent, canActivate: [authGuard, seekerGuard] },

  // Recruiter Routes
  { path: 'recruiter/dashboard', component: RecruiterDashboardComponent, canActivate: [authGuard, recruiterGuard] },
  { path: 'recruiter/ats', component: AtsPipelineComponent, canActivate: [authGuard, recruiterGuard] },
  { path: 'recruiter/post-job', component: PostJobComponent, canActivate: [authGuard, recruiterGuard] },
  { path: 'recruiter/candidates', component: ResumeDbComponent, canActivate: [authGuard, recruiterGuard] },

  // Real-time Chat & Calling
  { path: 'chat', component: ChatComponent, canActivate: [authGuard] },

  // Admin Routes
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },

  { path: '**', redirectTo: '' }
];
