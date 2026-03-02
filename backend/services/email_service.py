import os
import asyncio
import logging
import resend

logger = logging.getLogger(__name__)

RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')


async def send_email(to_email: str, subject: str, html_content: str) -> bool:
    """Send email using Resend API or log to console as fallback"""
    
    if not RESEND_API_KEY:
        # Fallback: Log email content to console
        logger.info("=" * 50)
        logger.info("EMAIL MOCK (RESEND_API_KEY not set)")
        logger.info(f"To: {to_email}")
        logger.info(f"Subject: {subject}")
        logger.info(f"Content: {html_content[:500]}...")
        logger.info("=" * 50)
        return True
    
    try:
        resend.api_key = RESEND_API_KEY
        params = {
            "from": SENDER_EMAIL,
            "to": [to_email],
            "subject": subject,
            "html": html_content
        }
        
        # Run sync SDK in thread to keep FastAPI non-blocking
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent successfully to {to_email}, ID: {result.get('id')}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return False


async def send_welcome_email(to_email: str, username: str) -> bool:
    """Send welcome email to new user"""
    subject = "Welcome to TaskFlow!"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f1f5f9; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; padding: 40px; }}
            .header {{ text-align: center; margin-bottom: 30px; }}
            .logo {{ font-size: 32px; font-weight: bold; color: #3b82f6; }}
            h1 {{ color: #f1f5f9; margin-bottom: 20px; }}
            p {{ color: #94a3b8; line-height: 1.6; }}
            .button {{ display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; margin-top: 20px; }}
            .footer {{ margin-top: 40px; text-align: center; color: #475569; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">TaskFlow</div>
            </div>
            <h1>Welcome, {username}!</h1>
            <p>Thank you for joining TaskFlow! We're excited to help you organize your tasks and boost your productivity.</p>
            <p>Get started by creating your first task and exploring the dashboard.</p>
            <p>Features you'll love:</p>
            <ul style="color: #94a3b8;">
                <li>Organize tasks with categories</li>
                <li>Set priorities and due dates</li>
                <li>Track your progress with stats</li>
                <li>Get reminders for important tasks</li>
            </ul>
            <div class="footer">
                <p>Built by Gourav Mishra | TaskFlow &copy; 2024</p>
            </div>
        </div>
    </body>
    </html>
    """
    return await send_email(to_email, subject, html_content)


async def send_otp_email(to_email: str, otp: str) -> bool:
    """Send OTP email for password reset"""
    subject = "Your Password Reset OTP - TaskFlow"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f1f5f9; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; padding: 40px; }}
            .header {{ text-align: center; margin-bottom: 30px; }}
            .logo {{ font-size: 32px; font-weight: bold; color: #3b82f6; }}
            h1 {{ color: #f1f5f9; margin-bottom: 20px; }}
            p {{ color: #94a3b8; line-height: 1.6; }}
            .otp-box {{ background-color: #334155; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }}
            .otp {{ font-size: 36px; font-weight: bold; color: #3b82f6; letter-spacing: 8px; }}
            .warning {{ color: #f59e0b; font-size: 14px; }}
            .footer {{ margin-top: 40px; text-align: center; color: #475569; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">TaskFlow</div>
            </div>
            <h1>Password Reset Request</h1>
            <p>You requested to reset your password. Use the OTP below to continue:</p>
            <div class="otp-box">
                <div class="otp">{otp}</div>
            </div>
            <p class="warning">This OTP will expire in 15 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <div class="footer">
                <p>Built by Gourav Mishra | TaskFlow &copy; 2024</p>
            </div>
        </div>
    </body>
    </html>
    """
    return await send_email(to_email, subject, html_content)


async def send_task_reminder_email(to_email: str, task_title: str, due_date: str) -> bool:
    """Send task reminder email"""
    subject = f"Reminder: '{task_title}' is due soon - TaskFlow"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f1f5f9; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; padding: 40px; }}
            .header {{ text-align: center; margin-bottom: 30px; }}
            .logo {{ font-size: 32px; font-weight: bold; color: #3b82f6; }}
            h1 {{ color: #f1f5f9; margin-bottom: 20px; }}
            p {{ color: #94a3b8; line-height: 1.6; }}
            .task-box {{ background-color: #334155; border-radius: 8px; padding: 20px; margin: 30px 0; border-left: 4px solid #f59e0b; }}
            .task-title {{ font-size: 18px; font-weight: bold; color: #f1f5f9; }}
            .due-date {{ color: #f59e0b; margin-top: 10px; }}
            .footer {{ margin-top: 40px; text-align: center; color: #475569; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">TaskFlow</div>
            </div>
            <h1>Task Reminder</h1>
            <p>Don't forget! You have a task due soon:</p>
            <div class="task-box">
                <div class="task-title">{task_title}</div>
                <div class="due-date">Due: {due_date}</div>
            </div>
            <p>Log in to TaskFlow to view or complete this task.</p>
            <div class="footer">
                <p>Built by Gourav Mishra | TaskFlow &copy; 2024</p>
            </div>
        </div>
    </body>
    </html>
    """
    return await send_email(to_email, subject, html_content)
