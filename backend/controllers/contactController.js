const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const AppError = require('../utils/appError');

exports.submitContactForm = catchAsync(async (req, res, next) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return next(new AppError('Please provide name, email and message', 400));
    }

    // 1) Prepare the email content for the Admin
    const adminMessage = `
        You have a new contact form submission:
        
        Name: ${name}
        Email: ${email}
        Message: ${message}
    `;

    try {
        // 2) Send email to the Admin
        await sendEmail({
            email: process.env.EMAIL_USER,
            subject: `New Contact Submission from ${name}`,
            message: adminMessage
        });

        // 3) Send a confirmation email to the User (Optional but good UX)
        try {
            const userMessage = `
                Hello ${name},
                
                Thank you for contacting BikeRent Pro. We have received your message and will get back to you within 24 hours.
                
                Your Message:
                "${message}"
                
                Regards,
                The BikeRent Pro Team
            `;

            await sendEmail({
                email: email,
                subject: 'Message Received - BikeRent Pro',
                message: userMessage
            });
        } catch (err) {
            console.error('Failed to send confirmation email to user:', err);
            // Don't fail the whole request if user email fails
        }

        res.status(200).json({
            status: 'success',
            message: 'Your message has been sent successfully!'
        });
    } catch (err) {
        console.error('Failed to send email to admin:', err);
        return next(new AppError('There was an error sending the email. Please try again later.', 500));
    }
});
