import { useEffect, useState } from "react";
import axios from "axios";


function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: 0,
    name: "",
    price: 0,
    customImage: "",
  });
  const [editingId, setEditingId] = useState(null);

  // load products
  useEffect(() => {
    axios.get("https://ecommerce-store-backend-production-2c67.up.railway.app/Products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "id" || name === "price" ? Number(value) : value,
    });
  };

  // Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId !== null) {
      // update
      await axios.put(`https://ecommerce-store-backend-production-2c67.up.railway.app/Products/${editingId}`, form);

      setProducts(
        products.map((p) => (p.id === editingId ? { ...p, ...form } : p))
      );
      setEditingId(null);
    } else {
      // create
      const res = await axios.post("https://ecommerce-store-backend-production-2c67.up.railway.app/Products", form);
      setProducts([...products, res.data]);
    }

    // reset form
    setForm({ id: 0, name: "", price: 0, customImage: "" });
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://ecommerce-store-backend-production-2c67.up.railway.app/Products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Edit
  const handleEdit = (p) => {
    setForm({ ...p });
    setEditingId(p.id);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <input
          type="number"
          name="id"
          placeholder="Product id"
          value={form.id}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="customImage"
          placeholder="Image URL"
          value={form.customImage}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId !== null ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {products.map((p) => (
          <div key={p.id} className="bg-white shadow-md rounded-lg p-4">
            <img
              src={
                p.customImage && p.customImage.trim() !== ""
                  ? p.customImage
                  : "https://via.placeholder.com/150"
              }
              alt={p.name}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="text-gray-600">Price: Rs {p.price}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(p)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
