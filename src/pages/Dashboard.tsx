import Layout from "@/components/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Toplam Değerlendirme</p>
          <h2 className="text-3xl font-bold">42</h2>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Ortalama Puan</p>
          <h2 className="text-3xl font-bold">4.1</h2>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Aktif Kullanıcı</p>
          <h2 className="text-3xl font-bold">15</h2>
        </div>
      </div>
    </Layout>
  );
}
