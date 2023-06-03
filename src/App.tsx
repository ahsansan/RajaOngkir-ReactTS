import Check from "./components/Check";
import Header from "./components/Header";
import CheckForm from "./components/CheckForm";
import CheckKota from "./components/CheckKota";
import "./App.css";

function App() {
  return (
    <div>
      <Header title="Cek Ongkir: React TS with TailWind CSS" />
      <CheckKota />
    </div>
  );
}

export default App;
