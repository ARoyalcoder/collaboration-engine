import {
    type Permission,
} from './permissions.js';

import {
    ROLE_PERMISSIONS,
} from './role-permissions.js';

import type { WorkspaceRole } from './roles.js';

export function hasPermission(
    role: WorkspaceRole,
    permission: Permission,
): boolean {
    return ROLE_PERMISSIONS[role].includes(permission);
}


export function hasAllPermissions(
    role: WorkspaceRole,
    permissions: readonly Permission[],
): boolean {
    return permissions.every((permission) =>
        hasPermission(role, permission),
    );
}


export function hasAnyPermission(
    role: WorkspaceRole,
    permissions: readonly Permission[],
): boolean {
    return permissions.some((permission) =>
        hasPermission(role, permission),
    );
}