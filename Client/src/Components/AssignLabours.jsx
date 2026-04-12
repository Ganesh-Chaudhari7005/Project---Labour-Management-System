import React , {useState , useEffect} from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { ApiRoute } from "./ApiConfig.js";

export default function AssignLabours() {
  const [AllLabours, setAllLabours] = useState([]);
  const [selectedLabour, setseletedLabour] = useState('')
  const FetchLaboursFromDB = async () => {
      let reqLab = await fetch(`${ApiRoute}fetch-labours`);
      console.log(reqLab.status);
  
      let res = await reqLab.json();
      setAllLabours(res);
      console.log(reqLab);
      console.log("response" , res);
      console.log("stsat" ,AllLabours);
    };
    useEffect(() => {
      FetchLaboursFromDB();
    }, []);

 return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ToastContainer
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
      <div className="eq-add-container">
        <div className="eq-add-card">
          <div className="eq-add-header">
            <h2>Assign Labours</h2>
            {/* <p>Add purchased tools to your inventory</p> */}
          </div>

          <div className="eq-add-content">
            <form className="eq-add-form" onSubmit={(e) => handleSubmit(e)}>
              <div className="eq-add-form-group">
                <label>Select Labour (Optional)</label>
                <select
                  value={selectedLabour}
                  onChange={(e) => {
                    setseletedLabour(e.target.value);
                  }}
                >
                  
                </select>
              </div>

             

              <div className="eq-add-form-group">
               
              </div>
              <div className="eq-add-tip">
                Tip: Quantity should match the actual purchased quantity.
              </div>
              <div className="eq-add-button-row">
                <button type="submit" className="eq-add-btn eq-add-primary">
                  Add Equipment
                </button>
              </div>
            </form>

            <div className="eq-add-summary">
              <h3>Summary</h3>

              <div className="eq-add-summary-box">
                <span>Equipment</span>
                <strong>
                  {/* {otherEquip ||
                    fetchedEquip.find(
                      (item) => item.Equipment_ID === selectedEquip,
                    )?.Equipment_Name ||
                    "Not Selected"} */}
                </strong>
              </div>

              <div className="eq-add-summary-box">
                <span>Quantity</span>
                <strong></strong>
              </div>

              <div className="eq-add-tip">
                Tip: You can select or type new equipment.
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
