import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get the app's actual domain from the request
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/');
    
    if (!origin) {
      return Response.json({ 
        error: 'Unable to determine app origin' 
      }, { status: 400 });
    }
    
    const { email } = await req.json();
    
    if (!email) {
      return Response.json({ 
        error: 'Email is required' 
      }, { status: 400 });
    }
    
    // Request password reset with custom redirect URL
    const resetUrl = `${origin}/ResetPassword`;
    await base44.auth.resetPasswordRequest(email, resetUrl);
    
    return Response.json({ 
      success: true,
      message: 'Password reset email sent'
    });
    
  } catch (error) {
    console.error('Password reset error:', error);
    return Response.json({ 
      error: error.message || 'Failed to send reset email'
    }, { status: 500 });
  }
});