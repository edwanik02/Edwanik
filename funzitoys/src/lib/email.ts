import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 465), secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})
const FROM = `"FunziToys" <${process.env.SMTP_FROM ?? 'hello@funzitoys.com'}>`
const APP = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function sendOTPEmail(email: string, name: string, otp: string) {
  await transporter.sendMail({
    from: FROM, to: email, subject: 'Verify your FunziToys account',
    html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px">
      <h2 style="color:#FF6B35;font-family:Georgia,serif">🧸 FunziToys — Email Verification</h2>
      <p>Hi <strong>${name}</strong>, please verify your email with this code:</p>
      <div style="font-size:40px;font-weight:800;letter-spacing:10px;color:#FF6B35;padding:20px;background:#FFF2EC;border-radius:12px;text-align:center;margin:20px 0">${otp}</div>
      <p style="color:#666;font-size:14px">This code expires in 10 minutes. Do not share it with anyone.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
      <p style="font-size:12px;color:#aaa">© 2026 EDWANIKSTUDIO · Powered by FunziToys</p>
    </div>`,
  })
}
export async function sendOwnerApprovalEmail(email: string, name: string, password: string) {
  await transporter.sendMail({
    from: FROM, to: email, subject: '🎉 Your FunziToys Owner Account is Approved!',
    html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px">
      <h2 style="color:#FF6B35;font-family:Georgia,serif">🎉 Welcome to FunziToys Owner Portal!</h2>
      <p>Hi <strong>${name}</strong>, your owner account has been approved!</p>
      <div style="background:#f8f9fa;border-radius:12px;padding:20px;margin:20px 0">
        <p><strong>Login Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> <code style="background:#e9ecef;padding:4px 8px;border-radius:4px;font-size:16px">${password}</code></p>
        <p style="color:#e44;font-size:13px">⚠️ Please change your password after first login.</p>
      </div>
      <a href="${APP}/owner/login" style="display:inline-block;background:#FF6B35;color:#fff;padding:12px 24px;border-radius:50px;text-decoration:none;font-weight:700">Login to Owner Dashboard →</a>
    </div>`,
  })
}
export async function sendOwnerRejectionEmail(email: string, name: string) {
  await transporter.sendMail({
    from: FROM, to: email, subject: 'Update on your FunziToys Owner Application',
    html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px">
      <h2 style="color:#FF6B35;font-family:Georgia,serif">🧸 FunziToys Owner Application</h2>
      <p>Hi <strong>${name}</strong>, thank you for applying to become a FunziToys seller.</p>
      <p>Unfortunately, we are unable to approve your application at this time. You may reapply after 30 days.</p>
      <p>For queries, contact us at <a href="mailto:support@funzitoys.com">support@funzitoys.com</a></p>
    </div>`,
  })
}
