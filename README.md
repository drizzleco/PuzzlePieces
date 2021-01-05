# Drawma

## Getting Started

1. Install frontend dependencies(using yarn)

   - `cd frontend && yarn install`

2. Add `.env` files
   - **`.env` in frontend folder**
     - add firebase credentials
     ```
     REACT_APP_API_KEY=...
     REACT_APP_AUTH_DOMAIN=...
     REACT_APP_DATABASE_URL=...
     REACT_APP_PROJECT_ID=...
     REACT_APP_STORAGE_BUCKET=...
     REACT_APP_MESSAGING_SENDER_ID=...
     REACT_APP_APP_ID=...
     REACT_APP_MEASUREMENT_ID=...
     REACT_APP_BACKEND_URL=http://localhost:5000
     ```
   - **`.env` in backend folder**
     - add firebase credentials
     ```
      FIREBASE_PRIVATE_KEY_ID=...
      FIREBASE_PRIVATE_KEY=...
      FIREBASE_CLIENT_EMAIL=...
      FIREBASE_CLIENT_ID=...
      FIREBASE_CLIENT_CERT_URL=...
     ```
3. Start the app

   - **Start frontend:** In the `frontend` folder, run
     - `yarn start`
   - **Start backend:**

     - In the project root, run

       - `docker-compose up --build`

       **OR**

     - Start using poetry: In `backend` folder, run
       - `poetry install`
       - `poetry shell`
       - `python backend/app.py`

## Deploy Fronted (Render)

1. Automatic deploy
   - Push to `main` branch
2. Manual deploy
   - Go to [Render dashboard](https://dashboard.render.com/static/srv-btt37uoti7j17qdlschg) and deploy latest commit

## Deploy Backend (Heroku)

In `backend` folder,

1. `heroku container:push web -a drawma`
2. `heroku container:release web -a drawma`

---

## Frontend

- React

## Backend

- Flask

---

# Image Credits

Thank you to...

- https://homepages.cae.wisc.edu/~ece533/images/
- <a href="https://freeimages.com/photographer/jadegreen-43952">Steven Ritts</a>
- <a href="https://unsplash.com/@_yashrjain?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Yash Jain</a>
- <a href="https://unsplash.com/@nate_dumlao?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Nathan Dumlao</a>
- <a href="https://freeimages.com/photographer/icon0-79981">icon0</a>
- <a href="https://freeimages.com/photographer/merve-44914">merve toprak</a>
