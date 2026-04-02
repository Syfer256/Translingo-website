# TransLingo - Translation Freelancing Platform

A comprehensive marketplace platform specialized for translation services, featuring three user roles (employers, freelancers, administrators), job management, escrow payment system, messaging, and review functionality.

## 🚀 Features

### For Employers
- **Post Translation Jobs** - Create detailed job listings with language pairs, word count, deadlines, and budgets
- **Review Proposals** - Receive and evaluate proposals from qualified translators
- **Secure Payments** - Funds held in escrow until work is approved
- **Project Management** - Track job status from posting to completion
- **Direct Messaging** - Communicate with translators throughout the project
- **Leave Reviews** - Rate and review completed work

### For Freelancers
- **Browse Jobs** - Search and filter translation opportunities by language, specialization, and budget
- **Submit Proposals** - Pitch your services with custom cover letters and pricing
- **Portfolio Management** - Showcase languages, specializations, and certifications
- **Earnings Tracking** - Monitor active projects and total earnings
- **Rating System** - Build reputation through client reviews
- **Secure Payments** - Guaranteed payment upon job completion

### For Administrators
- **Platform Analytics** - Monitor users, jobs, transactions, and revenue
- **User Management** - Verify, suspend, or activate user accounts
- **Transaction Monitoring** - Oversee all payment activities
- **Dispute Resolution** - Handle conflicts between employers and freelancers
- **Content Moderation** - Remove inappropriate content or users

## 📋 Technical Stack

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- **Data Storage**: localStorage (for demo purposes)
- **Design**: Modern, responsive design with CSS Grid and Flexbox
- **Fonts**: Inter (body), Outfit (headings) from Google Fonts

## 🎨 Design Features

- **Modern UI**: Clean, professional interface with gradient accents
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Color Scheme**: Professional blue/purple theme with status-based colors
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: Semantic HTML and proper contrast ratios

## 📁 Project Structure

```
translation-platform/
├── index.html                    # Landing page
├── auth.html                     # Login/Registration
├── employer-dashboard.html       # Employer dashboard
├── freelancer-dashboard.html     # Freelancer dashboard
├── admin-dashboard.html          # Admin panel (to be completed)
├── jobs.html                     # Job browsing (to be completed)
├── job-detail.html              # Individual job details (to be completed)
├── post-job.html                # Job posting form (to be completed)
├── profile.html                 # User profiles (to be completed)
├── messages.html                # Messaging interface (to be completed)
├── transactions.html            # Transaction history (to be completed)
├── css/
│   ├── main.css                 # Base styles and utilities
│   ├── components.css           # Reusable UI components
│   └── pages.css                # Page-specific styles
└── js/
    ├── config.js                # Platform configuration
    ├── storage.js               # localStorage wrapper
    ├── utils.js                 # Utility functions
    ├── auth.js                  # Authentication system
    ├── ui.js                    # UI helpers
    ├── jobs.js                  # Job management
    ├── proposals.js             # Proposal system
    ├── payments.js              # Escrow payment system
    ├── messaging.js             # Messaging functionality
    ├── notifications.js         # Notification system
    ├── reviews.js               # Review and rating system
    ├── files.js                 # File management
    ├── admin.js                 # Admin functions
    └── sample-data.js           # Demo data
```

## 🚦 Getting Started

### Running the Application

1. **Clone or download** the project files
2. **Open `index.html`** in a modern web browser (Chrome, Firefox, Safari, Edge)
3. **No build process required** - it's pure HTML, CSS, and JavaScript!

### Demo Accounts

The platform comes with pre-loaded demo data. Use these credentials to explore different user roles:

- **Employer**: `employer@test.com` / `Test1234`
- **Freelancer**: `freelancer@test.com` / `Test1234`
- **Admin**: `admin@test.com` / `Test1234`

### Creating New Accounts

1. Click "Get Started" or "Sign In" on the landing page
2. Switch to the "Register" tab
3. Select your role (Hire Translators or Work as Translator)
4. Fill in your details
5. Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number

## 💡 Key Workflows

### Employer Workflow

