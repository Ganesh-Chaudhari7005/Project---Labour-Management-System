import React , {useState , useEffect} from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { ApiRoute } from "./ApiConfig.js";

export default function AssignLabours() {
  const [AllLabours, setAllLabours] = useState([]);
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

      <div className="container">
        <h4 className="mb-2 d-inline-block">Currently Assigned Labours</h4>
      </div>
      <div className="container">
        <h4 className="mb-2 d-inline-block">Manage Labours</h4>
        <form>
          <label>Select Labours:</label>
          <select>
            {AllLabours.map((data , index)=>(
              <option disabled={data.isAvailable ? true : false}>{data.Name} {data.IsAvailable ===1 ? "(Available)" : "(Unavailable) "}</option>
            ))}
          </select>
        </form>
      </div>
    </motion.div>
  );
}
