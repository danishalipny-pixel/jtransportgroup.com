# My London Transfer

Responsive recreation of the My London Transfer website brief, with a home page, booking flow, services, event transfers, family child-seat information, fleet, and contact pages.

## Run

```bash
cd backend
npm install
copy .env.example .env
```

Put `JWT_SECRET` and the Stripe keys in `backend/.env`. Do not commit that file.

```bash
npm start
```

Open [http://127.0.0.1:8080](http://127.0.0.1:8080). Search a journey, choose a vehicle, and pay on Stripe Checkout. The secret key never goes to the browser. Stripe should send webhooks to `http://127.0.0.1:8080/api/payments/webhook`.

```bash
npm test
```