1. **Register** as an employer
2. **Post a job** with translation requirements
3. **Review proposals** from freelancers
4. **Accept a proposal** - payment goes into escrow
5. **Receive the translation** and review the work
6. **Approve and release payment** to the freelancer
7. **Leave a review** for the translator

### Freelancer Workflow

1. **Register** as a freelancer with your languages and specializations
2. **Browse available jobs** using filters
3. **Submit a proposal** with your cover letter and price
4. **Get hired** when employer accepts your proposal
5. **Complete the translation** and upload the file
6. **Receive payment** after employer approval
7. **Build your reputation** through ratings and reviews

### Admin Workflow

1. **Login** as admin
2. **Monitor platform statistics** (users, jobs, revenue)
3. **Manage users** (verify, suspend, activate)
4. **Review transactions** and handle disputes
5. **Moderate content** and ensure platform quality

## 🔐 Security Features

- **Password Hashing**: Passwords are hashed before storage (simulated - use bcrypt in production)
- **Role-Based Access Control**: Users can only access features appropriate to their role
- **Input Validation**: All forms validate data before submission
- **XSS Protection**: User input is sanitized before display
- **Escrow System**: Payments are held securely until work is approved

## 💳 Payment System

The platform uses an **escrow payment system**:

1. **Employer deposits funds** when accepting a proposal
2. **Platform holds funds** in escrow (status: HELD)
3. **Freelancer completes work** and submits translation
4. **Employer reviews and approves** the work
5. **Platform releases payment** to freelancer minus 15% commission
6. **Both parties receive notifications** at each step

### Commission Structure
- Platform fee: **15%** of transaction amount
- Example: $100 job = $15 platform fee + $85 to freelancer

## 📊 Data Models

### User
- Basic info (name, email, role)
- Role-specific fields (languages, specializations, company info)
- Stats (completed jobs, earnings, rating)

### Job
- Details (title, description, languages, word count)
- Requirements (deadline, budget, urgency, specialization)
- Status (open, in progress, completed, disputed)

### Proposal
- Freelancer info and quoted price
- Cover letter and delivery time
- Status (pending, accepted, rejected)

### Transaction
- Job and proposal references
- Amount breakdown (total, platform fee, freelancer amount)
- Payment status (pending, held, released, refunded)

### Message
- Sender and recipient
- Content and timestamp
- Read status

### Review
- Rating (1-5 stars)
- Written comment
- Job reference

## 🎯 Future Enhancements

For a production-ready version, consider:

### Backend
- Real server (Node.js/Express, Python/Django, etc.)
- Database (PostgreSQL, MongoDB)
- RESTful API or GraphQL
- WebSocket for real-time messaging

### Features
- Real file upload/download with cloud storage (AWS S3, etc.)
- Payment gateway integration (Stripe, PayPal)
- Email notifications
- Advanced search with Elasticsearch
- Multi-language support (i18n)
- Video call integration for interpretation
- Mobile apps (React Native, Flutter)

### Security
- HTTPS/SSL certificates
- OAuth authentication
- Two-factor authentication
- CSRF protection
- Rate limiting
- Data encryption

### Performance
- CDN for static assets
- Image optimization
- Lazy loading
- Caching strategies
- Database indexing

## 🐛 Known Limitations

This is a **prototype/demo** with the following limitations:

- **localStorage**: Data is stored locally in browser (cleared when cache is cleared)
- **No real backend**: All logic runs in the browser
- **Simulated file uploads**: Files are not actually uploaded
- **Simulated payments**: No real payment processing
- **No email**: Notifications are in-app only
- **Single-browser**: Data doesn't sync across devices

## 📝 License

This is a demo project created for educational purposes.

## 👥 Support

For questions or issues:
1. Check the code comments for implementation details
2. Review the sample data in `js/sample-data.js`
3. Inspect browser console for debugging information

## 🎓 Learning Resources

This project demonstrates:
- Modern JavaScript (ES6+)
- CSS Grid and Flexbox
- LocalStorage API
- Form validation
- Event handling
- Modular code organization
- Responsive design
- User authentication
- Role-based access control
- State management

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**
