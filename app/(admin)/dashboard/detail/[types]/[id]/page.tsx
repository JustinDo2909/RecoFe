"use client"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DetailPage = () => {
  const router = useRouter();
  const { type, data: rawData } = router.query;

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (rawData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(rawData as string));
        setData(parsed);
      } catch{
      }
    }
  }, [rawData]);

  if (!data) return <div className="p-6 text-gray-600">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl mt-8">
      <h1 className="text-2xl font-bold mb-6 capitalize">{type} Detail</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="border p-4 rounded-lg bg-gray-50">
            <div className="text-gray-500 text-sm">{formatKey(key)}</div>
            <div className="text-gray-900 font-medium break-words">
              {formatValue(value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Utility formatting
const formatKey = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatValue = (value: any) => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}/))
    return new Date(value).toLocaleDateString();
  return String(value);
};

export default DetailPage;
