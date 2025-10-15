import { Link } from "lucide-react";

  const apiDocumentationPage = () =>{
  const section = {
    id: "integration",
    name: "Integration & Data Linking",
    icon: <Link className="w-7 h-7 text-purple-500" />,
    description:
      "Endpoints for aggregating, joining, and pivot-linking multiple data resources — such as Users, Orders, and Parcels — to generate unified analytics and reports.",
    endpoints: [
      {
        method: "GET",
        path: "/api/aggregate/user-parcels",
        title: "Aggregate User Parcels",
        desc: "Aggregates parcel and user information in one response using MongoDB $lookup.",
        parameters: [
          { name: "Authorization", type: "header", required: true, desc: "Bearer token" },
          { name: "userId", type: "query", required: false, desc: "Filter by user ID" },
        ],
        example: {
          request: `GET /api/aggregate/user-parcels?userId=65afbd9c...`,
          response: `[{"user":{"id":"65afbd9c...","name":"John Doe","email":"john@example.com"},"parcels":[{"trackingId":"TRK001","status":"Delivered","weight":1.2},{"trackingId":"TRK002","status":"In Transit","weight":2.5}]}]`,
        },
      },
      {
        method: "GET",
        path: "/api/aggregate/admin-dashboard",
        title: "Admin Analytics (Pivot)",
        desc: "Combines all users, parcels, and delivery agents into a single pivot table for admin dashboard analytics.",
        parameters: [
          { name: "Authorization", type: "header", required: true, desc: "Admin token" },
        ],
        example: {
          response: `{"totalUsers":2350,"totalParcels":5890,"averageDeliveryTime":"2.3 days","topRegions":[{"region":"Dhaka","count":1980},{"region":"Chittagong","count":1420}],"agentPerformance":[{"agent":"Ahsan","deliveries":340,"rating":4.9},{"agent":"Rafiq","deliveries":290,"rating":4.7}]}`,
        },
      },
      {
        method: "POST",
        path: "/api/integrations/webhook",
        title: "Create Webhook Integration",
        desc: "Registers a new webhook to automatically receive updates when parcel status changes.",
        parameters: [
          { name: "url", type: "string", required: true, desc: "Webhook endpoint URL" },
          { name: "event", type: "string", required: true, desc: "Event type (e.g., parcel.updated)" },
        ],
        example: {
          request: `{"url":"https://example.com/webhook","event":"parcel.updated"}`,
          response: `{"message":"Webhook registered successfully","id":"wh_9823hdx..."}`,
        },
      },
      {
        method: "GET",
        path: "/api/integrations/status",
        title: "Check Integration Health",
        desc: "Verifies that the connected API or webhook is working correctly.",
        example: {
          response: `{"status":"healthy","lastChecked":"2025-10-14T18:00:00Z"}`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-14 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-3">
            {section.icon}
            <h1 className="text-4xl font-extrabold text-purple-600 dark:text-purple-400">
              {section.name}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {section.description}
          </p>
        </div>

        {/* Endpoints */}
        <div className="space-y-10">
          {section.endpoints.map((ep, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-sm bg-purple-600 text-white px-2 py-1 rounded">
                  {ep.method}
                </span>
                <span className="font-mono text-gray-700 dark:text-gray-300 text-sm">
                  {ep.path}
                </span>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                {ep.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-5">{ep.desc}</p>

              {ep.parameters && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Parameters
                  </h4>
                  <table className="w-full text-sm border border-gray-300 dark:border-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Type</th>
                        <th className="p-2 border">Required</th>
                        <th className="p-2 border">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ep.parameters.map((param, idx) => (
                        <tr key={idx}>
                          <td className="p-2 border">{param.name}</td>
                          <td className="p-2 border">{param.type}</td>
                          <td className="p-2 border">{param.required ? "Yes" : "No"}</td>
                          <td className="p-2 border">{param.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {ep.example && (
                <div className="space-y-3 text-sm">
                  {ep.example.request && (
                    <div>
                      <p className="font-semibold">Request:</p>
                      <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md overflow-x-auto">
                        {ep.example.request}
                      </pre>
                    </div>
                  )}
                  {ep.example.response && (
                    <div>
                      <p className="font-semibold">Response:</p>
                      <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md overflow-x-auto">
                        {ep.example.response}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default apiDocumentationPage