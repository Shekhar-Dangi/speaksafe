# Mental Health Social Matching Backend

A Node.js backend for a mental health-focused social matching platform. Users can connect based on shared experiences, chat in real time, and receive notifications for matches and messages.

## Features

- Google OAuth 2.0 authentication
- User profiles with tags, bio, and profile picture
- Like/swipe and mutual match logic
- Real-time messaging (WebSocket, session-authenticated)
- Notifications for matches and messages
- Tag-based user discovery feed

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root with:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   CLIENT_URL=http://localhost:3001 # or your frontend URL
   BACKEND_URL=http://localhost:3000 # or your backend URL
   ```
3. Start the server:
   ```bash
   node server.js
   ```

## API Documentation

### Authentication

- `GET /auth/google` — Start Google OAuth
- `GET /auth/google/callback` — Google OAuth callback
- `GET /auth/logout` — Log out
- `GET /auth/me` — Get current user info

### User Matching

- `POST /users/:id/like` — Like a user
- `GET /users/liked` — Users you liked
- `GET /users/likedby` — Users who liked you
- `GET /users/matches` — Mutual matches

### Messaging

- `GET /users/:id/messages` — Chat history with a match
- WebSocket: Send `{ type: 'message', to: '<userId>', content: '<text>' }` to chat with a match

### Notifications

- `GET /users/notifications` — All notifications
- `POST /users/notifications/:notificationId/read` — Mark notification as read

### Tag Management

- `GET /users/me/tags` — Get your tags
- `POST /users/me/tags` — Add tags (array)
- `PUT /users/me/tags` — Replace all tags
- `DELETE /users/me/tags` — Remove specific tags (array)

### User Discovery

- `GET /users/feed` — Get a feed of users to swipe/like (prioritizes tag matches)

## WebSocket Usage

- Connect using the same session cookie as your login session.
- Only mutual matches can send messages to each other.
- Message format:
  ```json
  {
    "type": "message",
    "to": "<recipientUserId>",
    "content": "Hello!"
  }
  ```

## Security

- All endpoints require authentication (except `/` and `/auth/*`).
- Input validation and rate limiting are enforced.
- CORS and Helmet are enabled for security.

## Contributing

Pull requests are welcome! Please open an issue to discuss major changes first.

## License

MIT
