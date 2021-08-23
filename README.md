# Backend Test Embreo

A web application that will facilitate the online booking of wellness events (health talks, onsite screenings, etc) and the vendor approval or rejection of said events.

## Installation 

- Make sure you had clone this repo
- Copy environment from `.env.example` to `.env`
- Configure your `.env` file according to your MySQL credentials
- Open your terminal in this project and run 

	```bash
	npm install
	```

	and then

	```bash
	npm start
	```

## Entity Relationship Diagram (ERD)

![alt text](https://github.com/mathiuskormasela12/back-test-embreo/blob/main/screenshoot/ERD.png?raw=true)

## API SPECS

- POST `/api/v1/auth/register` Route for register new user

	Request Body

	```
	{
		"name": "vendor or company name",
		"username": "username",
		"password": "user password",
		"role": "user role"
	}
	```

- POST `/api/v1/auth/login` Route for login

	Request Body

	```
	{
		"username": "username",
		"password": "user password"
	}
	```

- GET `/api/v1/event` Route for get all events
- GET `/api/v1/event/:id` Route for get specific event
- POST `/api/v1/event` Route for add new event

	Request Body 

	```
	{
		"event_name": "event name",
		"location": "event location",
		"vendor_id": "vendor id",
		"date_event": [
			"proposed date",
			"proposed date",
			"proposed date"
		]
	}
	```

- PATCH `/api/v1/event/approve/:id` Route for approve an event

	Request Body 

	```
	{
		"date_event": "id proposed date"
	}
	```

- PATCH `/api/v1/event/reject/:id` Route for reject an event