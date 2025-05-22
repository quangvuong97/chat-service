/**
 * @type JwtPayload
 * @description Defines the data structure for the JWT token payload.
 */
export type JwtPayload = {
  /** The ID of the user, stored as a string in the token */
  userId: string;
  /** The username of the user, used for display and identification */
  username: string;
};
