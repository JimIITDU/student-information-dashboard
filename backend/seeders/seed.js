const { Student, Mentor, Scholarship, Meeting } = require('../models/index');
const { sequelize } = require('../models/index');

const seed = async () => {
  try {
    console.log('Seeding database...');

    // Clear existing data
    await Meeting.destroy({ where: {} });
    await Scholarship.destroy({ where: {} });
    await Student.destroy({ where: {} });
    await Mentor.destroy({ where: {} });

    // Create Mentors
    const mentors = await Mentor.bulkCreate([
      {
        name: 'Dr. Sarah Johnson',
        title: 'Senior Software Engineer',
        company: 'Google',
        expertise: ['Web Development', 'Machine Learning', 'Career Coaching'],
        email: 'sarah.johnson@google.com',
        bio: '10 years of experience in software engineering and mentoring students.',
        maxMentees: 4
      },
      {
        name: 'Mr. James Williams',
        title: 'Product Manager',
        company: 'Microsoft',
        expertise: ['Product Management', 'Agile', 'Leadership'],
        email: 'james.williams@microsoft.com',
        bio: 'Passionate about helping students transition into tech careers.',
        maxMentees: 3
      },
      {
        name: 'Ms. Priya Patel',
        title: 'Data Scientist',
        company: 'Amazon',
        expertise: ['Data Science', 'Python', 'Statistics'],
        email: 'priya.patel@amazon.com',
        bio: 'Helping students navigate the world of data and analytics.',
        maxMentees: 3
      },
      {
        name: 'Dr. Michael Chen',
        title: 'Professor of Computer Science',
        company: 'MIT',
        expertise: ['Algorithms', 'Research', 'Academic Writing'],
        email: 'michael.chen@mit.edu',
        bio: 'Academic mentor focused on research and graduate school preparation.',
        maxMentees: 5
      },
      {
        name: 'Ms. Fatima Al-Hassan',
        title: 'UX Designer',
        company: 'Apple',
        expertise: ['UI/UX Design', 'Figma', 'User Research'],
        email: 'fatima.alhassan@apple.com',
        bio: 'Helping students build beautiful and accessible products.',
        maxMentees: 3
      }
    ]);

    console.log('Mentors created ✓');

    // Create Students
    const students = await Student.bulkCreate([
      {
        firstName: 'Ahmed',
        lastName: 'Rahman',
        email: 'ahmed.rahman@university.edu',
        academicYear: 'Junior',
        major: 'Computer Science',
        gpa: 3.7,
        enrollmentStatus: 'Full-time',
        creditsCompleted: 75,
        creditsRequired: 120,
        expectedGraduation: '2027-05-15',
        firstGeneration: true,
        lowIncome: true,
        underrepresentedMinority: false,
        mentorId: mentors[0].id
      },
      {
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria.garcia@university.edu',
        academicYear: 'Sophomore',
        major: 'Business Administration',
        gpa: 3.4,
        enrollmentStatus: 'Full-time',
        creditsCompleted: 45,
        creditsRequired: 120,
        expectedGraduation: '2028-05-15',
        firstGeneration: true,
        lowIncome: true,
        underrepresentedMinority: true,
        mentorId: mentors[1].id
      },
      {
        firstName: 'James',
        lastName: 'Okafor',
        email: 'james.okafor@university.edu',
        academicYear: 'Senior',
        major: 'Electrical Engineering',
        gpa: 3.9,
        enrollmentStatus: 'Full-time',
        creditsCompleted: 105,
        creditsRequired: 120,
        expectedGraduation: '2026-05-15',
        firstGeneration: false,
        lowIncome: true,
        underrepresentedMinority: true,
        mentorId: mentors[2].id
      },
      {
        firstName: 'Aisha',
        lastName: 'Khan',
        email: 'aisha.khan@university.edu',
        academicYear: 'Freshman',
        major: 'Pre-Medicine',
        gpa: 3.8,
        enrollmentStatus: 'Full-time',
        creditsCompleted: 15,
        creditsRequired: 120,
        expectedGraduation: '2029-05-15',
        firstGeneration: true,
        lowIncome: false,
        underrepresentedMinority: true,
        mentorId: mentors[3].id
      },
      {
        firstName: 'Carlos',
        lastName: 'Martinez',
        email: 'carlos.martinez@university.edu',
        academicYear: 'Junior',
        major: 'Psychology',
        gpa: 3.2,
        enrollmentStatus: 'Part-time',
        creditsCompleted: 60,
        creditsRequired: 120,
        expectedGraduation: '2028-12-15',
        firstGeneration: true,
        lowIncome: true,
        underrepresentedMinority: true,
        mentorId: mentors[4].id
      },
      {
        firstName: 'Emily',
        lastName: 'Thompson',
        email: 'emily.thompson@university.edu',
        academicYear: 'Senior',
        major: 'Computer Science',
        gpa: 3.6,
        enrollmentStatus: 'Full-time',
        creditsCompleted: 100,
        creditsRequired: 120,
        expectedGraduation: '2026-05-15',
        firstGeneration: false,
        lowIncome: false,
        underrepresentedMinority: false,
        mentorId: mentors[0].id
      },
      {
        firstName: 'David',
        lastName: 'Nguyen',
        email: 'david.nguyen@university.edu',
        academicYear: 'Sophomore',
        major: 'Mathematics',
        gpa: 3.5,
        enrollmentStatus: 'Full-time',
        creditsCompleted: 40,
        creditsRequired: 120,
        expectedGraduation: '2028-05-15',
        firstGeneration: true,
        lowIncome: true,
        underrepresentedMinority: false,
        mentorId: mentors[2].id
      },
      {
        firstName: 'Sofia',
        lastName: 'Rossi',
        email: 'sofia.rossi@university.edu',
        academicYear: 'Junior',
        major: 'Architecture',
        gpa: 3.3,
        enrollmentStatus: 'Full-time',
        creditsCompleted: 70,
        creditsRequired: 120,
        expectedGraduation: '2027-05-15',
        firstGeneration: false,
        lowIncome: true,
        underrepresentedMinority: false,
        mentorId: mentors[4].id
      },
      {
        firstName: 'Mohammed',
        lastName: 'Ali',
        email: 'mohammed.ali@university.edu',
        academicYear: 'Freshman',
        major: 'Economics',
        gpa: 3.1,
        enrollmentStatus: 'Full-time',
        creditsCompleted: 20,
        creditsRequired: 120,
        expectedGraduation: '2029-05-15',
        firstGeneration: true,
        lowIncome: true,
        underrepresentedMinority: true,
        mentorId: mentors[1].id
      },
      {
        firstName: 'Lisa',
        lastName: 'Park',
        email: 'lisa.park@university.edu',
        academicYear: 'Senior',
        major: 'Biology',
        gpa: 3.8,
        enrollmentStatus: 'Full-time',
        creditsCompleted: 110,
        creditsRequired: 120,
        expectedGraduation: '2026-05-15',
        firstGeneration: false,
        lowIncome: false,
        underrepresentedMinority: false,
        mentorId: mentors[3].id
      },
      {
        firstName: 'Kevin',
        lastName: 'Brown',
        email: 'kevin.brown@university.edu',
        academicYear: 'Junior',
        major: 'Political Science',
        gpa: 3.0,
        enrollmentStatus: 'Part-time',
        creditsCompleted: 65,
        creditsRequired: 120,
        expectedGraduation: '2028-05-15',
        firstGeneration: true,
        lowIncome: true,
        underrepresentedMinority: true,
        mentorId: mentors[1].id
      },
      {
        firstName: 'Amara',
        lastName: 'Diallo',
        email: 'amara.diallo@university.edu',
        academicYear: 'Sophomore',
        major: 'Nursing',
        gpa: 3.6,
        enrollmentStatus: 'Full-time',
        creditsCompleted: 50,
        creditsRequired: 120,
        expectedGraduation: '2028-05-15',
        firstGeneration: true,
        lowIncome: true,
        underrepresentedMinority: true,
        mentorId: mentors[4].id
      },
      {
        firstName: 'Ryan',
        lastName: 'O\'Connor',
        email: 'ryan.oconnor@university.edu',
        academicYear: 'Freshman',
        major: 'Physics',
        gpa: 3.4,
        enrollmentStatus: 'Full-time',
        creditsCompleted: 18,
        creditsRequired: 120,
        expectedGraduation: '2029-05-15',
        firstGeneration: false,
        lowIncome: false,
        underrepresentedMinority: false,
        mentorId: mentors[3].id
      },
      {
        firstName: 'Zara',
        lastName: 'Ahmed',
        email: 'zara.ahmed@university.edu',
        academicYear: 'Senior',
        major: 'Computer Science',
        gpa: 3.9,
        enrollmentStatus: 'Full-time',
        creditsCompleted: 115,
        creditsRequired: 120,
        expectedGraduation: '2026-05-15',
        firstGeneration: true,
        lowIncome: false,
        underrepresentedMinority: true,
        mentorId: mentors[0].id
      },
      {
        firstName: 'Marcus',
        lastName: 'Johnson',
        email: 'marcus.johnson@university.edu',
        academicYear: 'Junior',
        major: 'Finance',
        gpa: 3.3,
        enrollmentStatus: 'Full-time',
        creditsCompleted: 72,
        creditsRequired: 120,
        expectedGraduation: '2027-05-15',
        firstGeneration: true,
        lowIncome: true,
        underrepresentedMinority: true,
        mentorId: mentors[2].id
      }
    ]);

    console.log('Students created ✓');

    // Create Scholarships
    await Scholarship.bulkCreate([
      {
        studentId: students[0].id,
        name: 'Merit Excellence Award',
        provider: 'National Education Foundation',
        amount: 5000,
        currency: 'USD',
        status: 'Applied',
        deadline: '2026-12-01',
        requirements: ['3.5+ GPA', 'Essay', 'Two References'],
        essayRequired: true,
        essaySubmitted: true,
        notes: 'Strong candidate',
        dateApplied: new Date()
      },
      {
        studentId: students[0].id,
        name: 'STEM Future Leaders',
        provider: 'Tech Corp Foundation',
        amount: 8000,
        currency: 'USD',
        status: 'Interview',
        deadline: '2026-11-15',
        requirements: ['CS Major', 'Project Portfolio', 'Interview'],
        essayRequired: false,
        notes: 'Interview scheduled for next month',
        dateApplied: new Date()
      },
      {
        studentId: students[1].id,
        name: 'First Generation Scholars',
        provider: 'Community Foundation',
        amount: 3000,
        currency: 'USD',
        status: 'Awarded',
        deadline: '2026-10-01',
        requirements: ['First Generation', 'Financial Need'],
        essayRequired: true,
        essaySubmitted: true,
        notes: 'Awarded! Funds disbursed',
        dateApplied: new Date()
      },
      {
        studentId: students[1].id,
        name: 'Women in Business',
        provider: 'Business Leaders Association',
        amount: 4000,
        currency: 'USD',
        status: 'Researching',
        deadline: '2027-01-15',
        requirements: ['Female', 'Business Major', '3.0+ GPA'],
        essayRequired: true,
        notes: 'Need to start essay'
      },
      {
        studentId: students[2].id,
        name: 'Engineering Excellence',
        provider: 'IEEE Foundation',
        amount: 10000,
        currency: 'USD',
        status: 'Applied',
        deadline: '2026-11-30',
        requirements: ['Engineering Major', '3.7+ GPA', 'Research Experience'],
        essayRequired: true,
        essaySubmitted: true,
        notes: 'Very competitive scholarship',
        dateApplied: new Date()
      },
      {
        studentId: students[2].id,
        name: 'Minority in STEM',
        provider: 'Diversity in Tech Foundation',
        amount: 6000,
        currency: 'USD',
        status: 'Awarded',
        deadline: '2026-09-01',
        requirements: ['Underrepresented Minority', 'STEM Major'],
        essayRequired: true,
        essaySubmitted: true,
        notes: 'Awarded!',
        dateApplied: new Date()
      },
      {
        studentId: students[3].id,
        name: 'Pre-Med Scholarship',
        provider: 'Medical Association',
        amount: 7000,
        currency: 'USD',
        status: 'Applied',
        deadline: '2026-12-15',
        requirements: ['Pre-Med Major', '3.5+ GPA', 'Volunteer Experience'],
        essayRequired: true,
        essaySubmitted: false,
        notes: 'Need to submit essay',
        dateApplied: new Date()
      },
      {
        studentId: students[4].id,
        name: 'Community Service Award',
        provider: 'Local Community Foundation',
        amount: 2000,
        currency: 'USD',
        status: 'Rejected',
        deadline: '2026-08-01',
        requirements: ['Community Service', 'Essay'],
        essayRequired: true,
        essaySubmitted: true,
        notes: 'Unfortunately rejected',
        dateApplied: new Date()
      },
      {
        studentId: students[5].id,
        name: 'Women in Tech',
        provider: 'Google Foundation',
        amount: 10000,
        currency: 'USD',
        status: 'Interview',
        deadline: '2026-11-01',
        requirements: ['Female', 'CS Major', 'Leadership'],
        essayRequired: true,
        essaySubmitted: true,
        notes: 'Final round interview',
        dateApplied: new Date()
      },
      {
        studentId: students[6].id,
        name: 'Math Excellence Award',
        provider: 'Mathematics Foundation',
        amount: 3500,
        currency: 'USD',
        status: 'Applied',
        deadline: '2026-12-01',
        requirements: ['Math Major', '3.5+ GPA'],
        essayRequired: false,
        notes: 'Applied online',
        dateApplied: new Date()
      },
      {
        studentId: students[7].id,
        name: 'Arts and Architecture Grant',
        provider: 'Design Foundation',
        amount: 4500,
        currency: 'USD',
        status: 'Researching',
        deadline: '2027-02-01',
        requirements: ['Architecture Major', 'Portfolio'],
        essayRequired: true,
        notes: 'Need to prepare portfolio'
      },
      {
        studentId: students[8].id,
        name: 'International Student Award',
        provider: 'Global Education Fund',
        amount: 5000,
        currency: 'USD',
        status: 'Applied',
        deadline: '2026-11-15',
        requirements: ['International Student', 'Financial Need'],
        essayRequired: true,
        essaySubmitted: true,
        notes: 'Applied last week',
        dateApplied: new Date()
      },
      {
        studentId: students[9].id,
        name: 'Pre-Med Research Grant',
        provider: 'NIH Foundation',
        amount: 8000,
        currency: 'USD',
        status: 'Awarded',
        deadline: '2026-09-15',
        requirements: ['Biology Major', 'Research Experience', '3.7+ GPA'],
        essayRequired: true,
        essaySubmitted: true,
        notes: 'Awarded for research project',
        dateApplied: new Date()
      },
      {
        studentId: students[10].id,
        name: 'Political Leadership Award',
        provider: 'Civic Foundation',
        amount: 2500,
        currency: 'USD',
        status: 'Researching',
        deadline: '2027-01-01',
        requirements: ['Political Science Major', 'Community Involvement'],
        essayRequired: true,
        notes: 'Gathering requirements'
      },
      {
        studentId: students[11].id,
        name: 'Healthcare Heroes Scholarship',
        provider: 'Hospital Association',
        amount: 6000,
        currency: 'USD',
        status: 'Applied',
        deadline: '2026-12-01',
        requirements: ['Nursing Major', 'Clinical Experience'],
        essayRequired: true,
        essaySubmitted: true,
        notes: 'Applied with strong references',
        dateApplied: new Date()
      },
      {
        studentId: students[12].id,
        name: 'Physics Innovation Grant',
        provider: 'Science Foundation',
        amount: 4000,
        currency: 'USD',
        status: 'Researching',
        deadline: '2027-03-01',
        requirements: ['Physics Major', 'Research Proposal'],
        essayRequired: true,
        notes: 'Working on research proposal'
      },
      {
        studentId: students[13].id,
        name: 'Diversity in CS Award',
        provider: 'ACM Foundation',
        amount: 7000,
        currency: 'USD',
        status: 'Interview',
        deadline: '2026-10-15',
        requirements: ['CS Major', 'Underrepresented Minority', '3.7+ GPA'],
        essayRequired: true,
        essaySubmitted: true,
        notes: 'Second round interview',
        dateApplied: new Date()
      },
      {
        studentId: students[14].id,
        name: 'Finance Leaders Scholarship',
        provider: 'Wall Street Foundation',
        amount: 9000,
        currency: 'USD',
        status: 'Applied',
        deadline: '2026-11-30',
        requirements: ['Finance Major', 'Internship Experience', '3.0+ GPA'],
        essayRequired: true,
        essaySubmitted: true,
        notes: 'Applied with internship experience',
        dateApplied: new Date()
      },
      {
        studentId: students[14].id,
        name: 'Low Income Achievement Award',
        provider: 'Equal Opportunity Foundation',
        amount: 3000,
        currency: 'USD',
        status: 'Awarded',
        deadline: '2026-08-15',
        requirements: ['Financial Need', 'First Generation'],
        essayRequired: false,
        notes: 'Awarded based on financial need',
        dateApplied: new Date()
      },
      {
        studentId: students[0].id,
        name: 'Technology Innovation Prize',
        provider: 'Silicon Valley Fund',
        amount: 12000,
        currency: 'USD',
        status: 'Researching',
        deadline: '2027-02-15',
        requirements: ['CS Major', 'Innovation Project', '3.5+ GPA'],
        essayRequired: true,
        notes: 'High value scholarship worth pursuing'
      }
    ]);

    console.log('Scholarships created ✓');

    // Create Meetings
    await Meeting.bulkCreate([
      {
        studentId: students[0].id,
        mentorId: mentors[0].id,
        date: new Date('2026-03-15T10:00:00'),
        duration: 60,
        notes: 'Discussed career goals and internship opportunities at Google.',
        actionItems: ['Update LinkedIn profile', 'Apply to Google internship', 'Practice LeetCode'],
        status: 'Completed'
      },
      {
        studentId: students[0].id,
        mentorId: mentors[0].id,
        date: new Date('2026-04-15T10:00:00'),
        duration: 45,
        notes: 'Follow up on internship applications.',
        actionItems: ['Send thank you emails', 'Prepare for technical interview'],
        status: 'Scheduled'
      },
      {
        studentId: students[1].id,
        mentorId: mentors[1].id,
        date: new Date('2026-03-20T14:00:00'),
        duration: 60,
        notes: 'Discussed product management career path.',
        actionItems: ['Read Inspired by Marty Cagan', 'Join PM club on campus'],
        status: 'Completed'
      },
      {
        studentId: students[2].id,
        mentorId: mentors[2].id,
        date: new Date('2026-03-25T11:00:00'),
        duration: 90,
        notes: 'Reviewed data science projects and portfolio.',
        actionItems: ['Complete Kaggle competition', 'Add projects to GitHub'],
        status: 'Completed'
      },
      {
        studentId: students[3].id,
        mentorId: mentors[3].id,
        date: new Date('2026-04-10T09:00:00'),
        duration: 60,
        notes: 'Discussed medical school application process.',
        actionItems: ['Study for MCAT', 'Get research experience', 'Shadow a doctor'],
        status: 'Scheduled'
      }
    ]);

    console.log('Meetings created ✓');
    console.log('Database seeded successfully! 🎉');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();