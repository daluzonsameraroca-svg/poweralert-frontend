import { useEffect, useState } from "react";

const API = "https://psgc.cloud/api";

export default function LocationSelector({ form = {}, setForm }) {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  useEffect(() => {
    fetch(`${API}/regions`)
      .then((res) => res.json())
      .then((data) => setRegions(Array.isArray(data) ? data : []))
      .catch(() => setRegions([]));
  }, []);

  function updateForm(data) {
    if (!setForm) return;

    setForm((prev) => ({
      ...(prev || {}),
      ...data,
    }));
  }

  async function handleRegion(e) {
    const code = e.target.value;
    const selected = regions.find((item) => item.code === code);

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

    setProvinces([]);
    setMunicipalities([]);
    setBarangays([]);

    if (!code) return;

    try {
      const res = await fetch(`${API}/regions/${code}/provinces`);
      const data = await res.json();
      setProvinces(Array.isArray(data) ? data : []);
    } catch {
      setProvinces([]);
    }
  }

  async function handleProvince(e) {
    const code = e.target.value;
    const selected = provinces.find((item) => item.code === code);

    updateForm({
      province: selected?.name || "",
      province_code: code,
      municipality: "",
      municipality_code: "",
      barangay: "",
      barangay_code: "",
    });

    setMunicipalities([]);
    setBarangays([]);

    if (!code) return;

    try {
      const res = await fetch(`${API}/provinces/${code}/cities-municipalities`);
      const data = await res.json();
      setMunicipalities(Array.isArray(data) ? data : []);
    } catch {
      setMunicipalities([]);
    }
  }

  async function handleMunicipality(e) {
    const code = e.target.value;
    const selected = municipalities.find((item) => item.code === code);

    updateForm({
      municipality: selected?.name || "",
      municipality_code: code,
      barangay: "",
      barangay_code: "",
    });

    setBarangays([]);

    if (!code) return;

    try {
      const res = await fetch(`${API}/cities-municipalities/${code}/barangays`);
      const data = await res.json();
      setBarangays(Array.isArray(data) ? data : []);
    } catch {
      setBarangays([]);
    }
  }

  function handleBarangay(e) {
    const code = e.target.value;
    const selected = barangays.find((item) => item.code === code);

    updateForm({
      barangay: selected?.name || "",
      barangay_code: code,
    });
  }

  return (
    <div className="form-grid">
      <select value={form.region_code || ""} onChange={handleRegion} required>
        <option value="">Select Region</option>
        {regions.map((region) => (
          <option key={region.code} value={region.code}>
            {region.name}
          </option>
        ))}
      </select>

      <select
        value={form.province_code || ""}
        onChange={handleProvince}
        disabled={!form.region_code}
        required
      >
        <option value="">Select Province</option>
        {provinces.map((province) => (
          <option key={province.code} value={province.code}>
            {province.name}
          </option>
        ))}
      </select>

      <select
        value={form.municipality_code || ""}
        onChange={handleMunicipality}
        disabled={!form.province_code}
        required
      >
        <option value="">Select City / Municipality</option>
        {municipalities.map((municipality) => (
          <option key={municipality.code} value={municipality.code}>
            {municipality.name}
          </option>
        ))}
      </select>

      <select
        value={form.barangay_code || ""}
        onChange={handleBarangay}
        disabled={!form.municipality_code}
        required
      >
        <option value="">Select Barangay</option>
        {barangays.map((barangay) => (
          <option key={barangay.code} value={barangay.code}>
            {barangay.name}
          </option>
        ))}
      </select>
    </div>
  );
}