const PERMISSIONS = {
    'Senior Inspector': {
        manufacturers: { create: true, read: true, update: true, delete: true },
        products: { create: true, read: true, update: true, delete: true },
        inspections: { create: true, read: true, update: true, delete: true },
        complaints: { create: true, read: true, update: true, delete: true },
        compliance: { create: true, read: true, update: true, delete: true }
    },
    'Inspector': {
        manufacturers: { create: false, read: true, update: false, delete: false },
        products: { create: false, read: true, update: false, delete: false },
        inspections: { create: true, read: true, update: true, delete: false },
        complaints: { create: true, read: true, update: true, delete: false },
        compliance: { create: false, read: true, update: false, delete: false }
    }
};

export const getPermissions = (role, module) => {
    if (!role || !PERMISSIONS[role] || !PERMISSIONS[role][module]) {
        return { create: false, read: false, update: false, delete: false };
    }
    return PERMISSIONS[role][module];
};
