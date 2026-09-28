import React, { useMemo, useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Package, Sparkles, Plus, Trash2, Pencil, AlertTriangle } from 'lucide-react';

const emptyForm = {
  name: '',
  category: 'General',
  description: '',
  purchase_price: '0',
  selling_price: '0',
  stock_quantity: '0',
  minimum_stock: '0',
  supplier: ''
};

export const ProductIntelligence: React.FC = () => {
  const { products, lowStockProducts, addProduct, updateProduct, deleteProduct, fetchProducts, fetchLowStockProducts } = useBusiness();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const lowStockCount = useMemo(() => lowStockProducts.length, [lowStockProducts]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      category: form.category,
      description: form.description,
      purchase_price: Number(form.purchase_price),
      selling_price: Number(form.selling_price),
      stock_quantity: Number(form.stock_quantity),
      minimum_stock: Number(form.minimum_stock),
      supplier: form.supplier,
      costPrice: Number(form.purchase_price),
      sellingPrice: Number(form.selling_price),
      currentStock: Number(form.stock_quantity),
      reorderPoint: Number(form.minimum_stock)
    };

    if (editingId) {
      await updateProduct(editingId, payload);
    } else {
      await addProduct(payload);
    }

    setForm(emptyForm);
    setEditingId(null);
    setSaving(false);
    await fetchProducts();
    await fetchLowStockProducts();
  };

  const handleEdit = (product: typeof products[number]) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      description: product.description || '',
      purchase_price: String(product.purchase_price ?? product.costPrice ?? 0),
      selling_price: String(product.selling_price ?? product.sellingPrice ?? 0),
      stock_quantity: String(product.stock_quantity ?? product.currentStock ?? 0),
      minimum_stock: String(product.minimum_stock ?? product.reorderPoint ?? 0),
      supplier: product.supplier || ''
    });
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    await fetchProducts();
    await fetchLowStockProducts();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-electric-400" /> Product Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Product catalogue, margin health, and live low-stock watchlist from the database.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 inline-block mr-1" /> {lowStockCount} low stock
          </span>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 p-5">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="rounded-xl border border-white/10 bg-navy-950 px-3 py-2 text-sm text-white" required />
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="rounded-xl border border-white/10 bg-navy-950 px-3 py-2 text-sm text-white" required />
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="rounded-xl border border-white/10 bg-navy-950 px-3 py-2 text-sm text-white" />
          <input type="number" value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: e.target.value })} placeholder="Purchase price" className="rounded-xl border border-white/10 bg-navy-950 px-3 py-2 text-sm text-white" min="0" step="0.01" required />
          <input type="number" value={form.selling_price} onChange={(e) => setForm({ ...form, selling_price: e.target.value })} placeholder="Selling price" className="rounded-xl border border-white/10 bg-navy-950 px-3 py-2 text-sm text-white" min="0" step="0.01" required />
          <div className="md:col-span-3 xl:col-span-2 flex gap-2">
            <input type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} placeholder="Stock" className="flex-1 rounded-xl border border-white/10 bg-navy-950 px-3 py-2 text-sm text-white" min="0" required />
            <input type="number" value={form.minimum_stock} onChange={(e) => setForm({ ...form, minimum_stock: e.target.value })} placeholder="Min stock" className="flex-1 rounded-xl border border-white/10 bg-navy-950 px-3 py-2 text-sm text-white" min="0" required />
            <input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} placeholder="Supplier" className="flex-1 rounded-xl border border-white/10 bg-navy-950 px-3 py-2 text-sm text-white" />
            <button type="submit" disabled={saving} className="inline-flex items-center justify-center rounded-xl bg-electric-500 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">
              <Plus className="w-3.5 h-3.5 mr-1" /> {saving ? 'Saving...' : editingId ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((prod) => (
          <div key={prod.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400">{prod.sku || prod.category} • {prod.category}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{prod.name}</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(prod)} className="p-2 rounded-lg border border-white/10 bg-navy-900 text-slate-300 hover:text-white"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(prod.id)} className="p-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:text-white"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-navy-950 p-3 rounded-xl text-xs border border-white/5">
              <div>
                <div className="text-[10px] text-slate-400">Selling Price</div>
                <div className="font-bold text-white">₹{Number(prod.selling_price ?? prod.sellingPrice ?? 0).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Cost Price</div>
                <div className="font-bold text-slate-300">₹{Number(prod.purchase_price ?? prod.costPrice ?? 0).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Stock</div>
                <div className="font-extrabold text-emerald-400">{Number(prod.stock_quantity ?? prod.currentStock ?? 0)}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-electric-500/10 border border-electric-500/20 text-xs space-y-1">
              <div className="font-bold text-electric-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> IQ INSIGHT
              </div>
              <p className="text-slate-300 leading-relaxed">
                {prod.description || 'Live inventory and margin data is synced to the ProfitIQ database.'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
