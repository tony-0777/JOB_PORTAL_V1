package com.jobportal.config;

import com.jobportal.model.*;
import com.jobportal.repository.*;
import com.jobportal.service.ChatService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final GovtExchangeRepository govtExchangeRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            CompanyRepository companyRepository,
            RecruiterProfileRepository recruiterProfileRepository,
            SeekerProfileRepository seekerProfileRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            GovtExchangeRepository govtExchangeRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.seekerProfileRepository = seekerProfileRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.govtExchangeRepository = govtExchangeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        String defaultPass = passwordEncoder.encode("password123");

        // 1. Create Admin
        User admin = new User("admin@jobportal.com", defaultPass, Role.ROLE_ADMIN, "Platform SuperAdmin");
        admin.setHeadline("Portal Administrator");
        admin.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");
        userRepository.save(admin);

        // 2. Create Companies
        Company techCorp = new Company();
        techCorp.setName("TechCorp Innovations");
        techCorp.setLogoUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150");
        techCorp.setDescription("Pioneering enterprise cloud architecture and high-performance digital platforms.");
        techCorp.setIndustry("Technology & Cloud");
        techCorp.setSize("500-1000 employees");
        techCorp.setLocation("Bengaluru, Karnataka");
        techCorp.setWebsite("https://techcorp.example.com");
        techCorp.setKycStatus("VERIFIED");
        techCorp.setRating(4.8);
        techCorp = companyRepository.save(techCorp);

        Company aiLabs = new Company();
        aiLabs.setName("NextGen AI Labs");
        aiLabs.setLogoUrl("https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=150");
        aiLabs.setDescription("Deep-tech generative AI and large-scale autonomous systems for modern business.");
        aiLabs.setIndustry("Artificial Intelligence");
        aiLabs.setSize("50-200 employees");
        aiLabs.setLocation("Hyderabad, Telangana");
        aiLabs.setWebsite("https://nextgenai.example.com");
        aiLabs.setKycStatus("VERIFIED");
        aiLabs.setRating(4.9);
        aiLabs = companyRepository.save(aiLabs);

        Company govtExchange = new Company();
        govtExchange.setName("Gujarat State Employment Exchange (Anubandhan)");
        govtExchange.setLogoUrl("https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150");
        govtExchange.setDescription("Public Employment Services Department, linking skilled youth to public & private sector drives.");
        govtExchange.setIndustry("Government / Public Sector");
        govtExchange.setSize("1000+ employees");
        govtExchange.setLocation("Gandhinagar, Gujarat");
        govtExchange.setWebsite("https://anubandhan.gujarat.gov.in");
        govtExchange.setKycStatus("VERIFIED");
        govtExchange.setRating(4.7);
        govtExchange = companyRepository.save(govtExchange);

        // 3. Create Recruiters
        User rec1 = new User("recruiter@techcorp.com", defaultPass, Role.ROLE_RECRUITER, "Vikram Malhotra");
        rec1.setHeadline("Head of Talent Acquisition at TechCorp");
        rec1.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150");
        rec1 = userRepository.save(rec1);

        RecruiterProfile rp1 = new RecruiterProfile();
        rp1.setUser(rec1);
        rp1.setCompany(techCorp);
        rp1.setDepartment("Engineering Hiring");
        rp1.setDesignation("Director of Talent");
        rp1.setCompanyAdmin(true);
        rp1.setVerified(true);
        recruiterProfileRepository.save(rp1);

        User rec2 = new User("hr@nextgenai.com", defaultPass, Role.ROLE_RECRUITER, "Sneha Sen");
        rec2.setHeadline("Lead People Partner @ NextGen AI");
        rec2.setAvatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150");
        rec2 = userRepository.save(rec2);

        RecruiterProfile rp2 = new RecruiterProfile();
        rp2.setUser(rec2);
        rp2.setCompany(aiLabs);
        rp2.setDepartment("People & Culture");
        rp2.setDesignation("Senior HR Specialist");
        rp2.setCompanyAdmin(true);
        rp2.setVerified(true);
        recruiterProfileRepository.save(rp2);

        // 4. Create Job Seekers
        User seeker1 = new User("seeker@example.com", defaultPass, Role.ROLE_SEEKER, "Alex Sharma");
        seeker1.setHeadline("Senior Full-Stack Engineer | Java, Spring Boot, Angular, Microservices");
        seeker1.setAvatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150");
        seeker1.setPhone("+91 9876543210");
        seeker1 = userRepository.save(seeker1);

        SeekerProfile sp1 = new SeekerProfile();
        sp1.setUser(seeker1);
        sp1.setHeadline("Senior Full-Stack Engineer (Java & Angular)");
        sp1.setBio("Passionate software engineer with 5+ years building distributed cloud applications and high-throughput web portals.");
        sp1.setExperienceYears(5);
        sp1.setSkills("Java, Spring Boot, Angular, TypeScript, PostgreSQL, Redis, Kafka, Docker");
        sp1.setEducationJson("[{\"degree\":\"B.Tech in Computer Science\",\"institution\":\"NIT Trichy\",\"year\":\"2019-2023\"}]");
        sp1.setExperienceJson("[{\"role\":\"Senior Software Engineer\",\"company\":\"Fintech Labs\",\"years\":\"2023-Present\"}]");
        sp1.setCompletenessScore(92);
        sp1.setPrivacyVisibility("PUBLIC");
        sp1.setResumeUrl("https://example.com/resumes/alex_sharma_resume.pdf");
        seekerProfileRepository.save(sp1);

        User seeker2 = new User("priya@example.com", defaultPass, Role.ROLE_SEEKER, "Priya Patel");
        seeker2.setHeadline("Cloud Solutions Architect & DevOps Specialist | Kubernetes, AWS, Go");
        seeker2.setAvatarUrl("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150");
        seeker2.setPhone("+91 9811223344");
        seeker2 = userRepository.save(seeker2);

        SeekerProfile sp2 = new SeekerProfile();
        sp2.setUser(seeker2);
        sp2.setHeadline("Cloud Solutions Architect (AWS & Kubernetes)");
        sp2.setExperienceYears(4);
        sp2.setSkills("AWS, Kubernetes, Terraform, Docker, CI/CD, Python, Linux");
        sp2.setCompletenessScore(88);
        sp2.setPrivacyVisibility("PUBLIC");
        seekerProfileRepository.save(sp2);

        // 5. Create Jobs
        Job job1 = new Job();
        job1.setCompany(techCorp);
        job1.setRecruiterUser(rec1);
        job1.setTitle("Lead Java Full Stack Architect (Spring Boot + Angular)");
        job1.setDescription("We are looking for a hands-on Lead Java Full Stack Architect to spearhead our next-generation enterprise marketplace platform. You will design scalable microservices and architect reactive Angular frontends.");
        job1.setRequirements("- 5+ years experience in Java 17/21, Spring Boot 3\n- Deep proficiency with modern Angular 17/18+\n- Hands-on experience with Kafka, Redis, and PostgreSQL\n- Experience building real-time WebSocket applications");
        job1.setSkills("Java, Spring Boot, Angular, Redis, Kafka, PostgreSQL");
        job1.setExperienceMin(4);
        job1.setExperienceMax(8);
        job1.setSalaryMin(2400000L);
        job1.setSalaryMax(4000000L);
        job1.setSalaryCurrency("INR");
        job1.setLocation("Bengaluru / Remote");
        job1.setWorkMode("REMOTE");
        job1.setJobType("FULL_TIME");
        job1.setCategory("Engineering");
        job1.setFeatured(true);
        job1.setUrgent(true);
        job1.setStatus("ACTIVE");
        job1.setScreeningQuestionsJson("[\"How many years of experience do you have with Spring Boot 3 and Angular?\",\"Have you architected STOMP WebSocket systems in production?\"]");
        job1.setViewCount(340);
        job1.setApplicationCount(12);
        job1 = jobRepository.save(job1);

        Job job2 = new Job();
        job2.setCompany(aiLabs);
        job2.setRecruiterUser(rec2);
        job2.setTitle("Senior Machine Learning & LLM Systems Engineer");
        job2.setDescription("Design, train, and deploy production LLM fine-tuning pipelines and high-throughput vector retrieval architectures.");
        job2.setRequirements("- Strong experience in Python, PyTorch, LangChain, and Vector DBs\n- Experience deploying models to Kubernetes and ONNX runtimes\n- Solid software engineering foundations in Java or C++");
        job2.setSkills("Python, PyTorch, LLMs, Vector DB, Kubernetes, FastAPI");
        job2.setExperienceMin(3);
        job2.setExperienceMax(7);
        job2.setSalaryMin(2800000L);
        job2.setSalaryMax(4500000L);
        job2.setSalaryCurrency("INR");
        job2.setLocation("Hyderabad (Hybrid)");
        job2.setWorkMode("HYBRID");
        job2.setJobType("FULL_TIME");
        job2.setCategory("Data & AI");
        job2.setFeatured(true);
        job2.setUrgent(false);
        job2.setStatus("ACTIVE");
        job2.setScreeningQuestionsJson("[\"Have you deployed fine-tuned LLMs at production scale?\",\"What is your notice period?\"]");
        job2.setViewCount(210);
        job2.setApplicationCount(8);
        job2 = jobRepository.save(job2);

        Job job3 = new Job();
        job3.setCompany(techCorp);
        job3.setRecruiterUser(rec1);
        job3.setTitle("Staff DevOps & Site Reliability Engineer (SRE)");
        job3.setDescription("Own the multi-region Kubernetes infrastructure, observability pipelines, and 99.99% reliability SLA for our core payments backbone.");
        job3.setRequirements("- Expertise with EKS/GKE, Terraform, Istio, Prometheus & Grafana\n- Deep Linux kernel and networking troubleshooting skills\n- Experience with coturn / WebRTC media traversal is a plus");
        job3.setSkills("Kubernetes, Terraform, AWS, Prometheus, Docker, Linux");
        job3.setExperienceMin(5);
        job3.setExperienceMax(10);
        job3.setSalaryMin(3000000L);
        job3.setSalaryMax(4800000L);
        job3.setSalaryCurrency("INR");
        job3.setLocation("Pune / Bengaluru");
        job3.setWorkMode("ONSITE");
        job3.setJobType("FULL_TIME");
        job3.setCategory("Engineering");
        job3.setFeatured(false);
        job3.setUrgent(true);
        job3.setStatus("ACTIVE");
        job3.setViewCount(180);
        job3.setApplicationCount(5);
        job3 = jobRepository.save(job3);

        Job job4 = new Job();
        job4.setCompany(govtExchange);
        job4.setRecruiterUser(rec1);
        job4.setTitle("Govt Employment Exchange: Junior Technical Officer (IT Division)");
        job4.setDescription("Direct recruitment via Gujarat State Employment Exchange (Anubandhan Model). Candidates with valid exchange registration get preference.");
        job4.setRequirements("- Degree in Computer Science or IT\n- Age limit: 21 to 35 years\n- Knowledge of Gujarati & English languages");
        job4.setSkills("Database Management, IT Support, Java, Web Systems");
        job4.setExperienceMin(0);
        job4.setExperienceMax(3);
        job4.setSalaryMin(450000L);
        job4.setSalaryMax(750000L);
        job4.setSalaryCurrency("INR");
        job4.setLocation("Gandhinagar, Gujarat");
        job4.setWorkMode("ONSITE");
        job4.setJobType("FULL_TIME");
        job4.setCategory("Government");
        job4.setFeatured(true);
        job4.setUrgent(false);
        job4.setStatus("ACTIVE");
        job4.setViewCount(520);
        job4.setApplicationCount(28);
        job4 = jobRepository.save(job4);

        // 6. Create ATS Applications
        Application app1 = new Application();
        app1.setJob(job1);
        app1.setSeekerUser(seeker1);
        app1.setStatus("SHORTLISTED"); // Stage in ATS
        app1.setCoverNote("I have built distributed systems with Spring Boot and Angular for 5 years, including STOMP real-time messaging!");
        app1.setScreeningAnswersJson("{\"How many years of experience do you have with Spring Boot 3 and Angular?\":\"5+ years in production enterprise SaaS.\",\"Have you architected STOMP WebSocket systems in production?\":\"Yes, built chat and real-time dashboard systems.\"}");
        app1.setRecruiterNotes("Top candidate. Deep knowledge of Java 21, WebSocket STOMP, and clean architecture.");
        app1.setRating(5);
        app1.setResumeUrl("https://example.com/resumes/alex_sharma_resume.pdf");
        app1 = applicationRepository.save(app1);

        Application app2 = new Application();
        app2.setJob(job3);
        app2.setSeekerUser(seeker2);
        app2.setStatus("INTERVIEW_SCHEDULED");
        app2.setCoverNote("Certified AWS Solutions Architect with hands-on experience tuning Kubernetes and Istio mesh.");
        app2.setRecruiterNotes("Interview slot confirmed for Friday 3:00 PM via in-app WebRTC call.");
        app2.setRating(4);
        app2 = applicationRepository.save(app2);

        // 7. Create Sample Conversation and Masked Messages
        Conversation conv1 = new Conversation();
        conv1.setJob(job1);
        conv1.setApplication(app1);
        conv1.setSeekerUser(seeker1);
        conv1.setRecruiterUser(rec1);
        conv1.setStatus("ACTIVE");
        conv1.setLastMessage("Sounds great! Let's connect over the in-app WebRTC call.");
        conv1.setLastMessageAt(LocalDateTime.now().minusMinutes(10));
        conv1.setSeekerUnreadCount(0);
        conv1.setRecruiterUnreadCount(0);
        conv1 = conversationRepository.save(conv1);

        Message m1 = new Message();
        m1.setConversation(conv1);
        m1.setClientMsgId("msg-101");
        m1.setSenderUser(rec1);
        m1.setBody("Hello Alex! We were extremely impressed by your profile and application for the Lead Java Full Stack Architect role.");
        m1.setStatus("READ");
        m1.setSentAt(LocalDateTime.now().minusHours(2));
        messageRepository.save(m1);

        Message m2 = new Message();
        m2.setConversation(conv1);
        m2.setClientMsgId("msg-102");
        m2.setSenderUser(seeker1);
        m2.setBody("Thank you Vikram! I am very excited about TechCorp's roadmap and microservices architecture.");
        m2.setStatus("READ");
        m2.setSentAt(LocalDateTime.now().minusHours(1));
        messageRepository.save(m2);

        // Message demonstrating contact privacy masking (FR-PV-02)
        Message m3 = new Message();
        m3.setConversation(conv1);
        m3.setClientMsgId("msg-103");
        m3.setSenderUser(seeker1);
        m3.setBody("You can also reach me at [contact hidden] or call on [contact hidden] if needed.");
        m3.setContactMasked(true);
        m3.setStatus("READ");
        m3.setSentAt(LocalDateTime.now().minusMinutes(30));
        messageRepository.save(m3);

        Message m4 = new Message();
        m4.setConversation(conv1);
        m4.setClientMsgId("msg-104");
        m4.setSenderUser(rec1);
        m4.setBody("Sounds great! Let's connect over the in-app WebRTC call.");
        m4.setStatus("SENT");
        m4.setSentAt(LocalDateTime.now().minusMinutes(10));
        messageRepository.save(m4);

        // 8. Register Seeker 1 in Government Employment Exchange
        GovtExchangeProfile gep = new GovtExchangeProfile();
        gep.setSeekerUser(seeker1);
        gep.setRegistrationNumber("GJ-EXCH-2026-89412");
        gep.setDistrict("Ahmedabad");
        gep.setQualificationLevel("Graduate (B.Tech Computer Science)");
        gep.setEmploymentStatus("Employed");
        gep.setCategoryGroup("General");
        gep.setEnrolledSchemesJson("[\"Mukhyamantri Yuva Swavalamban Yojana (MYSY)\",\"Skill India Digital - IT Apprenticeship\"]");
        govtExchangeRepository.save(gep);

        sp1.setExchangeRegistrationNo("GJ-EXCH-2026-89412");
        seekerProfileRepository.save(sp1);
    }
}
