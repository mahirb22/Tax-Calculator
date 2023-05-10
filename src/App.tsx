import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaxCalculator from "./components/TaxCalculator";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <TaxCalculator />
    </div>
  );
}

export default App;
