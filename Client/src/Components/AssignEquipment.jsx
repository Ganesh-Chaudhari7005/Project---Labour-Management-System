import React, { useEffect, useState } from "react";

export default function AssignEquipment() {
  const [labours, setLabours] = useState([]);
  const [equipments, setEquipments] = useState([]);

  const [formData, setFormData] = useState({
    labour_id: "",
    equipment_id: "",
    quantity: "",
  });

  const [stock, setStock] = useState({
    total: 0,
    available: 0,
  });

  // Fetch labours
  useEffect(() => {
    fetch("/labours")
      .then((res) => res.json())
      .then((data) => setLabours(data));
  }, []);

  // Fetch equipments (with stock info)
  useEffect(() => {
    fetch("/equipment/stock")
      .then((res) => res.json())
      .then((data) => setEquipments(data));
  }, []);

  // Update stock when equipment changes
  useEffect(() => {
    if (formData.equipment_id) {
      const selected = equipments.find((e) => e.id == formData.equipment_id);

      if (selected) {
        setStock({
          total: selected.total_quantity,
          available: selected.available_quantity,
        });
      }
    }
  }, [formData.equipment_id, equipments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.labour_id || !formData.equipment_id || !formData.quantity) {
      alert("Fill all fields");
      return;
    }

    if (formData.quantity > stock.available) {
      alert("Not enough stock available");
      return;
    }

    fetch("/equipment/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Assigned successfully");
        setFormData({
          labour_id: "",
          equipment_id: "",
          quantity: "",
        });
      });
  };

  return (
    <div className="eq-assign-container p-2 py-4">
      <div className="eq-assign-card">
        {/* Header */}
        <div className="eq-assign-header">
          <h2>Assign Equipment</h2>
          <p>Assign tools to labours and track usage</p>
        </div>

        <div className="eq-assign-content">
          {/* FORM */}
          <form className="eq-assign-form" onSubmit={handleSubmit}>
            {/* Labour */}
            <div className="eq-assign-group">
              <label>Select Labour</label>
              <select
                name="labour_id"
                value={formData.labour_id}
                onChange={handleChange}
              >
                <option value="">-- Select Labour --</option>
                {labours.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Equipment */}
            <div className="eq-assign-group">
              <label>Select Equipment</label>
              <select
                name="equipment_id"
                value={formData.equipment_id}
                onChange={handleChange}
              >
                <option value="">-- Select Equipment --</option>
                {equipments.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="eq-assign-group">
              <label>Quantity to Assign</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="eq-assign-btn-row">
              <button type="submit" className="eq-assign-btn">
                Assign Equipment
              </button>
            </div>
          </form>

          {/* SUMMARY */}
          <div className="eq-assign-summary">
            <h3>Stock Info</h3>

            <div className="eq-assign-box">
              <span>Total</span>
              <strong>{stock.total}</strong>
            </div>

            <div className="eq-assign-box">
              <span>Available</span>
              <strong>{stock.available}</strong>
            </div>

            <div className="eq-assign-tip">
              Only available stock can be assigned.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
