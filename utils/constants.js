export const UserRoles = {
    ADMIN: "admin",
    USER: "user",
};
export const AvailableRoles = Object.values(UserRoles);

export const UserPermissions = {
    CREATE: "create",
    READ: "read",
    UPDATE: "update",
    DELETE: "delete",
};
export const AvailablePermissions = Object.values(UserPermissions);

export const UserStatus = {
    ACTIVE: "active",
    INACTIVE: "inactive",
};
export const AvailableStatus = Object.values(UserStatus);

export const UserGender = {
    MALE: "male",
    FEMALE: "female",
    OTHER: "other",
};
export const AvailableGender = Object.values(UserGender);
