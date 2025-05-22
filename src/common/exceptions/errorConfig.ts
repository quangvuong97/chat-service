/**
 * @constant ErrorConfig
 * @description Collection of error codes used throughout the application.
 * Used in conjunction with BadRequestException to create standardized error messages.
 */
export const ErrorConfig = {
  // User
  /** Error when user with provided ID is not found */
  USER_NOT_FOUND: 'user not found',
  /** Error when trying to register with an existing username */
  USER_ALREADY_EXISTS: 'user already exists',
  /** Error when login credentials (username/password) are incorrect */
  INVALID_CREDENTIALS: 'invalid credentials',

  // GroupChat
  /** Error when group chat with provided ID is not found */
  GROUP_CHAT_NOT_FOUND: 'group chat not found',
  /** Error when one or more members added to group chat do not exist */
  MEMBER_NOT_FOUND: 'member not found',
  /** Error when the number of members does not match the group chat type (personal/group) */
  INVALID_MEMBER_NUMBER: 'invalid member number',

  // ObjectId
  /** Error when the provided value is not a valid MongoDB ObjectId */
  INVALID_OBJECT_ID: 'invalid object id',
};
