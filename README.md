MICROJS

AUTH: auth folder for authentication microjs
RUN: MONGODB=mongodb://localhost:27017 SECRET=abcdefgabcdefg npm start

<br/>
SERVICE: user foler for service example
RUN: npm start

microservice login and signup

signup:
172.16.120.64:3000/api/setup

signup body json object passing

{"username":"your username","aboutme":"aboutme description","firstname":"your first name", "lastname":"your last name", "email":"abc@example.com", "password":"your password","dob":"dd/mm/yyyy","role":"team lead","signup_type":"email","image_name":"image1.jpg","image_url":"your image url"}

login:
172.16.120.64:3000/api/login

login body json object passing

{"email":"abc@example.com", "password":"your password"}