# TaskFlow Pro

A simple project management tool for a client, built with Node.js, TypeScript, and Express.

## Features

- User authentication and authorization
- Organization management _(pending)_
- Project creation and collaboration _(pending)_
- Task assignment and tracking _(pending)_
- Comments and attachments _(pending)_
- Notifications and activity logs _(pending)_

## Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (via migrations)
- **Authentication:** JWT
- **Email:** Nodemailer for notifications

## Installation

1. Clone the repository:

```shell
git clone <repository-url>
cd taskflow-pro
```

2. Install dependencies:

```shell
cd backend
npm install
```

3. Set up environment variables:

- Copy `example.env` to `.env`
- Fill in your database URL, JWT secrets, email credentials, etc.

4. Run database migrations:

```shell
npm run migrate
```

5. Start the server:

```shell
npm run dev
```

The server will run on `http://localhost:3000` (or as configured).

## Usage

- Register a new user via the auth endpoints.
- Create organizations and invite members. _(pending)_
- Set up projects and assign tasks. _(pending)_
- Use the API endpoints for full functionality. _(pending)_
- Refer to the API documentation or code comments for detailed endpoints. _(pending)_

License
MIT License.
