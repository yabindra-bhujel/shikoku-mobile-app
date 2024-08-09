import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from ...settings.email import EmailSettings

class EmailUtils:

    def __init__(self):
        self.email_settings = EmailSettings()

    def send_email(self, email, subject, body):
        try:
            msg = MIMEMultipart()
            msg['From'] = self.email_settings.EMAIL_IMAP_USERNAME
            msg['To'] = email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))

            try:
                with smtplib.SMTP(self.email_settings.EMAIL_IMAP_HOST, self.email_settings.EMAIL_IMAP_PORT) as server:
                    server.starttls()  # TLSを開始
                    server.login(self.email_settings.EMAIL_IMAP_USERNAME, self.email_settings.EMAIL_IMAP_PASSWORD)
                    server.sendmail(self.email_settings.EMAIL_IMAP_USERNAME, email, msg.as_string())
                    server.quit()
            except Exception as e:
                raise e
                
        except Exception as e:
            raise e