## Email Module

Uses NestJs mailer module (built on top of nodemailer) to send emails

## Tools

### SMTP Server

In prod, we will need to use an SMTP service (SES Grid, sendgrid)
In test, we can use ethereal (fake SMTP service)

### Templates

As we will send a variety of different emails depending on the use case, handlebars will be used to generate templates for emails

## Set up:

Generate an ethereal account using the following link:
https://ethereal.email/create
Add the following variables to your .env config:

```
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USERNAME=<username>
EMAIL_PASSWORD=<password>
EMAIL_ADDRESS =<username>
```

Now, the email service should run smoothly, you can login at https://ethereal.email/login, to test the emails sent
