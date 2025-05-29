
#  CS50W Commerce - Online Auction Platform

This project was developed as part of [CS50's Web Programming with Python and JavaScript](https://cs50.harvard.edu/web/). It is a full-featured web application for managing online auctions, where users can create listings, place bids, add items to their watchlist, comment, and close auctions.

##  Features

### Authentication
- User registration
- Login and logout
- Access to key features restricted to logged-in users (`@login_required`)

### Listings
- Create new listings with:
  - Title
  - Description
  - Starting bid
  - Image (via URL or uploaded file)
  - Category
- Display of all **active listings** on the homepage
- Dynamic current price based on the highest bid

### Bidding
- Authenticated users can place bids
- Validation:
  - Bid must be greater than or equal to the starting price
  - Bid must be higher than any existing bids
- Error messages are displayed on the listing page

###  Watchlist
- Users can add or remove items from their personal watchlist
- Dedicated watchlist page to view saved items

###  Comments
- Users can leave comments on any listing
- All comments are displayed in chronological order

###  Closing Auctions
- Listing owners can **close** their auctions
- Highest bidder becomes the winner automatically
- The listing page shows the winner and displays a congratulatory message if the viewer is the winner

###  Categories
- View a list of all available categories
- Filter listings by category

###  Closed Listings
- Users can view a page of all their closed listings and outcomes

###  Django Admin
- Admin interface to manage users, listings, bids, and comments

---

##  Technologies Used

- Python / Django
- HTML / CSS (Bootstrap)
- SQLite
- Pillow (for image uploads)
- Django Forms / ModelForms
- Minimal JavaScript

---

## Setup and Usage

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/cs50w-commerce.git
cd cs50w-commerce
````

2. **Create a virtual environment:**

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install requirements:**

```bash
pip install -r requirements.txt
```

4. **Apply migrations:**

```bash
python manage.py migrate
```

5. **Create a superuser (optional):**

```bash
python manage.py createsuperuser
```

6. **Start the development server:**

```bash
python manage.py runserver
```

7. **Visit the app:**

```
http://127.0.0.1:8000/
```

---

## UI & Design

* Custom styling via `style.css`
* Clean, responsive layout with Bootstrap
* Logo in the header with navigation links
* Copyright footer across all pages

---

## Project Structure

```bash
auctions/
├── migrations/
├── static/
│   └── auctions/
│       ├── style.css
│       └── logo.png
├── templates/
│   └── auctions/
│       ├── layout.html
│       ├── index.html
│       ├── listing_detail.html
│       ├── create.html
│       ├── watchlist.html
│       ├── categories.html
│       └── ...
├── admin.py
├── apps.py
├── models.py
├── views.py
├── urls.py
├── forms.py
└── ...
```

---

## 📜 License

This project was developed as part of the CS50 Web Programming curriculum by Harvard University. For educational purposes only.

---

## ✨ Author

* **Nataliia Petrychuk**
* Full working rights in Australia
* Developed as the final project for CS50W (2025)


