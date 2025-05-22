import { SetMetadata } from '@nestjs/common';

/**
 * @constant IS_PUBLIC_KEY
 * @description Metadata key used to mark public endpoints.
 * Used by JwtAuthGuard to determine routes that do not require authentication.
 * This value must match the key used in the guard when checking metadata.
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @decorator Public
 * @description Decorator used to mark public endpoints.
 * When applied to a controller or method,
 * JwtAuthGuard will skip checking the JWT token for that endpoint.
 *
 * Usage example:
 * ```typescript
 * @Public()
 * @Get('public-endpoint')
 * publicEndpoint() {
 *   return 'This endpoint is accessible without authentication';
 * }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
