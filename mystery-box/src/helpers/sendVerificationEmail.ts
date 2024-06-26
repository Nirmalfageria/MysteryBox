    import {resend } from '@/lib/resend';
import VerificationEmail from '../../emails/verificationEmail';

 import { ApiResponse } from '@/types/ApiResponse';
import { verify } from 'crypto';

 export async function sendVerificationEmail(email: string, username: string, otp: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystery message | otp verification',
            react: VerificationEmail({ username , otp }),
         });
            return {
                success: true,
                message: 'Verification email sent',
          }
    } catch (emailError) {
        console.log('Error sending verification email', emailError);
        return {
            success: false,
            message: 'Error sending verification email',
        };
    }
}
