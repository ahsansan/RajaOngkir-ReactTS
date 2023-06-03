import { API } from "../config/api";
import { useState, useEffect, FC, SyntheticEvent, ChangeEvent } from "react";
import CityData from "../types/city";
import { convertToRupiah } from "../utils/rupiah";

type CostData = {
  service: string;
  cost: any[];
};

const CheckKota: FC = () => {
  const [cities, setCities] = useState<CityData[]>([]);
  const [costList, setCostList] = useState<CostData[]>([]);
  const [asal, setAsal] = useState<string>("");
  const [tujuan, setTujuan] = useState<string>("");
  const [berat, setBerat] = useState<string>("");
  const [kurir, setKurir] = useState<string>("");
  const [keywordKotaAsal, setKeywordKotaAsal] = useState<string>("");
  const [suggestionsKotaAsal, setSuggestionsKotaAsal] = useState<CityData[]>([]);
  const [keywordKotaTujuan, setKeywordKotaTujuan] = useState<string>("");
  const [suggestionsKotaTujuan, setSuggestionsKotaTujuan] = useState<CityData[]>([]);

  useEffect(() => {
    getCity();
  }, []);

  const valBerat = (val: string): void => {
    setBerat(val);
  };
  const valKurir = (val: string): void => {
    setKurir(val);
  };

  const getCity = async () => {
    try {
      const resp = await API.get(`/kota/`);
      setCities(resp.data.rajaongkir.results);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChangeKotaAsal = (event: ChangeEvent<HTMLInputElement>) => {
    const newKeyword = event.target.value;
    setKeywordKotaAsal(newKeyword);
    const filteredSuggestions: any = cities.filter((item: any) =>
      item.city_name.toLowerCase().includes(newKeyword.toLowerCase())
    );
    setSuggestionsKotaAsal(filteredSuggestions);
    const foundKota: any = cities.find(item => item.city_name === event.target.value);
    const idDitemukan = foundKota?.city_id;
    setAsal(idDitemukan)
  };

  const handleInputChangeKotaTujuan = (event: ChangeEvent<HTMLInputElement>) => {
    const newKeyword = event.target.value;
    setKeywordKotaTujuan(newKeyword);
    const filteredSuggestions: any = cities.filter((item: any) =>
      item.city_name.toLowerCase().includes(newKeyword.toLowerCase())
    );
    setSuggestionsKotaTujuan(filteredSuggestions);
    const foundKota: any = cities.find(item => item.city_name === event.target.value);
    const idDitemukan = foundKota?.city_id;
    setTujuan(idDitemukan);
  };

  const getCost = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const resp = await API.get(`ongkos/${asal}/${tujuan}/${berat}/${kurir}`);
      setCostList(resp.data.rajaongkir.results[0].costs);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-lg border shadow-lg bg-slate-50 mx-auto my-7 p-5 rounded-lg">
      <form className="mt-5">
        <div>
          <label htmlFor="city-origin" className="label-section">Pilih Kota Asal</label>
              <input
                type="text"
                id="city-origin"
                value={keywordKotaAsal}
                onChange={handleInputChangeKotaAsal}
                list="cityOriginOptions"
                className="input-section"
                placeholder="-- Pilih Kota --"
              />
              <datalist id="cityOriginOptions">
                {suggestionsKotaAsal.map((city) => (
                  <option key={city.city_id} value={city.city_name} />
                ))}
              </datalist>
        </div>
        <div>
          <label htmlFor="city-to" className="label-section">Pilih Kota Tujuan</label>
              <input
                type="text"
                id="city-to"
                value={keywordKotaTujuan}
                onChange={handleInputChangeKotaTujuan}
                list="cityToOptions"
                className="input-section"
                placeholder="-- Pilih Kota --"
              />
              <datalist id="cityToOptions">
                {suggestionsKotaTujuan.map((city) => (
                  <option key={city.city_id} value={city.city_name} />
                ))}
              </datalist>
        </div>
        <label className="label-section" htmlFor="berat">
          Berat (gram)
        </label>
        <input
          type="number"
          name="berat"
          id="berat"
          onChange={(e) => valBerat(e.target.value)}
          placeholder="Berat kiriman"
          className="w-full h-9 border border-slate-500 rounded-lg mb-1 pl-2"
        />
        <label className="label-section" htmlFor="kurir">
          Kurir
        </label>
        <select
          id="kurir"
          name="kurir"
          onChange={(e) => valKurir(e.target.value)}
          className="w-full h-9 border border-slate-500 rounded-lg mb-5 pl-2"
        >
          <option value="">-- Pilih layanan --</option>
          <option value="jne">JNE</option>
          <option value="pos">POS Indonesia</option>
          <option value="tiki">TIKI</option>
        </select>
        <button
          onClick={getCost}
          className="text-lg bg-red-900 hover:bg-red-700 text-white p-3 rounded-xl mb-5"
        >
          Cek Ongkir
        </button>
      </form>

      <div className="mt-3">
        <div>
          {costList.map((item, index) => (
            <div
              key={index}
              className="p-3 bg-orange-200 text-black m-1 rounded-lg"
            >
              <div>
                <div className="flex flex-column justify-between">
                  <b className="text-red-900">{item.service}</b>
                  <i>{convertToRupiah(item.cost[0].value)}</i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckKota;
