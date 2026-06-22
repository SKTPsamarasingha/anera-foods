"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/db";
import { ALL_PERMISSIONS, PERMISSIONS } from "@/lib/rbac";

const PERMISSION_LABELS = {
  [PERMISSIONS.DASHBOARD]: "View Dashboard",
  [PERMISSIONS.PRODUCTS]: "Manage Products",
  [PERMISSIONS.ORDERS]: "Manage Orders",
  [PERMISSIONS.CUSTOMERS]: "View Customers",
  [PERMISSIONS.INVENTORY]: "View Inventory Logs",
  [PERMISSIONS.ANALYTICS]: "View Pixel Analytics",
  [PERMISSIONS.ROLES]: "Manage Roles & Permissions",
  [PERMISSIONS.USERS]: "Manage Users",
};

export default function AdminRolesPage() {
  const { isSuperAdmin, hasPermission } = useAuth();
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [editPermissions, setEditPermissions] = useState([]);
  const [newRole, setNewRole] = useState({ id: "", name: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesData, usersData] = await Promise.all([
        db.getRoles(),
        db.getAllUsers(),
      ]);
      setRoles(rolesData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectRole = (role) => {
    setSelectedRole(role);
    setEditPermissions(
      role.permissions.includes("*")
        ? [...ALL_PERMISSIONS]
        : [...role.permissions],
    );
    setMessage("");
    setError("");
  };

  const togglePermission = (perm) => {
    setEditPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm],
    );
  };

  const saveRolePermissions = async () => {
    if (!selectedRole || selectedRole.id === "superadmin") return;
    setSaving(true);
    setError("");
    try {
      await db.updateRole(selectedRole.id, { permissions: editPermissions });
      setMessage(`Permissions updated for ${selectedRole.name}`);
      await loadData();
      setSelectedRole((prev) => ({ ...prev, permissions: editPermissions }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const createRole = async (e) => {
    e.preventDefault();
    if (!newRole.id.trim() || !newRole.name.trim()) {
      setError("Role ID and name are required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const created = await db.createRole({
        id: newRole.id,
        name: newRole.name,
        permissions: [],
      });
      if (!created) {
        setError("Role ID already exists");
        return;
      }
      setNewRole({ id: "", name: "" });
      setMessage(`Role "${created.name}" created`);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteRole = async (roleId) => {
    if (!confirm("Delete this role? It must not be assigned to any user."))
      return;
    setSaving(true);
    try {
      const ok = await db.deleteRole(roleId);
      if (!ok) {
        setError("Cannot delete system roles or roles assigned to users");
        return;
      }
      setSelectedRole(null);
      setMessage("Role deleted");
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const assignUserRole = async (uuid, roleId) => {
    setSaving(true);
    setError("");
    try {
      await db.updateUserRole(uuid, roleId);
      setMessage("User role updated");
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isSuperAdmin && !hasPermission(PERMISSIONS.ROLES)) {
    return (
      <div className="text-center py-16 text-gray-500">
        You do not have permission to manage roles.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E1A926]" />
      </div>
    );
  }

  return (
    <div className="text-black space-y-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold font-serif text-black">
          Roles & Permissions
        </h1>
        <p className="text-xs text-gray-500">
          Super admins can create roles, assign permissions, and change user
          access levels.
        </p>
      </div>

      {(message || error) && (
        <div
          className={`px-4 py-3 rounded-xl text-sm ${error ? "bg-red-50 text-red-700 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"}`}
        >
          {error || message}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Role list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-black text-sm">Roles</h2>
          <div className="space-y-2">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => selectRole(role)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  selectedRole?.id === role.id
                    ? "border-[#E1A926] bg-[#E1A926]/5"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <span className="font-semibold text-gray-800 block">
                  {role.name}
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                  {role.id}
                  {role.isSystem ? " · system" : ""}
                </span>
              </button>
            ))}
          </div>

          {isSuperAdmin && (
            <form
              onSubmit={createRole}
              className="pt-4 border-t border-gray-100 space-y-3"
            >
              <h3 className="text-xs font-bold text-gray-500 uppercase">
                New Role
              </h3>
              <input
                value={newRole.id}
                onChange={(e) =>
                  setNewRole((p) => ({ ...p, id: e.target.value }))
                }
                placeholder="role_id (e.g. warehouse)"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg"
              />
              <input
                value={newRole.name}
                onChange={(e) =>
                  setNewRole((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Display name"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg"
              />
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary w-full py-2 text-xs"
              >
                Add Role
              </button>
            </form>
          )}
        </div>

        {/* Permission editor */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          {selectedRole ? (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-black">
                    {selectedRole.name}
                  </h2>
                  <p className="text-xs text-gray-400">ID: {selectedRole.id}</p>
                </div>
                {isSuperAdmin && !selectedRole.isSystem && (
                  <button
                    type="button"
                    onClick={() => deleteRole(selectedRole.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete role
                  </button>
                )}
              </div>

              {selectedRole.id === "superadmin" ? (
                <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
                  Super Admin has full access to all features. Permissions
                  cannot be edited.
                </p>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {ALL_PERMISSIONS.map((perm) => (
                      <label
                        key={perm}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={editPermissions.includes(perm)}
                          onChange={() => togglePermission(perm)}
                          disabled={!isSuperAdmin}
                        />
                        <span className="text-xs text-gray-700">
                          {PERMISSION_LABELS[perm] || perm}
                        </span>
                      </label>
                    ))}
                  </div>
                  {isSuperAdmin && (
                    <button
                      type="button"
                      onClick={saveRolePermissions}
                      disabled={saving}
                      className="btn btn-primary py-2.5 px-6 text-xs"
                    >
                      Save Permissions
                    </button>
                  )}
                </>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400 py-8 text-center">
              Select a role to view or edit its permissions
            </p>
          )}
        </div>
      </div>

      {/* User role assignment */}
      {isSuperAdmin && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-black text-sm">
            Assign User Roles
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px]">
                  <th className="py-2">User</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Current Role</th>
                  <th className="py-2 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.uuid}>
                    <td className="py-3 font-semibold text-gray-800">
                      {u.name}
                    </td>
                    <td className="py-3 text-gray-500">{u.email}</td>
                    <td className="py-3">
                      <span className="bg-[#E1A926]/10 text-[#E1A926] px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        {u.roleId}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={u.roleId}
                        onChange={(e) => assignUserRole(u.uuid, e.target.value)}
                        disabled={saving || u.roleId === "superadmin"}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5"
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
