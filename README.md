## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# watch mode
$ npm run startdev

## Test

```bash
# unit tests
$ npm run test

## API Documentation

### POST /api/users/createUser
Create user into the application database.

Requires `first_name` and `last_name`, `email`, `phone_number`, `address`, `reference`, `password`, `confirm_password`, in the body.

Example:

```json
{
    "first_name": "Doe",
    "last_name": "Joe",
    "email": "doeJoe@gmail.com",
    "phone_number": "+23409090909038",
    "address": "12, Admila, Lagos",
    "password": "Passcode92#",
    "confirm_password": "Passcode92#",
    "reference": "Mr S.O Olu"
}

```

### POST/api/users/auth

Login User.

```json
{
   "email": "doeJoe@gmail.com",
   "password": "Passcode92#"
}

```

### APIs require token in header to work
```
X-Auth-Token - {`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI3NGE1ZDhjM2NlMzYwNGVlMmFjZDciLCJpYXQiOjE3MDY1MTEwMzZ9.NZo5fTp72igyrJlv-rPhtGbSPo_6FBjOdXMGTHjAuz0}
```


### POST /api/transaction/fundAccount/:id

User can fund his account.

Requires `id` of the user in the params.

Requires `amount` and `transactionType`, `narration`, in the body.

Example:

```json
{
    "amount": 54000,
    "transactionType": "CREDIT",
    "narration": "Money"
}
```

### POST /api/transaction/withdrawfunds/:id

Used can withdraw from his account.

Requires `id` of the user in the params.

Requires `amount` and `transactionType`, `narration`, in the body.

Example:

```json
{
    "amount": 54000,
    "transactionType": "DEBIT",
    "narration": "Money"
}
```

### POST  /api/transaction/transferFunds/:id

Used to transfer found to another account.

Requires `id` of the user in the params.

where `recipientId` is the account to fund

```json
{
    "amount": 50002,
    "narration": "Food money",
    "recipientId": "65b76a1e4349e5638a83c741"
}

```
