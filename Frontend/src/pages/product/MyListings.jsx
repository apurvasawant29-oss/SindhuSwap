import { Link } from "react-router-dom";
import { FiEdit3, FiEye, FiPlus, FiShoppingBag, FiTrendingUp } from "react-icons/fi";
import PageShell from "../../components/common/PageShell";
import ProductCard from "../../components/cards/ProductCard";
import products from "../../data/products";

const myListings = products.slice(0, 6);

function MyListings() {
  return (
    <PageShell>
      <section className="container py-10">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <span className="eyebrow"><FiShoppingBag /> Seller Workspace</span>
              <h1 className="mt-4 mb-2 text-3xl font-black text-slate-900">My Products</h1>
              <p className="text-sm text-slate-500 font-medium max-w-2xl">
                Manage your active listings, track visibility, and add new products without leaving the SindhuSwap flow.
              </p>
            </div>
            <Link className="btn btn--primary" to="/add-product"><FiPlus /> Add Product</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { label: "Active Listings", value: myListings.length, icon: FiShoppingBag },
              { label: "Total Views", value: "2.4k", icon: FiEye },
              { label: "Swap Leads", value: 18, icon: FiTrendingUp },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <article key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <Icon className="text-teal-600 h-5 w-5 mb-3" />
                  <strong className="block text-2xl font-black text-slate-900">{stat.value}</strong>
                  <span className="text-xs font-bold text-slate-500">{stat.label}</span>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-slate-900">Current Listings</h2>
          <Link to="/profile" className="text-sm font-bold text-teal-700 hover:underline"><FiEdit3 className="inline mr-1" /> Profile</Link>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export default MyListings;
