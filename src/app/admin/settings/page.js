"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/db";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const s = await db.getSettings();
        if (!mounted) return;
        setSettings(s || {});
      } catch (err) {
        console.error(err);
        setError("Failed to load settings");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      // parse deliveryZones if it's JSON
      const payload = {
        deliveryFees: Number(settings.deliveryFees) || 0,
        loyaltyPointsPerLKR: Number(settings.loyaltyPointsPerLKR) || 0,
      };

      try {
        payload.deliveryZones = settings.deliveryZones
          ? JSON.parse(settings.deliveryZones)
          : [];
      } catch (e) {
        // if parsing fails, keep as string
        payload.deliveryZones = settings.deliveryZones || [];
      }

      const updated = await db.updateSettings(payload);
      setSettings((prev) => ({ ...prev, ...updated }));
      alert("Settings saved");
    } catch (err) {
      console.error(err);
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-black">Settings</h1>
          <p className="text-xs text-gray-500">
            Application-wide configurable values
          </p>
        </div>
      </div>

      {error && <div className="text-sm text-red-500 mb-3">{error}</div>}

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600">
              Delivery Fees (LKR)
            </label>
            <input
              type="number"
              value={settings?.deliveryFees ?? 0}
              onChange={(e) =>
                setSettings({ ...settings, deliveryFees: e.target.value })
              }
              className="text-black w-full p-2.5 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600">
              Loyalty Points per LKR
            </label>
            <input
              type="number"
              value={settings?.loyaltyPointsPerLKR ?? 0}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  loyaltyPointsPerLKR: e.target.value,
                })
              }
              className=" text-black w-full p-2.5 border border-gray-200 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600">
            Delivery Zones (JSON)
          </label>
          <textarea
            value={
              typeof settings?.deliveryZones === "string"
                ? settings.deliveryZones
                : JSON.stringify(settings?.deliveryZones || [], null, 2)
            }
            onChange={(e) =>
              setSettings({ ...settings, deliveryZones: e.target.value })
            }
            rows={6}
            className="w-full p-2.5 border text-black border-gray-200 rounded-lg font-mono text-xs"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Enter an array of zone objects or simple JSON
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => window.location.reload()}
            className="btn btn-outline py-2 px-4 text-xs"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary py-2 px-4 text-xs"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
