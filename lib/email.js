import nodemailer from 'nodemailer'

export const sendMail=async({to,html,subject})=>{
   const host = process.env.SMTP_HOST
   const port = process.env.SMTP_PORT
   const user = process.env.SMTP_USER
   const pass = process.env.SMTP_PASS
   const from = process.env.EMAIL_FROM
   
   const transporter=nodemailer.createTransport({
    host,
    port,
    secure:false,
    auth:{
      user,
      pass
    }
   })

   await transporter.sendMail({
    from,
    to,
    subject,
    text:"welcome to resturent",
    html
   })
}