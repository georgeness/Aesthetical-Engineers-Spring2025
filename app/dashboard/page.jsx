"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (!isLoggedIn) {
      router.push('/login'); // redirect if not logged in
    }
  }, [router]);

  return (
    <section className="w-full min-h-screen bg-gray-50 flex flex-col items-center pt-20">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button className="bg-blue-500 text-white px-6 py-3 rounded-full shadow hover:bg-blue-600">Add Painting</button>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-full shadow hover:bg-blue-600">Remove Painting</button>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-full shadow hover:bg-blue-600">Order Paintings</button>
        <button className="bg-green-500 text-white px-6 py-3 rounded-full shadow hover:bg-green-600">Add Award</button>
        <button className="bg-green-500 text-white px-6 py-3 rounded-full shadow hover:bg-green-600">Remove Award</button>
        <button className="bg-green-500 text-white px-6 py-3 rounded-full shadow hover:bg-green-600">Order Awards</button>
      </div>
    </section>
  );
};

export default Dashboard;
