/**
 * Education authorization boundary for JAMB CAPS.
 *
 * CONFIGURED registry metadata is not proof of an authoritative CAPS response.
 * Until an authorized adapter returns a verifiable provider response, admission
 * operations must fail closed.
 */
export interface JambCapsAuthorizationInput {
  candidateReference: string;
  institutionId?: string;
  programmeId?: string;
  operation: 'ADMISSION_PROCESSING' | 'ADMISSION_STATUS';
}

export interface JambCapsAuthorizationResult {
  authorized: boolean;
  availability: 'AUTHORIZED' | 'UNAVAILABLE' | 'REQUIRES_MANUAL_REVIEW';
  provider: 'JAMB_CAPS';
  message: string;
  authoritativeReference?: string;
}

export interface JambCapsAuthoritativeAdapter {
  verify(input: JambCapsAuthorizationInput): Promise<{
    authorized: boolean;
    authoritativeReference?: string;
  }>;
}

let adapter: JambCapsAuthoritativeAdapter | null = null;

export function setJambCapsAuthoritativeAdapter(next: JambCapsAuthoritativeAdapter | null): void {
  adapter = next;
}

export async function verifyJambCapsAuthorization(
  input: JambCapsAuthorizationInput
): Promise<JambCapsAuthorizationResult> {
  if (!input.candidateReference.trim()) {
    return {
      authorized: false,
      availability: 'REQUIRES_MANUAL_REVIEW',
      provider: 'JAMB_CAPS',
      message: 'A candidate reference is required for authoritative JAMB CAPS verification.'
    };
  }

  if (!adapter) {
    return {
      authorized: false,
      availability: 'UNAVAILABLE',
      provider: 'JAMB_CAPS',
      message: 'Authoritative JAMB CAPS authorization is unavailable. CONFIGURED registry metadata alone cannot authorize admission processing or status changes.'
    };
  }

  try {
    const result = await adapter.verify(input);
    if (!result.authorized || !result.authoritativeReference?.trim()) {
      return {
        authorized: false,
        availability: 'REQUIRES_MANUAL_REVIEW',
        provider: 'JAMB_CAPS',
        message: 'JAMB CAPS did not return a verifiable authoritative authorization response.'
      };
    }
    return {
      authorized: true,
      availability: 'AUTHORIZED',
      provider: 'JAMB_CAPS',
      authoritativeReference: result.authoritativeReference.trim(),
      message: 'Admission operation authorized by an authoritative JAMB CAPS response.'
    };
  } catch {
    return {
      authorized: false,
      availability: 'UNAVAILABLE',
      provider: 'JAMB_CAPS',
      message: 'JAMB CAPS authorization could not be verified.'
    };
  }
}
