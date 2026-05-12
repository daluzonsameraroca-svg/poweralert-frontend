import { useEffect, useState } from "react";

const API = "https://psgc.cloud/api";

export default function LocationSelector({ form, setForm }) {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  useEffect(() => {
    fetch(`${API}/regions`)
      .then((res) => res.json())
      .then(setRegions);
  }, []);

  function updateForm(data) {
    setForm((prev) => ({ ...prev, ...data }));
  }

  async function handleRegion(e) {
    const code = e.target.value;
    const selected = regions.find((r) => r.code === code);

    updateForm({
      region: selected?.name || "",
      region_code: code,
      province: "",
      province_code: "",
      municipality: "",
      municipality_code: "",
      barangay: "",
      barangay_code: "",
    });

    const res = await fetch(`${API}/regions/${code}/provinces`);
    setProvinces(await res.json());
    setMunicipalities([]);
    setBarangays([]);
  }

  async function handleProvince(e) {
    const code = e.target.value;
    const selected = provinces.find((p) => p.code === code);

    updateForm({
      province: selected?.name || "",
      province_code: code,
      municipality: "",
      municipality_code: "",
      barangay: "",
      barangay_code: "",
    });

    const res = await fetch(`${API}/provinces/${code}/cities-municipalities`);
    setMunicipalities(await res.json());
    setBarangays([]);
  }

  async function handleMunicipality(e) {
    const code = e.target.value;
    const selected = municipalities.find((m) => m.code === code);

    updateForm({
      municipality: selected?.name || "",
      municipality_code: code,
      barangay: "",
      barangay_code: "",
    });

    const res = await fetch(`${API}/cities-municipalities/${code}/barangays`);
    setBarangays(await res.json());
  }

  function handleBarangay(e) {
    const code = e.target.value;
    const selected = barangays.find((b) => b.code === code);

    updateForm({
      barangay: selected?.name || "",
      barangay_code: code,
    });
  }

  return (
    <div className="form-grid">
      <select value={form.region_code || ""} onChange={handleRegion} required>
        <option value="">Select Region</option>
        {regions.map((r) => (
          <option key={r.code} value={r.code}>{r.name}</option>
        ))}
      </select>

      <select value={form.province_code || ""} onChange={handleProvince} disabled={!form.region_code} required>
        <option value="">Select Province</option>
        {provinces.map((p) => (
          <option key={p.code} value={p.code}>{p.name}</option>
        ))}
      </select>

      <select value={form.municipality_code || ""} onChange={handleMunicipality} disabled={!form.province_code} required>
        <option value="">Select City / Municipality</option>
        {municipalities.map((m) => (
          <option key={m.code} value={m.code}>{m.name}</option>
        ))}
      </select>

      <select value={form.barangay_code || ""} onChange={handleBarangay} disabled={!form.municipality_code} required>
        <option value="">Select Barangay</option>
        {barangays.map((b) => (
          <option key={b.code} value={b.code}>{b.name}</option>
        ))}
      </select>
    </div>
  );
}