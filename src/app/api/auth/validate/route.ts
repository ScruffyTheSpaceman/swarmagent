import { NextRequest, NextResponse } from 'next/server';

// Validate authentication token
function validateToken(token: string): any {
  try {
    // Simple base64 decoding for demo (use proper JWT in production)
    const payload = JSON.parse(atob(token));
    
    // Check if token is not older than 24 hours
    const tokenAge = Date.now() - payload.timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (tokenAge > maxAge) {
      return null; // Token expired
    }
    
    // Validate username
    if (payload.username !== 'egor1993') {
      return null; // Invalid user
    }
    
    return payload;
  } catch {
    return null; // Invalid token format
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Validate token
    const payload = validateToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Token is valid
    return NextResponse.json({
      success: true,
      data: {
        valid: true,
        username: payload.username,
        sessionId: payload.sessionId,
        expiresAt: new Date(payload.timestamp + 24 * 60 * 60 * 1000),
        permissions: [
          'view_agents',
          'manage_agents',
          'view_projects', 
          'manage_projects',
          'view_analytics',
          'manage_api_keys',
          'system_configuration',
          'vault_access',
          'qd_advanced_features'
        ]
      }
    });
  } catch (error: any) {
    console.error('Token validation error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Token validation failed' },
      { status: 500 }
    );
  }
}