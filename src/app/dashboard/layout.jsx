// app/dashboard/layout.jsx
export default function layout({ children }) {
  return (
    <div className="dashboard-layout">
      <h2>Dashboard</h2>
      <nav>
        <a href="/dashboard">Overview</a>
        <a href="/dashboard/profile">Profile</a>
      </nav>
      <div className="dashboard-content">
        {children}  {/* This displays the profile page */}
      </div>
    </div>
  )
}