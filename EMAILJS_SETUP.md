# EmailJS Setup & Troubleshooting Guide

## 🚨 Current Issue: Gmail API Authentication Scopes

**Error**: `Gmail_API: Request had insufficient authentication scopes`

This means your EmailJS Gmail service needs to be reconnected with proper permissions.

## 🔧 Quick Fix for Current Issue

### Option 1: Reconnect Gmail Service (Recommended)
1. Go to your [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Navigate to **Email Services**
3. Find your Gmail service (`service_1pfb00n`)
4. Click **Reconnect** or **Edit**
5. **Re-authorize** your Gmail account with full permissions
6. Test the service from EmailJS dashboard

### Option 2: Use Alternative Email Service
1. Try **Outlook** or **Yahoo** instead of Gmail
2. Create new service in EmailJS dashboard
3. Update your `.env` file with the new Service ID

## Step 1: Create EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID**

## Step 3: Create Email Template

1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template structure:

```
Subject: New Contact Form Message from {{from_name}}

Hello {{to_name}},

You have received a new message from your portfolio contact form:

Name: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
This message was sent from your portfolio website.
```

4. Save the template and note down your **Template ID**

## Step 4: Get Public Key

1. Go to "Account" in your EmailJS dashboard
2. Find your **Public Key** in the API Keys section

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your EmailJS credentials:

```env
REACT_APP_EMAILJS_SERVICE_ID=your_service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id_here
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key_here
```

## Step 6: Test the Integration

1. Start your development server: `npm start`
2. Navigate to the Contact page
3. Fill out and submit the contact form
4. Check your email for the test message

## Troubleshooting

### Current Configuration
Your `.env` file has:
```env
REACT_APP_EMAILJS_SERVICE_ID=service_1pfb00n
REACT_APP_EMAILJS_TEMPLATE_ID=template_33qolar
REACT_APP_EMAILJS_PUBLIC_KEY=0hTLkWFeRH-yPduK2
```

### Common Issues:
- **Gmail API Scopes Error**: Reconnect Gmail service with full permissions
- **401 Unauthorized**: Check your public key
- **404 Not Found**: Verify your service ID and template ID
- **Network Error**: Check your internet connection and EmailJS service status
- **Validation Errors**: Ensure all form fields are properly filled

### Testing Steps:
1. **Test in EmailJS Dashboard**: Go to Email Templates → `template_33qolar` → "Test it"
2. **Restart Dev Server**: `npm start` after any changes
3. **Check Browser Console**: Look for detailed error messages

## Security Notes

- Never commit your `.env` file to version control
- The public key is safe to use in client-side code
- EmailJS has rate limiting to prevent abuse
- Consider adding reCAPTCHA for additional security in production