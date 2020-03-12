import { CurrentUser } from 'typings/CurrentUser';

export const isUserAuthenticated = (currentUser?: CurrentUser): boolean => {
  return currentUser ? true : false;
};

export const getCurrentUserDisplayName = (currentUser?: CurrentUser): string => {
  return currentUser ? currentUser.displayName : '';
};

export const getCurrentUserAvatarName = (currentUser?: CurrentUser): string => {
  return currentUser ? currentUser.displayName[0].toUpperCase() : '';
};

export const getCurrentUserId = (currentUser?: CurrentUser): number => {
  return currentUser ? currentUser.id : 0;
};

export const getCurrentUserLoginName = (currentUser?: CurrentUser): string => {
  return currentUser ? currentUser.loginName : '';
};
