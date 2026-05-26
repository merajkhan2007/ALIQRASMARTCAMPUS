"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, RotateCcw, ShieldCheck, ShieldOff } from "lucide-react";
import { updateRolePermissions, seedDefaultPermissions } from "./actions";

interface PermissionToggle {
  feature: string;
  enabled: boolean;
}

interface PermissionsClientProps {
  features: string[];
  featureLabels: Record<string, string>;
  initialPermissions: Record<string, Record<string, boolean>>;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
  PARENT: "Parent",
  ACCOUNTANT: "Accountant",
  COOK: "Cook",
  KHADIM: "Khadim",
  HAFIZ: "Hafiz",
};

const ROLE_BADGE_CLASSES: Record<string, string> = {
  ADMIN: "bg-blue-100 text-blue-800 border-blue-200",
  TEACHER: "bg-emerald-100 text-emerald-800 border-emerald-200",
  STUDENT: "bg-amber-100 text-amber-800 border-amber-200",
  PARENT: "bg-orange-100 text-orange-800 border-orange-200",
  ACCOUNTANT: "bg-cyan-100 text-cyan-800 border-cyan-200",
  COOK: "bg-rose-100 text-rose-800 border-rose-200",
  KHADIM: "bg-indigo-100 text-indigo-800 border-indigo-200",
  HAFIZ: "bg-teal-100 text-teal-800 border-teal-200",
};

export function PermissionsClient({
  features,
  featureLabels,
  initialPermissions,
}: PermissionsClientProps) {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [selectedRole, setSelectedRole] = useState<string>("ADMIN");
  const [isPending, startTransition] = useTransition();
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const roles = Object.keys(ROLE_LABELS);

  // Ensure every role has entries for all features
  const currentPerms = permissions[selectedRole] || {};

  const handleToggle = (feature: string) => {
    setPermissions((prev) => {
      const rolePerms = { ...(prev[selectedRole] || {}) };
      rolePerms[feature] = !rolePerms[feature];
      return { ...prev, [selectedRole]: rolePerms };
    });
    setSaveMsg(null);
  };

  const handleToggleAll = (enable: boolean) => {
    setPermissions((prev) => {
      const rolePerms: Record<string, boolean> = {};
      for (const f of features) {
        rolePerms[f] = enable;
      }
      return { ...prev, [selectedRole]: rolePerms };
    });
    setSaveMsg(null);
  };

  const handleSave = () => {
    setSaveMsg(null);
    const toggles: PermissionToggle[] = [];
    const rolePerms = permissions[selectedRole] || {};

    // Include all features (even unset ones default to false)
    for (const f of features) {
      toggles.push({
        feature: f,
        enabled: rolePerms[f] === true,
      });
    }

    startTransition(async () => {
      const res = await updateRolePermissions(selectedRole, toggles);
      if (res.success) {
        setSaveMsg("Saved successfully!");
        setTimeout(() => setSaveMsg(null), 3000);
      } else if (res.error) {
        setSaveMsg(`Error: ${res.error}`);
      }
    });
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    try {
      const res = await seedDefaultPermissions();
      if (res.success) {
        // Reload page to reflect fresh data
        window.location.reload();
      }
    } finally {
      setSeeding(false);
    }
  };

  const enabledCount = Object.values(currentPerms).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Role Selector Tabs */}
      <div className="bg-white p-3 rounded-xl border border-gray-200/60 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-gray-500 mr-2">Role:</span>
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => {
                setSelectedRole(role);
                setSaveMsg(null);
              }}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                selectedRole === role
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Badge className={`mr-1.5 font-semibold border shadow-sm ${ROLE_BADGE_CLASSES[role]}`}>
                {ROLE_LABELS[role]}
              </Badge>
            </button>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToggleAll(true)}
              className="text-emerald-600 hover:bg-emerald-50 border-emerald-200"
            >
              <ShieldCheck className="w-4 h-4 mr-1" /> Enable All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToggleAll(false)}
              className="text-red-600 hover:bg-red-50 border-red-200"
            >
              <ShieldOff className="w-4 h-4 mr-1" /> Disable All
            </Button>
            <span className="text-sm text-gray-500 ml-2">
              <span className="font-semibold text-purple-600">{enabledCount}</span>/{features.length} enabled
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="text-gray-600"
            >
              {seeding ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <RotateCcw className="w-4 h-4 mr-1" />
              )}
              Reset to Defaults
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isPending}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
        {saveMsg && (
          <div
            className={`mt-3 p-2 rounded-lg text-sm font-medium text-center ${
              saveMsg.startsWith("Error")
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-emerald-50 text-emerald-600 border border-emerald-200"
            }`}
          >
            {saveMsg}
          </div>
        )}
      </div>

      {/* Permissions Grid */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
          {features.map((feature) => {
            const isEnabled = currentPerms[feature] === true;
            return (
              <div
                key={feature}
                className={`bg-white p-5 transition-colors ${
                  isEnabled ? "hover:bg-emerald-50/50" : "hover:bg-red-50/30"
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => handleToggle(feature)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-sm font-semibold block ${
                        isEnabled ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {featureLabels[feature] || feature}
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5 block">
                      {feature}
                    </span>
                  </div>
                  <Badge
                    className={`font-semibold shadow-sm ${
                      isEnabled
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-500 border-red-200"
                    }`}
                  >
                    {isEnabled ? "ON" : "OFF"}
                  </Badge>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}