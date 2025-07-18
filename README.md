# Capstone Project – OnlineCourseFlow

## Project Overview

**CourseFlow** is a modern online learning platform that allows users to browse, save, and take interactive courses. Registered users gain access to a curated catalog of course cards and can save courses to their personal dashboard. Each course includes a detailed description, video lessons, and a comment section where learners can ask questions or leave feedback.

The platform includes a full admin panel for uploading and managing courses, and is built using Django on the backend and Next.js + Tailwind CSS on the frontend. The application is fully responsive and optimized for mobile use.
---
## Distinctiveness and Complexity

This project is **fundamentally distinct** from previous CS50W assignments in the following ways:

- **Not a social network**  
  While comments exist, the core focus is on content consumption and course engagement—not on user-to-user interactions or activity feeds.

- **Not an e-commerce app**  
  There is no shopping cart, payment gateway, or checkout flow. “Enrollment” is purely access control without handling financial transactions.

- **Purpose-built for education**  
  Inspired by platforms like Coursera and Udemy, this application delivers video lessons, structured course management, and a Q&A thread—features beyond the scope of any CS50W sample project.

### Technical Complexity Highlights

1. **Authentication System**  
   Full JWT-based login and registration via Django REST Framework, with tokens stored in `localStorage` and managed by a custom `authHelpers.js` utility on the frontend.

2. **Protected Routes & Redirects**  
   Client-side guards using Next.js’ `useRouter.replace` ensure only authenticated users access `/protected/*`; missing or expired tokens trigger immediate redirects to `/auth`.

3. **Admin-Managed Course CRUD**  
   Through Django’s admin interface, site administrators can create, update, and delete courses—including uploading videos, images, and rich descriptions—without writing any JavaScript.

4. **Personal Dashboard**  
   Enrolled courses persist on both the server and in `localStorage`. A paginated dashboard lets users revisit or unenroll from any saved course with a single click.

5. **Course Detail Page**  
   Each course has its own `/protected/courses/[slug]` page featuring an HTML5 video player, rich text description, and a live comment thread for Q&A.

6. **Comment System**  
   Learners can post and view comments via DRF endpoints, with the frontend polling for new replies without full page reloads.

7. **Reusable Pagination Component**  
   A single `Pagination` component handles any paginated list (Store, Dashboard). It supports previous/next buttons, ellipses (`…`) for large ranges, and updates the `?page=` query parameter dynamically.

8. **Rich Text Description Formatting**  
   Course descriptions may include multiple paragraphs, line breaks, and lists. We preserve this formatting on the frontend via a `FormattedText` component that wraps raw textarea input in:
   ```html
   <div class="whitespace-pre-wrap break-words">…original text…</div>

9. **Mobile-First, Responsive Design**
    A custom useIsMobile hook plus Tailwind’s responsive utilities ensure every page and component adapts cleanly from 320 px to desktop breakpoints.

10. **Modern UI & Animations**
    Neumorphic buttons, gradient-wave CSS animations (@keyframes), soft shadows, and consistent card layouts deliver a polished, engaging user experience.
    
---

## File Structure

capstone/
│
├── backend/                             # Django REST API
│   ├── capstone_backend/                # Project settings, URLs, WSGI/ASGI
│   ├── courses/                         # App: models, serializers, views
│   ├── users/                           # App: authentication, user views
│   ├── media/                           # Uploaded videos & assets
│   ├── db.sqlite3                       # Default SQLite DB
│   ├── manage.py                        # Django CLI
│   └── requirements.txt                 # Pinned Python deps
│
└── front/                               # Next.js + Tailwind frontend
    ├── public/                          # Static assets (icons, images)
    ├── src/
    │   ├── components/
    │   │   ├── FormattedText.js         # Renders raw multi-line text with whitespace-pre-wrap
    │   │   ├── CourseDescription.js     # “Read more” / “Show less” wrapper around FormattedText
    │   │   ├── Pagination.js            # Reusable pagination UI
    │   │   ├── CourseCard.js            # Flip-card with enroll, details, and description back face
    │   │   ├── EnrolledCard.js          # Dashboard card with “Start” & “Remove”
    │   │   └── …                        # Header, Sidebar, Breadcrumbs, etc.
    │   ├── hooks/
    │   │   └── useIsMobile.js           # Detects mobile viewport
    │   ├── utils/
    │   │   └── authHelpers.js           # injects Authorization header, handles refresh
    │   └── app/
    │       ├── auth/page.js             # Login / Register panel (AuthPanel)
    │       ├── protected/
    │       │   ├── store/page.js        # Store listing with pagination
    │       │   ├── dashboard/page.js    # User dashboard with spacer + pagination
    │       │   └── courses/[slug]/page.js # Course view: video + description + comments
    │       └── layout.js                # Global layout with Header & Sidebar
    ├── .env.local                       # NEXT_PUBLIC_API_URL=http://localhost:8000/api
    ├── tailwind.config.js               # Tailwind customization
    ├── next.config.mjs                  # Next.js config
    └── package.json                     # Frontend deps & scripts

## How to Run

1. **Install dependencies**
 1.1 **Backend:**
cd capstone/backend
pip install -r requirements.txt
 
 1.2 **Frontend:**
cd capstone/front
npm install
 
2. **Set up database**
cd capstone/backend
python manage.py makemigrations
python manage.py migrate

3. **Create superuser (for admin access)**

python manage.py createsuperuser

4. **Run servers**

Backend (Django):

cd capstone/backend
python manage.py runserver

Frontend (Next.js):

cd capstone/front
npm run dev

App will be running at:
http://localhost:3000 (Frontend)
http://localhost:8000 (Backend API)

**Additional Notes**

Only registered users can access course content. All API calls use secure JWT authorization.

Admins can upload new courses including video lessons and manage them via /admin/.

Token refresh is handled automatically through custom authHelpers.js.

Sample .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000/api

Backend works with sqlite3 DB and It is easily portable to any relational database like PostgreSQL

The application is a fully integrated SPA with real-time data fetching and route protection.