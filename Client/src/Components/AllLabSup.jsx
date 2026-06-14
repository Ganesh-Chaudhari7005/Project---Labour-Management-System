import React, { useEffect, useState } from "react";
import { ApiRoute } from "./ApiConfig";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
export default function AllLabSup() {
  const [LabDet, setLabDet] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const labourTypes = [
    ...new Set((LabDet.list || []).map((item) => item.LabType)),
  ];

  const sites = [
    ...new Set((LabDet.list || []).map((item) => item.ProjectName)),
  ];
  const ID = sessionStorage.getItem("SupId");
  const getLabourListSupAllocated = async () => {
    try {
      setLoading(true);

      const reqList = await fetch(`${ApiRoute}get-all-sup-site-labs/${ID}`);

      const res = await reqList.json();

      setLabDet(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLabours = (LabDet.list || []).filter((item) => {
    const matchesSearch =
      item.Name?.toLowerCase().includes(search.toLowerCase()) ||
      item.Email?.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      !typeFilter || item.LabType?.toLowerCase() === typeFilter.toLowerCase();

    const matchesSite = !siteFilter || item.ProjectName === siteFilter;

    return matchesSearch && matchesType && matchesSite;
  });

  useEffect(() => {
    getLabourListSupAllocated();
  }, []);

  const skeletonRows = Array.from({ length: 5 });

  const HandleLabourRemove = async (labID, Name, sitename) => {
    const result = await Swal.fire({
      title: "Are You Sure",
      text: `Free labour ${Name} from site ${sitename}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Confirm",
    });

    if (!result.isConfirmed) return;

    try {
      const reqRemove = await fetch(`${ApiRoute}free-lab-sup-site/${labID}`);

      const res = await reqRemove.json();

      if (res.success) {
        toast.success(res.message);
        getLabourListSupAllocated();
      }
    } catch (error) {
        toast.error(res.message);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container p-3">
        <div className="d-flex justify-content-between">
          <div>
            <h3>All Labours</h3>
            <p style={{ fontWeight: "500", color: "#726d6d" }}>
              Total Labours assigned by contractor to sites allocated to you
            </p>
          </div>
          <div
            style={{ width: "40px", height: "40px" }}
            className="mx-3 sup-count-pill"
          >
            {LabDet?.list?.length || "0"}
          </div>
        </div>
        {loading ? (
          <>
            <div className="row mb-3">
              <div className="col-md-4 mb-2">
                <div className="lab-skel-input"></div>
              </div>

              <div className="col-md-4 mb-2">
                <div className="lab-skel-input"></div>
              </div>

              <div className="col-md-4 mb-2">
                <div className="lab-skel-input"></div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Site</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {skeletonRows?.map((_, index) => (
                    <tr key={index}>
                      <td>
                        <div className="lab-skel-text"></div>
                      </td>

                      <td>
                        <div className="lab-skel-img"></div>
                      </td>

                      <td>
                        <div className="lab-skel-text"></div>
                      </td>

                      <td>
                        <div className="lab-skel-text"></div>
                      </td>

                      <td>
                        <div className="lab-skel-text"></div>
                      </td>

                      <td>
                        <div className="lab-skel-text"></div>
                      </td>

                      <td>
                        <div className="lab-skel-text"></div>
                      </td>

                      <td>
                        <div className="lab-skel-text"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : LabDet.success ? (
          <>
            <div className="row mb-3">
              <div className="col-md-4 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Name or Email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-4 mb-2">
                <select
                  className="form-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">All Labour Types</option>
                  <option value="Misteri">Misteri</option>
                  <option value="Helper">Helper</option>
                </select>
              </div>

              <div className="col-md-4 mb-2">
                <select
                  className="form-select"
                  value={siteFilter}
                  onChange={(e) => setSiteFilter(e.target.value)}
                >
                  <option value="">All Sites</option>

                  {sites.map((site, index) => (
                    <option key={index} value={site}>
                      {site}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th width="80" className="tbl-head">
                      Sr. No.
                    </th>
                    <th width="120" className="tbl-head">
                      Photo
                    </th>
                    <th className="tbl-head">Labour Name</th>
                    <th className="tbl-head">Labour Type</th>
                    <th className="tbl-head">Labour Contact</th>
                    <th className="tbl-head">Labour Email</th>
                    <th width="180" className="tbl-head">
                      Working Site
                    </th>
                    <th className="tbl-head">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLabours?.length > 0 ? (
                    filteredLabours?.map((data, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <img
                            src={`${ApiRoute + data.profileimgpath}`}
                            alt="Labour"
                            className="img-fluid"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.src = "/defaultlabouricon.png";
                            }}
                          />
                        </td>
                        <td>{data.Name}</td>
                        <td>{data.LabType}</td>
                        <td>{data.Phone}</td>
                        <td>{data.Email}</td>
                        <td>{data.ProjectName}</td>
                        <td>
                          <button
                            className="sup-btn-remove p-2"
                            onClick={() =>
                              HandleLabourRemove(
                                data.ID,
                                data.Name,
                                data.ProjectName,
                              )
                            }
                          >
                            Free Labour
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">
                        <div className="no-lab-search-wrap">
                          <div className="no-lab-search-card">
                            <div className="no-lab-search-icon">🔍</div>

                            <h5 className="no-lab-search-title">
                              No Matching Labour Found
                            </h5>

                            <p className="no-lab-search-text">
                              Try changing the search keyword or filters.
                            </p>

                            <button
                              className="btn btn-outline-primary"
                              onClick={() => {
                                setSearch("");
                                setTypeFilter("");
                                setSiteFilter("");
                              }}
                            >
                              Clear Filters
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="no-lab-wrapper">
            <div className="no-lab-card">
              <img
                src="/defaultlabouricon.png"
                alt="No Labour"
                className="no-lab-img"
              />
              <h4 className="no-lab-title">No Labours Assigned Yet</h4>
              <p className="no-lab-text">
                The contractor has not assigned any labourers to your site at
                the moment.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
