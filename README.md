#Coherence API

## Overview
The Coherence API provides a set of endpoints for user management, including functionalities for retrieving user data, creating new users, and handling password-related operations.

## API Endpoints

### Version 1: `/api/v1`

#### User Endpoints

- **GET** `/users`
  - **Description:** Retrieves a list of all users.
  - **Response:** Returns an array of user objects.

- **GET** `/users/:id`
  - **Description:** Retrieves details of a specific user by their ID.
  - **Parameters:**
    - `id`: The unique identifier for the user.
  - **Response:** Returns a user object with detailed information.

- **POST** `/users`
  - **Description:** Creates a new user.
  - **Request Body:**
    - Must include user details such as name, email, and password.
  - **Response:** Returns the created user object and a success message.

- **POST** `/forgotPassword`
  - **Description:** Initiates the password reset process for a user.
  - **Request Body:**
    - Must include the user's email address.
  - **Response:** Returns a success message indicating that a password reset email has been sent.

- **POST** `/resetPassword`
  - **Description:** Resets a user's password.
  - **Request Body:**
    - Must include the user's email address, new password, and a token received from the password reset email.
  - **Response:** Returns a success message indicating that the password has been reset.

## Usage
To access the API, replace `<domain_name>` and `<TLD>` with your server's domain name and top-level domain.

### Example Requests
1. **Get all users:**
   ```bash
   curl -X GET http://<domain_name><TLD>/api/v1/users

