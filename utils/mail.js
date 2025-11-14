import mailgen from "mailgen";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const sendMail = async (options) => {
    const mailGenerator = new mailgen({
        theme: "default",
        product: {
            name: "My App",
            link: "https://myapp.com",
        },
    }); 

    const emailHtmlContent = mailGenerator.generate(options.mailgenContent);
   
    const emailTextualContent = mailGenerator.generatePlaintext(options.mailgenContent);

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASSWORD,
    },
});


const mail = {
    from: process.env.MAILTRAP_SMTP_USER,
    to: options.to,
    subject: options.subject,
    html: emailHtmlContent,
    text: emailTextualContent,
};

try{
    await transporter.sendMail(mail);
    console.log("Email sent successfully");
    }catch(error){
        console.log(error);
    }

}


const emailVerificationMailgenContent = (username, emailVerificationUrl) => {
    return {
        body: {
            name: username,
            intro: "You have successfully created an account on our platform!",
            action: {
                instructions: "To verify your email address, please click on the button below.",
                button: {
                    color: "#25d2a5",
                    text: "Verify Email",
                    link: emailVerificationUrl,
                },
            },
            outro: "If you did not create an account, please ignore this email.",
        },
    };
};

const forgetPasswordMailgenContent = (username, forgetPasswordUrl) => {
    return {
        body: {
            name: username,
            intro: "You have successfully created an account on our platform!",
            action: {
                instructions: "To reset your password, please click on the button below.",
                button: {
                    color: "#25d2a5",
                    text: "Reset Password",
                    link: forgetPasswordUrl,
                },
            },
            outro: "If you did not create an account, please ignore this email.",
        },
    };
};

export {
    emailVerificationMailgenContent,
    forgetPasswordMailgenContent,
    sendMail
};
