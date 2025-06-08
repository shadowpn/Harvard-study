# 📬 CS50W Project 3: Mail

This is a single-page email client built with **Django**, **JavaScript**, **HTML**, and **CSS**, as part of [CS50's Web Programming with Python and JavaScript](https://cs50.harvard.edu/web/2020/projects/3/mail/).

The app allows users to register and sign in, send and receive emails, archive/unarchive messages, and reply — all within a dynamic and responsive SPA interface.

---

## 🚀 How to Run

1. **Clone or download** this repository.
2. Navigate to the project directory:
   ```bash
   cd project3
````

3. Run migrations:

   ```bash
   python manage.py makemigrations mail
   python manage.py migrate
   ```
4. Start the server:

   ```bash
   python manage.py runserver
   ```
5. Open `http://127.0.0.1:8000/` in your browser.
6. Register any email address (real or fake, e.g. `foo@example.com`) to start using the app.

---

## 🛠️ Features

### ✅ Authentication

* User **registration**, **login**, and **logout**
* Current user's email is displayed in the UI

### ✅ Compose Email

* Write a new message using the **Compose** button
* Inputs: `Recipients`, `Subject`, `Body`
* Submitting the form sends a **POST** request to `/emails`
* After sending, automatically loads the **Sent** mailbox

### ✅ Inbox / Sent / Archive Mailboxes

* Click `Inbox`, `Sent`, or `Archived` to view mailboxes
* Emails are fetched via `GET /emails/<mailbox>`
* Each email is rendered with:

  * **Sender** (Inbox), or **Recipients** (Sent)
  * **Subject**
  * **Timestamp**
* Unread emails are shown with a white background
* Read emails have a gray background

### ✅ View Email

* Clicking an email loads its content:

  * From, To, Subject, Timestamp, Body
* Email is marked as **read** via a `PUT` request
* Archive/Unarchive and Reply buttons are available when applicable

### ✅ Archive & Unarchive

* Archive button shows for **Inbox** emails
* Unarchive button shows for **Archived** emails
* Triggers a `PUT` request to toggle the `archived` flag
* After the action, the **Inbox** view is loaded automatically

### ✅ Reply to Emails

* Clicking "Reply" opens the Compose form:

  * `Recipients`: pre-filled with original sender
  * `Subject`: prepended with `Re: ` (only if not already present)
  * `Body`: quoted original message with timestamp

### ✅ Single Page App (SPA)

* All navigation is handled client-side via `inbox.js`
* No page reloads between views
* Only one HTML template is used (`inbox.html`)

### ✅ Visual Styling

* Active mailbox button is highlighted
* Responsive layout and modern UI with clean borders and hover effects
* Custom styles in `styles.css`

---

## 📂 File Structure

```
project3/
├── mail/
│   ├── static/mail/
│   │   ├── inbox.js         # Main JavaScript logic
│   │   └── styles.css       # Custom styling
│   ├── templates/mail/
│   │   └── inbox.html       # HTML template
│   ├── urls.py              # API and view routes
│   └── views.py             # Django views
├── manage.py
└── README.md                # This file
```

## ✅ Specification Checklist

| Feature                    | Implemented |
| -------------------------- | ----------- |
| Compose Email (POST)       | ✅ Yes       |
| Inbox / Sent / Archive     | ✅ Yes       |
| View Full Email            | ✅ Yes       |
| Mark as Read (PUT)         | ✅ Yes       |
| Archive / Unarchive (PUT)  | ✅ Yes       |
| Reply with Pre-filled Form | ✅ Yes       |
| SPA Behavior (No reloads)  | ✅ Yes       |
| Styling + Active Tabs      | ✅ Yes       |
| All Code in `inbox.js`     | ✅ Yes       |

