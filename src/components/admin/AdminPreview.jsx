import { ArrowUpRight, Mountain, Settings2 } from "lucide-react";
import { ADMIN_BOOKINGS, ADMIN_NAV, ADMIN_STATS } from "../../data/admin";

export default function AdminPreview({ open, onToggle }) {
  return (
    <section className="admin-preview" id="admin-preview" aria-labelledby="admin-heading">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="kicker">
              <Settings2 size={14} aria-hidden="true" /> Built for the business too
            </div>
            <h2 id="admin-heading">One view of the whole fleet.</h2>
            <p className="section-sub">
              A preview of the admin portal planned for booking operations, vehicle management and
              reporting.
            </p>
          </div>
          <button className="btn btn-light" onClick={onToggle} aria-expanded={open}>
            {open ? "Hide admin preview" : "Preview admin portal"}{" "}
            <ArrowUpRight size={15} aria-hidden="true" />
          </button>
        </div>
        {open && (
          <div className="admin-shell">
            <aside className="admin-side" aria-label="Admin preview navigation">
              <div className="brand">
                <span className="brand-mark" aria-hidden="true">
                  <Mountain size={19} />
                </span>
                <span>
                  SHILLONG RIDE<small>ADMIN PORTAL</small>
                </span>
              </div>
              <div className="admin-nav">
                {ADMIN_NAV.map((item, i) => (
                  <span key={item} aria-current={i === 0 ? "page" : undefined}>
                    {item}
                  </span>
                ))}
              </div>
            </aside>
            <div className="admin-main">
              <div className="admin-top">
                <div>
                  <h3>Business overview</h3>
                  <p>Illustrative demo dashboard · Sample figures only</p>
                </div>
                <span className="status">Prototype</span>
              </div>
              <div className="admin-stats">
                {ADMIN_STATS.map((s) => (
                  <div className="admin-stat" key={s.label}>
                    <small>{s.label}</small>
                    <strong>{s.value}</strong>
                    <em>Demo data</em>
                  </div>
                ))}
              </div>
              <div className="table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th scope="col">Booking ID</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Vehicle</th>
                      <th scope="col">Dates</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ADMIN_BOOKINGS.map((b) => (
                      <tr key={b.id}>
                        <td>{b.id}</td>
                        <td>{b.customer}</td>
                        <td>{b.vehicle}</td>
                        <td>{b.dates}</td>
                        <td>
                          <span className="status">{b.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
