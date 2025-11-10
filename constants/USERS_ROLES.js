const USERS_ROLES = {
  USER: "user",
  PSYCHOLOGIST: "psychologist",
  ADMIN: "admin",
};
const PUBLIC_ROLE_VALUES = Object.values(USERS_ROLES).filter(
  (role) => role !== USERS_ROLES.ADMIN,
);

module.exports = { USERS_ROLES, PUBLIC_ROLE_VALUES };
