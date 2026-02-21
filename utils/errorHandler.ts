export interface AppError {
  type: 'NETWORK' | 'AUTH' | 'NOT_FOUND' | 'RATE_LIMIT' | 'VALIDATION' | 'UNKNOWN';
  message: string;
  description?: string;
  retryable: boolean;
  statusCode?: number;
}

export class GitWrappedError extends Error {
  public type: AppError['type'];
  public retryable: boolean;
  public statusCode?: number;

  constructor(error: AppError) {
    super(error.message);
    this.name = 'GitWrappedError';
    this.type = error.type;
    this.retryable = error.retryable;
    this.statusCode = error.statusCode;
  }
}

function getErrorMessageFromUnknown(error: unknown): string | undefined {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
    return (error as { message: string }).message;
  }
  return undefined;
}

export const handleGitHubError = (error: unknown): AppError => {
  const message = getErrorMessageFromUnknown(error) ?? '';
  // Network errors
  if (message.includes('fetch') || message.includes('network')) {
    return {
      type: 'NETWORK',
      message: 'Network connection failed',
      description: 'Please check your internet connection and try again',
      retryable: true
    };
  }

  // Authentication errors
  if (message.includes('401') || message.includes('token')) {
    return {
      type: 'AUTH',
      message: 'Authentication failed',
      description: 'Please check your GitHub token configuration',
      retryable: false,
      statusCode: 401
    };
  }

  // Rate limiting
  if (message.includes('rate limit') || message.includes('429')) {
    return {
      type: 'RATE_LIMIT',
      message: 'Rate limit exceeded',
      description: 'GitHub API rate limit reached. Please try again later',
      retryable: true,
      statusCode: 429
    };
  }

  // User not found
  if (message.includes('not found') || message.includes('404')) {
    return {
      type: 'NOT_FOUND',
      message: 'User not found',
      description: 'Please check the username and try again',
      retryable: false,
      statusCode: 404
    };
  }

  // Validation errors
  if (message.includes('validation') || message.includes('invalid')) {
    return {
      type: 'VALIDATION',
      message: 'Invalid input',
      description: 'Please check your input and try again',
      retryable: false
    };
  }

  // Unknown errors
  return {
    type: 'UNKNOWN',
    message: 'An unexpected error occurred',
    description: 'Please try again or contact support if the problem persists',
    retryable: true
  };
}; 