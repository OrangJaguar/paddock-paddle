import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return Response.json({ 
        success: false,
        error: 'Email and code are required' 
      }, { status: 400 });
    }

    // Create Base44 client with service role (admin privileges)
    const base44 = createClientFromRequest(req);

    console.log('Attempting to verify email:', email, 'with code:', code);

    // Try to verify the email using Base44's built-in verification
    // Base44 handles verification codes internally, we just need to call the right endpoint
    try {
      // Use the SDK's built-in email verification through the auth system
      await base44.asServiceRole.auth.verifyEmail(email, code);
      
      console.log('✅ Email verified successfully for:', email);

      return Response.json({ 
        success: true,
        message: 'Email verified successfully' 
      });

    } catch (verifyError) {
      console.error('Verification failed:', verifyError);
      
      // Check if it's an invalid code error
      if (verifyError.message?.includes('invalid') || 
          verifyError.message?.includes('expired') ||
          verifyError.message?.includes('incorrect')) {
        return Response.json({ 
          success: false,
          error: 'Invalid or expired verification code' 
        }, { status: 400 });
      }

      throw verifyError;
    }

  } catch (error) {
    console.error('Email verification error:', error);
    
    return Response.json({ 
      success: false,
      error: error.message || 'Verification failed' 
    }, { status: 500 });
  }
});