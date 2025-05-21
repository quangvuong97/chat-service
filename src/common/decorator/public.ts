import { SetMetadata } from '@nestjs/common';

/**
 * @constant IS_PUBLIC_KEY
 * @description This is a constant for the is public key
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @decorator Public
 * @description This is a decorator for the public
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
