export interface User {
  id: number;
  email?: string;
  role: 'ROLE_SEEKER' | 'ROLE_RECRUITER' | 'ROLE_ADMIN';
  displayName: string;
  avatarUrl?: string;
  headline?: string;
  phone?: string;
}

export interface Company {
  id: number;
  name: string;
  logoUrl?: string;
  bannerUrl?: string;
  website?: string;
  description?: string;
  industry?: string;
  location?: string;
  size?: string;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  rating?: number;
}

export interface Job {
  id: number;
  companyId: number;
  companyName: string;
  companyLogo?: string;
  companyLocation?: string;
  title: string;
  description: string;
  requirements?: string;
  skills?: string;
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  location?: string;
  workMode: 'REMOTE' | 'HYBRID' | 'ONSITE';
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  category?: string;
  featured: boolean;
  urgent: boolean;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED';
  screeningQuestions?: string[];
  viewCount?: number;
  applicationCount?: number;
  createdAt?: string;
}

export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  seekerId: number;
  seekerName: string;
  seekerHeadline?: string;
  seekerAvatar?: string;
  status: 'NEW' | 'SCREENED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'OFFER_SENT' | 'HIRED' | 'REJECTED';
  appliedAt: string;
  coverNote?: string;
  screeningAnswers?: Record<string, string>;
  recruiterNotes?: string;
  rating?: number;
  resumeUrl?: string;
}

export interface Participant {
  id?: number;        // mapped from userId on the frontend
  userId?: number;    // raw field from backend ParticipantDto
  displayName: string;
  avatarUrl?: string;
  headline?: string;
  companyName?: string;
  role: string;
}

export interface Conversation {
  id: number;
  jobId?: number;
  jobTitle?: string;
  companyName?: string;
  counterpart?: Participant;      // backend field name
  otherParticipant?: Participant; // alias used in templates
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  status: string;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  clientMsgId?: string;
  // Backend sends a nested 'sender' ParticipantDto
  sender?: {
    userId?: number;
    id?: number;
    displayName?: string;
    avatarUrl?: string;
    role?: string;
  };
  // Kept for backwards-compat if the backend changes to flat format
  senderId?: number;
  senderName?: string;
  senderAvatar?: string;
  body: string;
  isContactMasked?: boolean;  // backend field name
  contactMasked?: boolean;    // alias
  attachmentUrl?: string;
  status?: 'SENT' | 'DELIVERED' | 'READ';
  sentAt: string;
}

export interface CallSession {
  id: number;
  channelName: string;
  caller: Participant;
  callee: Participant;
  video: boolean;
  state: 'INITIATING' | 'RINGING' | 'ACCEPTED' | 'REJECTED' | 'BUSY' | 'ENDED' | 'TIMEOUT';
  startedAt?: string;
  endedAt?: string;
  durationSec?: number;
}

export interface GovtExchangeProfile {
  id?: number;
  registrationNumber?: string;
  district: string;
  qualificationLevel: string;
  employmentStatus: string;
  categoryGroup: string;
  enrolledSchemes?: string[];
  registeredAt?: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalSeekers: number;
  totalRecruiters: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingKyc: number;
}
